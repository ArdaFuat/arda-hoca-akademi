import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Code2,
  ExternalLink,
  Filter,
  Heart,
  Link as LinkIcon,
  MessageSquarePlus,
  Pin,
  Reply,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Users
} from 'lucide-react';
import { formatDateTime } from '../lib/helpers';
import { CodeEditor, RunnableCodeBlock } from '../components/CodeBlock';

const POST_TYPES = [
  { value: 'question', label: 'Soru', helper: 'Anlamadığın bir konuyu sor.' },
  { value: 'code', label: 'Kod Paylaşımı', helper: 'Kodunu paylaş, çıktısını göster, yorum al.' },
  { value: 'project', label: 'Mini Proje', helper: 'Yaptığın çalışmayı göster.' },
  { value: 'resource', label: 'Kaynak', helper: 'Link, araç veya not paylaş.' },
  { value: 'announcement', label: 'Duyuru', helper: 'Öğretmen duyurusu veya sınıf notu.' }
];

const typeMap = Object.fromEntries(POST_TYPES.map((type) => [type.value, type]));

export default function Community({ profile, setPage }) {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [quickFilter, setQuickFilter] = useState('all');
  const [commentDrafts, setCommentDrafts] = useState({});
  const [replyingTo, setReplyingTo] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    post_type: 'question',
    code_snippet: '',
    resource_url: '',
    lesson_id: '',
    assignment_id: ''
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const postQuery = supabase
      .from('posts')
      .select('*, author:profiles(full_name, role), lesson:lessons(title), assignment:assignments(title)')
      .order('is_pinned', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    const [postData, commentData, likeData, lessonData, assignmentData] = await Promise.all([
      postQuery,
      supabase.from('comments').select('*, author:profiles(full_name, role)').order('created_at', { ascending: true }),
      supabase.from('community_likes').select('*'),
      supabase.from('lessons').select('id, title, category_key, order_index').order('order_index', { ascending: true }),
      supabase.from('assignments').select('id, title, due_date').order('created_at', { ascending: false })
    ]);

    let rows = [];
    if (postData.error) {
      console.warn('Topluluk ek alanları hazır değil, temel postlar yükleniyor:', postData.error.message);
      const fallback = await supabase
        .from('posts')
        .select('*, author:profiles(full_name, role)')
        .order('created_at', { ascending: false });
      rows = fallback.data || [];
      setPosts(rows);
    } else {
      rows = postData.data || [];
      setPosts(rows);
    }

    if (commentData.error) console.warn('Yorumlar yüklenemedi:', commentData.error.message);
    else setComments(commentData.data || []);

    if (likeData.error) {
      console.warn('Beğeni tablosu hazır değil:', likeData.error.message);
      setLikes([]);
    } else {
      setLikes(likeData.data || []);
    }

    setLessons(lessonData.data || []);
    setAssignments(assignmentData.data || []);

    const requestedPostId = localStorage.getItem('academy_open_post_id');
    if (requestedPostId) {
      localStorage.removeItem('academy_open_post_id');
      setSelectedId(requestedPostId);
    } else if (!selectedId && rows.length > 0) {
      setSelectedId(rows[0].id);
    }
  }

  async function createPost(e) {
    e.preventDefault();
    if (!form.title.trim()) return;

    const payload = {
      author_id: profile.id,
      title: form.title.trim(),
      content: form.content.trim(),
      post_type: form.post_type,
      code_snippet: form.code_snippet.trim(),
      resource_url: form.resource_url.trim(),
      lesson_id: form.lesson_id || null,
      assignment_id: form.assignment_id || null
    };

    const { data, error } = await supabase.from('posts').insert(payload).select('*').single();
    if (error) {
      alert(`Paylaşım kaydedilemedi: ${error.message}\n\nSupabase SQL Editor içinde community_interactions_v8.sql dosyasını çalıştırdığından emin ol.`);
      return;
    }

    setForm({ title: '', content: '', post_type: 'question', code_snippet: '', resource_url: '', lesson_id: '', assignment_id: '' });
    setSelectedId(data.id);
    load();
  }

  async function createComment(postId, parentId = null) {
    const draftKey = parentId ? `reply-${parentId}` : postId;
    const text = commentDrafts[draftKey]?.trim();
    if (!text) return;

    const payload = {
      post_id: postId,
      author_id: profile.id,
      content: text,
      parent_id: parentId
    };

    const { error } = await supabase.from('comments').insert(payload);
    if (error) {
      alert(`Yorum kaydedilemedi: ${error.message}`);
      return;
    }

    setCommentDrafts({ ...commentDrafts, [draftKey]: '' });
    setReplyingTo('');
    load();
  }

  async function deletePost(id) {
    if (!confirm('Paylaşımı silmek istiyor musun?')) return;
    await supabase.from('posts').delete().eq('id', id);
    if (selectedId === id) setSelectedId(null);
    load();
  }

  async function deleteComment(id) {
    if (!confirm('Bu yorumu silmek istiyor musun?')) return;
    await supabase.from('comments').delete().eq('id', id);
    load();
  }

  async function togglePostFlag(post, field) {
    if (profile.role !== 'teacher') return;
    const { error } = await supabase.from('posts').update({ [field]: !post[field] }).eq('id', post.id);
    if (error) {
      alert(`Bu özellik için community_interactions_v8.sql gerekli: ${error.message}`);
      return;
    }
    load();
  }

  function likeCount(targetType, targetId) {
    return likes.filter((like) => like.target_type === targetType && like.target_id === targetId).length;
  }

  function iLiked(targetType, targetId) {
    return likes.some((like) => like.target_type === targetType && like.target_id === targetId && like.user_id === profile.id);
  }

  async function toggleLike(targetType, targetId) {
    const existing = likes.find((like) => like.target_type === targetType && like.target_id === targetId && like.user_id === profile.id);
    const { error } = existing
      ? await supabase.from('community_likes').delete().eq('id', existing.id)
      : await supabase.from('community_likes').insert({ target_type: targetType, target_id: targetId, user_id: profile.id });

    if (error) {
      alert(`Beğeni kaydedilemedi: ${error.message}\n\nSupabase SQL Editor içinde community_interactions_v8.sql dosyasını çalıştırdığından emin ol.`);
      return;
    }
    load();
  }

  function openLesson(id) {
    if (!id) return;
    localStorage.setItem('academy_open_lesson_id', id);
    setPage?.('lessons');
  }

  function openAssignment(id) {
    if (!id) return;
    localStorage.setItem('academy_open_assignment_id', id);
    setPage?.('assignments');
  }

  function sendCodeToRunner(code) {
    if (!code?.trim()) return;
    localStorage.setItem('academy_runner_code', code);
    setPage?.('code');
  }

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('tr-TR');
    return posts.filter((post) => {
      const matchesSearch = !q || `${post.title} ${post.content} ${post.code_snippet || ''}`.toLocaleLowerCase('tr-TR').includes(q);
      const matchesType = typeFilter === 'all' || (post.post_type || 'question') === typeFilter;
      const matchesQuick = quickFilter === 'all'
        || (quickFilter === 'pinned' && post.is_pinned)
        || (quickFilter === 'solved' && post.is_solved)
        || (quickFilter === 'helpful' && post.is_helpful)
        || (quickFilter === 'liked' && iLiked('post', post.id))
        || (quickFilter === 'code' && post.code_snippet);
      return matchesSearch && matchesType && matchesQuick;
    });
  }, [posts, likes, search, typeFilter, quickFilter]);

  const selected = posts.find((post) => post.id === selectedId) || filteredPosts[0] || null;
  const selectedComments = selected ? comments.filter((comment) => comment.post_id === selected.id) : [];
  const currentType = typeMap[form.post_type] || typeMap.question;

  function childComments(parentId) {
    return selectedComments.filter((comment) => comment.parent_id === parentId);
  }

  function renderComment(comment, depth = 0) {
    const replies = childComments(comment.id);
    const canDelete = profile.role === 'teacher' || comment.author_id === profile.id;
    return (
      <div className={`comment threaded depth-${Math.min(depth, 3)}`} key={comment.id}>
        <div className="comment-head">
          <div>
            <strong>{comment.author?.full_name}</strong>
            <span>{formatDateTime(comment.created_at)}</span>
          </div>
          {canDelete && <button className="tiny-button danger" onClick={() => deleteComment(comment.id)}>Sil</button>}
        </div>
        <p>{comment.content}</p>
        <div className="comment-actions-row">
          <button className={`tiny-button ${iLiked('comment', comment.id) ? 'liked' : ''}`} onClick={() => toggleLike('comment', comment.id)}>
            <Heart size={13} /> Beğen {likeCount('comment', comment.id) || ''}
          </button>
          <button className="tiny-button" onClick={() => setReplyingTo(replyingTo === comment.id ? '' : comment.id)}>
            <Reply size={13} /> Yanıtla
          </button>
        </div>
        {replyingTo === comment.id && (
          <div className="comment-form reply-form">
            <input
              value={commentDrafts[`reply-${comment.id}`] || ''}
              onChange={(e) => setCommentDrafts({ ...commentDrafts, [`reply-${comment.id}`]: e.target.value })}
              placeholder={`${comment.author?.full_name || 'yoruma'} yanıt yaz...`}
            />
            <button className="secondary-button" onClick={() => createComment(selected.id, comment.id)}>Yanıtla</button>
          </div>
        )}
        {replies.length > 0 && <div className="reply-list">{replies.map((reply) => renderComment(reply, depth + 1))}</div>}
      </div>
    );
  }

  return (
    <div className="page community-page">
      <div className="page-header">
        <div>
          <div className="pill"><Users size={16} /> Topluluk</div>
          <h2>Sınıf topluluğu</h2>
          <p>Kod paylaş, çıktısını çalıştır, yorumlara yanıt ver, beğen ve öğretmen işaretlemeleriyle konuları düzenli tut.</p>
        </div>
      </div>

      <section className="community-shell">
        <aside className="community-left">
          <section className="panel community-compose">
            <h3>Yeni paylaşım</h3>
            <form className="form-stack" onSubmit={createPost}>
              <div className="type-grid">
                {POST_TYPES.map((type) => (
                  <button
                    type="button"
                    key={type.value}
                    className={`type-chip ${form.post_type === type.value ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, post_type: type.value })}
                    title={type.helper}
                  >
                    <Tag size={14} /> {type.label}
                  </button>
                ))}
              </div>

              <div className="compose-helper">
                <strong>{currentType.label}</strong>
                <span>{currentType.helper}</span>
              </div>

              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Başlık" required />
              <textarea rows="4" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Paylaşım açıklaması, soru veya not..." />

              <label>
                Kod paylaşımı
                <CodeEditor rows={7} value={form.code_snippet} onChange={(value) => setForm({ ...form, code_snippet: value })} title="paylasim.py" placeholder="Kod paylaşacaksan buraya yaz..." />
              </label>

              <div className="form-grid compact-form-grid">
                <label>
                  İlgili ders
                  <select value={form.lesson_id} onChange={(e) => setForm({ ...form, lesson_id: e.target.value })}>
                    <option value="">Ders bağlama</option>
                    {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.order_index}. {lesson.title}</option>)}
                  </select>
                </label>
                <label>
                  İlgili ödev
                  <select value={form.assignment_id} onChange={(e) => setForm({ ...form, assignment_id: e.target.value })}>
                    <option value="">Ödev bağlama</option>
                    {assignments.map((assignment) => <option key={assignment.id} value={assignment.id}>{assignment.title}</option>)}
                  </select>
                </label>
              </div>

              <input value={form.resource_url} onChange={(e) => setForm({ ...form, resource_url: e.target.value })} placeholder="Kaynak linki / GitHub / video linki" />
              <button className="primary-button"><MessageSquarePlus size={16} /> Paylaş</button>
            </form>
          </section>

          <section className="panel community-list-panel">
            <div className="course-search">
              <Search size={17} />
              <input placeholder="Toplulukta ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="community-filter-row">
              <Filter size={16} />
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">Tüm türler</option>
                {POST_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
              <select value={quickFilter} onChange={(e) => setQuickFilter(e.target.value)}>
                <option value="all">Tümü</option>
                <option value="pinned">Sabitlenenler</option>
                <option value="solved">Çözülenler</option>
                <option value="helpful">Faydalı seçilenler</option>
                <option value="liked">Beğendiklerim</option>
                <option value="code">Kod içerenler</option>
              </select>
            </div>
            <div className="community-post-list">
              {filteredPosts.length === 0 && <div className="empty-state small">Henüz paylaşım yok.</div>}
              {filteredPosts.map((post) => {
                const relatedCount = comments.filter((comment) => comment.post_id === post.id).length;
                return (
                  <button key={post.id} className={`community-post-item ${selected?.id === post.id ? 'active' : ''} ${post.is_pinned ? 'pinned' : ''}`} onClick={() => setSelectedId(post.id)}>
                    <span className={`post-type-dot ${post.post_type || 'question'}`}>{post.is_pinned ? '📌 ' : ''}{typeMap[post.post_type]?.label || 'Paylaşım'}</span>
                    <strong>{post.title}</strong>
                    <small>{post.author?.full_name} · {formatDateTime(post.created_at)} · {relatedCount} yorum</small>
                    <span className="post-mini-badges">
                      {post.code_snippet && <em><Code2 size={13} /> Kod</em>}
                      {post.is_helpful && <em className="helpful"><Sparkles size={13} /> Faydalı</em>}
                      {post.is_solved && <em className="solved"><CheckCircle2 size={13} /> Çözüldü</em>}
                      {likeCount('post', post.id) > 0 && <em><Heart size={13} /> {likeCount('post', post.id)}</em>}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        <main className="panel community-detail-panel">
          {selected ? (
            <article className="community-detail">
              <div className="post-detail-header">
                <div>
                  <span className={`post-type-pill ${selected.post_type || 'question'}`}>{typeMap[selected.post_type]?.label || 'Paylaşım'}</span>
                  <h3>{selected.title}</h3>
                  <p>{selected.author?.full_name} · {formatDateTime(selected.created_at)}</p>
                </div>
                <div className="post-admin-actions">
                  <button className={`secondary-button ${iLiked('post', selected.id) ? 'liked-button' : ''}`} onClick={() => toggleLike('post', selected.id)}>
                    <Heart size={16} /> Beğen {likeCount('post', selected.id) || ''}
                  </button>
                  {profile.role === 'teacher' && (
                    <>
                      <button className={`secondary-button ${selected.is_helpful ? 'active-action' : ''}`} onClick={() => togglePostFlag(selected, 'is_helpful')}><Sparkles size={16} /> {selected.is_helpful ? 'Faydalı kaldır' : 'Faydalı'}</button>
                      <button className={`secondary-button ${selected.is_solved ? 'active-action' : ''}`} onClick={() => togglePostFlag(selected, 'is_solved')}><CheckCircle2 size={16} /> {selected.is_solved ? 'Çözümü kaldır' : 'Çözüldü'}</button>
                      <button className={`secondary-button ${selected.is_pinned ? 'active-action' : ''}`} onClick={() => togglePostFlag(selected, 'is_pinned')}><Pin size={16} /> {selected.is_pinned ? 'Sabiti kaldır' : 'Sabitle'}</button>
                    </>
                  )}
                  {(profile.role === 'teacher' || selected.author_id === profile.id) && (
                    <button className="icon-button danger" onClick={() => deletePost(selected.id)}><Trash2 size={17} /></button>
                  )}
                </div>
              </div>

              <div className="post-links-row">
                {selected.lesson_id && (
                  <button className="secondary-button" onClick={() => openLesson(selected.lesson_id)}><BookOpen size={16} /> İlgili derse git</button>
                )}
                {selected.assignment_id && (
                  <button className="secondary-button" onClick={() => openAssignment(selected.assignment_id)}><ClipboardList size={16} /> İlgili ödeve git</button>
                )}
                {selected.resource_url && (
                  <a className="secondary-button" href={selected.resource_url} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Kaynağı aç</a>
                )}
              </div>

              {(selected.lesson?.title || selected.assignment?.title) && (
                <div className="linked-context-box">
                  {selected.lesson?.title && <span><BookOpen size={15} /> Ders: {selected.lesson.title}</span>}
                  {selected.assignment?.title && <span><ClipboardList size={15} /> Ödev: {selected.assignment.title}</span>}
                </div>
              )}

              <div className="community-post-content whitespace">{selected.content || 'Açıklama eklenmemiş.'}</div>

              {selected.code_snippet && (
                <div className="community-code-section">
                  <h4><Code2 size={17} /> Paylaşılan kod ve çıktısı</h4>
                  <RunnableCodeBlock code={selected.code_snippet} title="topluluk_paylasimi.py" onSendToRunner={sendCodeToRunner} />
                </div>
              )}

              {selected.resource_url && (
                <div className="resource-preview">
                  <LinkIcon size={17} />
                  <span>{selected.resource_url}</span>
                </div>
              )}

              <div className="comments detail-comments">
                <h4>Yorumlar</h4>
                {selectedComments.filter((comment) => !comment.parent_id).length === 0 && <p className="muted">Bu paylaşımda henüz yorum yok.</p>}
                {selectedComments.filter((comment) => !comment.parent_id).map((comment) => renderComment(comment))}
              </div>

              <div className="comment-form">
                <input
                  value={commentDrafts[selected.id] || ''}
                  onChange={(e) => setCommentDrafts({ ...commentDrafts, [selected.id]: e.target.value })}
                  placeholder="Bu başlığa yorum yaz..."
                />
                <button className="secondary-button" onClick={() => createComment(selected.id)}>Gönder</button>
              </div>
            </article>
          ) : (
            <div className="empty-state">Soldan bir paylaşım seç.</div>
          )}
        </main>
      </section>
    </div>
  );
}
