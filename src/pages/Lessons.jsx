import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen, Save, Trash2 } from 'lucide-react';

const emptyLesson = {
  title: '',
  description: '',
  content: '',
  example_code: '',
  order_index: 0,
  visible: true
};

export default function Lessons({ profile }) {
  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyLesson);
  const [message, setMessage] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });
    if (!error) setLessons(data || []);
  }

  function selectLesson(lesson) {
    setSelected(lesson);
    setForm(lesson);
    setMessage('');
  }

  async function saveLesson(e) {
    e.preventDefault();
    setMessage('');

    const payload = {
      title: form.title,
      description: form.description,
      content: form.content,
      example_code: form.example_code,
      order_index: Number(form.order_index || 0),
      visible: Boolean(form.visible),
      created_by: profile.id
    };

    const query = selected?.id
      ? supabase.from('lessons').update(payload).eq('id', selected.id)
      : supabase.from('lessons').insert(payload);

    const { error } = await query;
    if (error) setMessage(error.message);
    else {
      setMessage('Ders kaydedildi.');
      setForm(emptyLesson);
      setSelected(null);
      load();
    }
  }

  async function deleteLesson(id) {
    if (!confirm('Bu dersi silmek istiyor musun?')) return;
    await supabase.from('lessons').delete().eq('id', id);
    setSelected(null);
    setForm(emptyLesson);
    load();
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="pill"><BookOpen size={16} /> Dersler</div>
          <h2>Konu anlatımları</h2>
          <p>Dersleri oku, örnek kodları incele ve Python alanında dene.</p>
        </div>
      </div>

      <section className="lesson-grid">
        <div className="panel list-panel">
          {lessons.length === 0 && <p className="muted">Henüz ders eklenmemiş.</p>}
          {lessons.map((lesson) => (
            <button key={lesson.id} className={`lesson-card ${selected?.id === lesson.id ? 'active' : ''}`} onClick={() => selectLesson(lesson)}>
              <span>Ders {lesson.order_index || '-'}</span>
              <strong>{lesson.title}</strong>
              <p>{lesson.description}</p>
            </button>
          ))}
        </div>

        <div className="panel detail-panel">
          {selected ? (
            <article className="lesson-detail">
              <h3>{selected.title}</h3>
              <p className="muted">{selected.description}</p>
              <div className="content-box whitespace">{selected.content}</div>
              {selected.example_code && (
                <>
                  <h4>Örnek kod</h4>
                  <pre className="code-block"><code>{selected.example_code}</code></pre>
                </>
              )}
            </article>
          ) : (
            <div className="empty-state">Soldan bir ders seç.</div>
          )}
        </div>
      </section>

      {profile?.role === 'teacher' && (
        <section className="panel">
          <div className="panel-header">
            <h3>{selected ? 'Dersi düzenle' : 'Yeni ders ekle'}</h3>
            {selected && <button className="danger-button" onClick={() => deleteLesson(selected.id)}><Trash2 size={16} /> Sil</button>}
          </div>
          <form className="form-grid" onSubmit={saveLesson}>
            <label>
              Başlık
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </label>
            <label>
              Sıra
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: e.target.value })} />
            </label>
            <label className="span-2">
              Kısa açıklama
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <label className="span-2">
              Konu anlatımı
              <textarea rows="8" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </label>
            <label className="span-2">
              Örnek kod
              <textarea rows="7" value={form.example_code} onChange={(e) => setForm({ ...form, example_code: e.target.value })} />
            </label>
            <label className="checkbox-label span-2">
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} />
              Öğrencilere görünür
            </label>
            {message && <div className="notice span-2">{message}</div>}
            <button className="primary-button span-2"><Save size={16} /> Kaydet</button>
          </form>
        </section>
      )}
    </div>
  );
}
