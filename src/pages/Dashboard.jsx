import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen, CheckCircle2, ClipboardList, Code2, MessageCircle, Sparkles, TrendingUp, Users } from 'lucide-react';
import { formatDate, formatDateTime, formatRelativeTime, isRecentlyActive } from '../lib/helpers';
import Avatar from '../components/Avatar';

export default function Dashboard({ profile, session, setPage }) {
  const [stats, setStats] = useState({ lessons: 0, assignments: 0, posts: 0, messages: 0, progress: 0, submissions: 0 });
  const [latestLessons, setLatestLessons] = useState([]);
  const [latestAssignments, setLatestAssignments] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [progressRows, setProgressRows] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [messageThreads, setMessageThreads] = useState([]);

  useEffect(() => {
    load();
  }, [profile?.id]);

  async function load() {
    if (!profile?.id) return;

    const assignmentQuery = profile.role === 'teacher'
      ? supabase.from('assignments').select('id,title,due_date,assigned_student:profiles!assignments_assigned_to_fkey(full_name)').order('created_at', { ascending: false }).limit(5)
      : supabase.from('assignments').select('id,title,due_date').or(`assigned_to.is.null,assigned_to.eq.${session.user.id}`).order('created_at', { ascending: false }).limit(5);

    const [lessons, assignments, posts, messages, profiles] = await Promise.all([
      supabase.from('lessons').select('id,title,description,order_index,estimated_minutes,category_key').eq('visible', true).order('order_index', { ascending: true }).limit(6),
      assignmentQuery,
      supabase.from('posts').select('id,title,post_type,created_at,author:profiles(full_name)').order('created_at', { ascending: false }).limit(5),
      profile.role === 'teacher'
        ? supabase.from('messages').select('id,student_id,created_at,sender:profiles!messages_sender_id_fkey(full_name, role), student:profiles!messages_student_id_fkey(full_name)').order('created_at', { ascending: false }).limit(40)
        : supabase.from('messages').select('id,student_id,created_at,sender:profiles!messages_sender_id_fkey(full_name, role)').eq('student_id', session.user.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('profiles').select('id,full_name,role,last_seen_at,avatar_url').or('is_deleted.is.null,is_deleted.eq.false').order('last_seen_at', { ascending: false, nullsFirst: false }).limit(10)
    ]);

    setLatestLessons(lessons.data || []);
    setLatestAssignments(assignments.data || []);
    setLatestPosts(posts.data || []);
    setActiveUsers((profiles.data || []).filter((user) => isRecentlyActive(user.last_seen_at, 2)));

    const threadMap = new Map();
    (messages.data || []).forEach((msg) => {
      const key = msg.student_id || msg.id;
      if (!threadMap.has(key)) threadMap.set(key, msg);
    });
    setMessageThreads(Array.from(threadMap.values()).slice(0, 5));

    let progressData = [];
    let submissionsData = [];

    if (profile.role === 'teacher') {
      const { data } = await supabase
        .from('submissions')
        .select('id,submitted_at,teacher_feedback,student:profiles!submissions_student_id_fkey(full_name),assignment:assignments(title)')
        .order('submitted_at', { ascending: false })
        .limit(5);
      submissionsData = data || [];
      setPendingSubmissions(submissionsData);
    } else {
      const { data } = await supabase
        .from('lesson_progress')
        .select('lesson_id,completed_at,last_opened_at,lesson:lessons(id,title,order_index)')
        .eq('student_id', session.user.id)
        .order('last_opened_at', { ascending: false });
      progressData = data || [];
      setProgressRows(progressData);
    }

    const totalLessonsCount = await supabase.from('lessons').select('id', { count: 'exact', head: true }).eq('visible', true);
    const postsCount = await supabase.from('posts').select('id', { count: 'exact', head: true });

    setStats({
      lessons: totalLessonsCount.count || lessons.data?.length || 0,
      assignments: assignments.data?.length || 0,
      posts: postsCount.count || 0,
      messages: messages.data?.length || 0,
      progress: progressData.filter((row) => row.completed_at).length,
      submissions: submissionsData.length
    });
  }

  function openLesson(id) {
    if (!id) return;
    localStorage.setItem('academy_open_lesson_id', id);
    setPage('lessons');
  }

  function openAssignment(id) {
    if (!id) return;
    localStorage.setItem('academy_open_assignment_id', id);
    setPage('assignments');
  }

  function openCommunityPost(id) {
    if (!id) return;
    localStorage.setItem('academy_open_post_id', id);
    setPage('community');
  }

  const lastProgress = progressRows[0];
  const completedPercent = stats.lessons > 0 ? Math.round((stats.progress / stats.lessons) * 100) : 0;

  const cards = profile.role === 'teacher'
    ? [
        { label: 'Toplam ders', value: stats.lessons, icon: BookOpen, page: 'lessons' },
        { label: 'Aktif öğrenci', value: activeUsers.length, icon: Users, page: 'admin' },
        { label: 'Son teslim', value: stats.submissions, icon: ClipboardList, page: 'assignments' },
        { label: 'Mesaj hareketi', value: stats.messages, icon: MessageCircle, page: 'messages' }
      ]
    : [
        { label: 'Dersler', value: `${stats.progress}/${stats.lessons}`, icon: BookOpen, page: 'lessons' },
        { label: 'Aktif ödev', value: stats.assignments, icon: ClipboardList, page: 'assignments' },
        { label: 'Topluluk', value: stats.posts, icon: Users, page: 'community' },
        { label: 'Mesajlar', value: stats.messages, icon: MessageCircle, page: 'messages' }
      ];

  return (
    <div className="page dashboard-page">
      <section className="welcome-card dashboard-hero">
        <div>
          <div className="pill dark"><Sparkles size={16} /> Ana Sayfa</div>
          <h2>{profile?.role === 'teacher' ? 'Öğretmen kontrol merkezi' : `Merhaba ${profile?.full_name || 'Öğrenci'} 👋`}</h2>
          <p>
            {profile?.role === 'teacher'
              ? 'Aktif öğrencileri, son teslimleri, mesajları ve topluluk hareketlerini tek ekrandan takip et.'
              : 'Derslere devam et, ödevlerini takip et, testleri çöz ve toplulukta kod paylaş.'}
          </p>
        </div>
        <div className="hero-action-group">
          <button className="primary-button" onClick={() => setPage('code')}><Code2 size={16} /> Python çalıştır</button>
          <button className="secondary-button" onClick={() => setPage(profile?.role === 'teacher' ? 'admin' : 'lessons')}>{profile?.role === 'teacher' ? 'Yönetimi aç' : 'Derse devam et'}</button>
        </div>
      </section>

      <section className="stats-grid dashboard-stats">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button className="stat-card" key={card.label} onClick={() => setPage(card.page)}>
              <Icon />
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </button>
          );
        })}
      </section>

      {profile.role !== 'teacher' && (
        <section className="panel progress-panel">
          <div className="panel-header">
            <div>
              <h3>Kurs ilerlemen</h3>
              <p className="muted">Tamamladığın dersler ve kaldığın yer burada görünür.</p>
            </div>
            <strong className="progress-big">%{completedPercent}</strong>
          </div>
          <div className="progress-track"><span style={{ width: `${completedPercent}%` }}></span></div>
          <div className="progress-actions">
            <div>
              <strong>{lastProgress?.lesson?.title || latestLessons[0]?.title || 'İlk dersten başla'}</strong>
              <span>{lastProgress ? 'Son kaldığın ders' : 'Henüz ilerleme yok'}</span>
            </div>
            <button className="primary-button" onClick={() => openLesson(lastProgress?.lesson_id || latestLessons[0]?.id)}>
              <BookOpen size={16} /> Devam et
            </button>
          </div>
        </section>
      )}

      <section className="dashboard-grid-3">
        <div className="panel dashboard-panel-card">
          <div className="panel-header">
            <h3>{profile.role === 'teacher' ? 'Aktif öğrenciler' : 'Aktif kişiler'}</h3>
            <button onClick={load} className="link-button">Yenile</button>
          </div>
          {activeUsers.length === 0 ? <p className="muted">Şu an aktif görünen kişi yok.</p> : activeUsers.map((user) => (
            <div className="mini-row active-user-row" key={user.id}>
              <div className="user-inline">
                <span className="online-dot"></span>
                <Avatar name={user.full_name} url={user.avatar_url} className="tiny" />
                <strong>{user.full_name}</strong>
              </div>
              <span>{user.role === 'teacher' ? 'Öğretmen' : 'Öğrenci'} · {formatRelativeTime(user.last_seen_at)}</span>
            </div>
          ))}
        </div>

        <div className="panel dashboard-panel-card">
          <div className="panel-header">
            <h3>Yaklaşan ödevler</h3>
            <button onClick={() => setPage('assignments')} className="link-button">Tümünü gör</button>
          </div>
          {latestAssignments.length === 0 ? <p className="muted">Henüz ödev yok.</p> : latestAssignments.map((assignment) => (
            <button className="mini-row clickable-row" key={assignment.id} onClick={() => openAssignment(assignment.id)}>
              <strong>{assignment.title}</strong>
              <span>Teslim: {formatDate(assignment.due_date)} {assignment.assigned_student?.full_name ? `· ${assignment.assigned_student.full_name}` : ''}</span>
            </button>
          ))}
        </div>

        <div className="panel dashboard-panel-card">
          <div className="panel-header">
            <h3>Topluluk hareketi</h3>
            <button onClick={() => setPage('community')} className="link-button">Topluluğa git</button>
          </div>
          {latestPosts.length === 0 ? <p className="muted">Henüz paylaşım yok.</p> : latestPosts.map((post) => (
            <button className="mini-row clickable-row" key={post.id} onClick={() => openCommunityPost(post.id)}>
              <strong>{post.title}</strong>
              <span>{post.author?.full_name || 'Öğrenci'} · {formatDateTime(post.created_at)}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="two-column">
        <div className="panel">
          <div className="panel-header">
            <h3>{profile.role === 'teacher' ? 'Son teslimler' : 'Önerilen dersler'}</h3>
            <button onClick={() => setPage(profile.role === 'teacher' ? 'assignments' : 'lessons')} className="link-button">Tümünü gör</button>
          </div>
          {profile.role === 'teacher' ? (
            pendingSubmissions.length === 0 ? <p className="muted">Henüz teslim yok.</p> : pendingSubmissions.map((sub) => (
              <div className="mini-row" key={sub.id}>
                <strong>{sub.student?.full_name}</strong>
                <span>{sub.assignment?.title} · {formatDateTime(sub.submitted_at)} {sub.teacher_feedback ? '· geri bildirim var' : '· kontrol bekliyor'}</span>
              </div>
            ))
          ) : (
            latestLessons.length === 0 ? <p className="muted">Henüz ders yok.</p> : latestLessons.map((lesson) => (
              <button className="mini-row clickable-row" key={lesson.id} onClick={() => openLesson(lesson.id)}>
                <strong>{lesson.title}</strong>
                <span>{lesson.description}</span>
              </button>
            ))
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>{profile.role === 'teacher' ? 'Son mesaj hareketi' : 'Arda Hoca mesajları'}</h3>
            <button onClick={() => setPage('messages')} className="link-button">Mesajlara git</button>
          </div>
          {messageThreads.length === 0 ? <p className="muted">Henüz mesaj yok.</p> : messageThreads.map((msg) => (
            <div className="mini-row" key={msg.id}>
              <strong>{profile.role === 'teacher' ? (msg.student?.full_name || 'Öğrenci') : (msg.sender?.full_name || 'Mesaj')}</strong>
              <span>{msg.sender?.role === 'teacher' ? 'Hoca' : 'Öğrenci'} · {formatDateTime(msg.created_at)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
