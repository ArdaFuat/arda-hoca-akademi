import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MessageSquarePlus, Trash2, Users } from 'lucide-react';
import { formatDateTime } from '../lib/helpers';

export default function Community({ profile }) {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [commentDrafts, setCommentDrafts] = useState({});

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: postData } = await supabase
      .from('posts')
      .select('*, author:profiles(full_name, role)')
      .order('created_at', { ascending: false });
    setPosts(postData || []);

    const { data: commentData } = await supabase
      .from('comments')
      .select('*, author:profiles(full_name, role)')
      .order('created_at', { ascending: true });
    setComments(commentData || []);
  }

  async function createPost(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await supabase.from('posts').insert({
      author_id: profile.id,
      title,
      content
    });
    setTitle('');
    setContent('');
    load();
  }

  async function createComment(postId) {
    const text = commentDrafts[postId]?.trim();
    if (!text) return;
    await supabase.from('comments').insert({
      post_id: postId,
      author_id: profile.id,
      content: text
    });
    setCommentDrafts({ ...commentDrafts, [postId]: '' });
    load();
  }

  async function deletePost(id) {
    if (!confirm('Paylaşımı silmek istiyor musun?')) return;
    await supabase.from('posts').delete().eq('id', id);
    load();
  }

  async function deleteComment(id) {
    await supabase.from('comments').delete().eq('id', id);
    load();
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="pill"><Users size={16} /> Topluluk</div>
          <h2>Sınıf paylaşımları</h2>
          <p>Öğrenciler burada paylaşım yapabilir. Özel mesaj sadece Arda Hoca’ya gider.</p>
        </div>
      </div>

      <section className="panel">
        <h3>Yeni paylaşım</h3>
        <form className="form-stack" onSubmit={createPost}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Başlık" required />
          <textarea rows="4" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paylaşımını yaz..." />
          <button className="primary-button"><MessageSquarePlus size={16} /> Paylaş</button>
        </form>
      </section>

      <section className="post-list">
        {posts.length === 0 && <div className="empty-state">Henüz paylaşım yok.</div>}
        {posts.map((post) => {
          const related = comments.filter((comment) => comment.post_id === post.id);
          const canDelete = profile.role === 'teacher' || post.author_id === profile.id;
          return (
            <article className="post-card" key={post.id}>
              <div className="post-header">
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.author?.full_name} · {formatDateTime(post.created_at)}</p>
                </div>
                {canDelete && <button className="icon-button danger" onClick={() => deletePost(post.id)}><Trash2 size={17} /></button>}
              </div>
              <div className="whitespace">{post.content}</div>

              <div className="comments">
                {related.map((comment) => (
                  <div className="comment" key={comment.id}>
                    <div>
                      <strong>{comment.author?.full_name}</strong>
                      <span>{formatDateTime(comment.created_at)}</span>
                    </div>
                    <p>{comment.content}</p>
                    {(profile.role === 'teacher' || comment.author_id === profile.id) && (
                      <button className="tiny-button" onClick={() => deleteComment(comment.id)}>Sil</button>
                    )}
                  </div>
                ))}
              </div>

              <div className="comment-form">
                <input
                  value={commentDrafts[post.id] || ''}
                  onChange={(e) => setCommentDrafts({ ...commentDrafts, [post.id]: e.target.value })}
                  placeholder="Yorum yaz..."
                />
                <button className="secondary-button" onClick={() => createComment(post.id)}>Gönder</button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
