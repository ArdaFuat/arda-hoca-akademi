import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen, ClipboardList, Code2, MessageCircle, Sparkles, Users } from 'lucide-react';
import { formatDate } from '../lib/helpers';

export default function Dashboard({ profile, session, setPage }) {
  const [stats, setStats] = useState({ lessons: 0, assignments: 0, posts: 0, messages: 0 });
  const [latestLessons, setLatestLessons] = useState([]);
  const [latestAssignments, setLatestAssignments] = useState([]);

  useEffect(() => {
    load();
  }, [profile?.id]);

  async function load() {
    if (!profile?.id) return;

    const [lessons, assignments, posts, messages] = await Promise.all([
      supabase.from('lessons').select('id,title,description,order_index').order('order_index', { ascending: true }).limit(3),
      profile.role === 'teacher'
        ? supabase.from('assignments').select('id,title,due_date').order('created_at', { ascending: false }).limit(3)
        : supabase.from('assignments').select('id,title,due_date').or(`assigned_to.is.null,assigned_to.eq.${session.user.id}`).order('created_at', { ascending: false }).limit(3),
      supabase.from('posts').select('id', { count: 'exact', head: true }),
      profile.role === 'teacher'
        ? supabase.from('messages').select('id', { count: 'exact', head: true })
        : supabase.from('messages').select('id', { count: 'exact', head: true }).eq('student_id', session.user.id)
    ]);

    setLatestLessons(lessons.data || []);
    setLatestAssignments(assignments.data || []);
    setStats({
      lessons: lessons.data?.length || 0,
      assignments: assignments.data?.length || 0,
      posts: posts.count || 0,
      messages: messages.count || 0
    });
  }

  const cards = [
    { label: 'Dersler', value: stats.lessons, icon: BookOpen, page: 'lessons' },
    { label: 'Aktif ödevler', value: stats.assignments, icon: ClipboardList, page: 'assignments' },
    { label: 'Topluluk postları', value: stats.posts, icon: Users, page: 'community' },
    { label: 'Mesajlar', value: stats.messages, icon: MessageCircle, page: 'messages' }
  ];

  return (
    <div className="page">
      <section className="welcome-card">
        <div>
          <div className="pill dark"><Sparkles size={16} /> Hoş geldin</div>
          <h2>Merhaba {profile?.full_name || 'Öğrenci'} 👋</h2>
          <p>
            Bugün dersleri takip edebilir, ödevlerini teslim edebilir,
            toplulukta paylaşım yapabilir ve Arda Hoca’ya mesaj atabilirsin.
          </p>
        </div>
        <button className="primary-button" onClick={() => setPage('code')}>Python çalıştır</button>
      </section>

      <section className="stats-grid">
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

      <section className="two-column">
        <div className="panel">
          <div className="panel-header">
            <h3>Son dersler</h3>
            <button onClick={() => setPage('lessons')} className="link-button">Tümünü gör</button>
          </div>
          {latestLessons.length === 0 ? <p className="muted">Henüz ders yok.</p> : latestLessons.map((lesson) => (
            <div className="mini-row" key={lesson.id}>
              <strong>{lesson.title}</strong>
              <span>{lesson.description}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Aktif ödevler</h3>
            <button onClick={() => setPage('assignments')} className="link-button">Tümünü gör</button>
          </div>
          {latestAssignments.length === 0 ? <p className="muted">Henüz ödev yok.</p> : latestAssignments.map((assignment) => (
            <div className="mini-row" key={assignment.id}>
              <strong>{assignment.title}</strong>
              <span>Teslim: {formatDate(assignment.due_date)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
