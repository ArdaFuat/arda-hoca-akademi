import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CodeBlock, CodeEditor } from '../components/CodeBlock';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  Layers,
  PlayCircle,
  Save,
  Search,
  Trash2
} from 'lucide-react';

const COURSE_SECTIONS = [
  {
    key: 'python',
    title: 'Python',
    shortTitle: 'Python',
    subtitle: 'Python dünyasına giriş ve kursun mantığı.',
    accent: '01'
  },
  {
    key: 'gelistirme-ortami',
    title: 'Python Geliştirme Ortamı',
    shortTitle: 'Geliştirme Ortamı',
    subtitle: 'Replit, kurulum, editör, komut satırı ve ilk uygulama.',
    accent: '02'
  },
  {
    key: 'objeler-veri-yapilari',
    title: 'Python Objeleri ve Veri Yapıları',
    shortTitle: 'Objeler & Veri Yapıları',
    subtitle: 'Sayılar, stringler, listeler, tuple, set ve dictionary.',
    accent: '03'
  },
  {
    key: 'operatorler',
    title: 'Python Operatörler',
    shortTitle: 'Operatörler',
    subtitle: 'Aritmetik, atama, karşılaştırma ve mantıksal operatörler.',
    accent: '04'
  },
  {
    key: 'kosul-ifadeleri',
    title: 'Python Koşul İfadeleri',
    shortTitle: 'Koşullar',
    subtitle: 'if, elif, else ve karar veren programlar.',
    accent: '05'
  },
  {
    key: 'donguler',
    title: 'Python Döngüler',
    shortTitle: 'Döngüler',
    subtitle: 'for, while, break, continue ve döngü uygulamaları.',
    accent: '06'
  },
  {
    key: 'fonksiyonlar',
    title: 'Python Fonksiyonlar',
    shortTitle: 'Fonksiyonlar',
    subtitle: 'Fonksiyon yazma, parametre, lambda ve scope.',
    accent: '07'
  },
  {
    key: 'oop',
    title: 'Python Nesne Tabanlı Programlama',
    shortTitle: 'Nesne Tabanlı',
    subtitle: 'Class, method, kalıtım ve OOP mini proje.',
    accent: '08'
  },
  {
    key: 'django',
    title: 'Django',
    shortTitle: 'Django',
    subtitle: 'Python ile web geliştirme, view, template, model ve migration.',
    accent: '09'
  }
];

const sectionMap = Object.fromEntries(COURSE_SECTIONS.map((section) => [section.key, section]));

const emptyLesson = {
  title: '',
  description: '',
  content: '',
  example_code: '',
  practice_task: '',
  difficulty: 'Başlangıç',
  estimated_minutes: 20,
  category_key: COURSE_SECTIONS[0].key,
  order_index: 0,
  visible: true
};

function inferCategory(lesson) {
  if (lesson.category_key && sectionMap[lesson.category_key]) return lesson.category_key;
  const order = Number(lesson.order_index || 0);
  if (order <= 1) return 'python';
  if (order <= 6) return 'gelistirme-ortami';
  if (order <= 18) return 'objeler-veri-yapilari';
  if (order <= 23) return 'operatorler';
  if (order <= 25) return 'kosul-ifadeleri';
  if (order <= 29) return 'donguler';
  if (order <= 34) return 'fonksiyonlar';
  if (order <= 39) return 'oop';
  return 'django';
}

function getSectionLessonCount(lessons, sectionKey) {
  return lessons.filter((lesson) => inferCategory(lesson) === sectionKey).length;
}

function renderContent(content) {
  if (!content) return <p className="muted">Bu ders için konu anlatımı henüz eklenmemiş.</p>;

  return content.split('\n').map((line, index) => {
    if (!line.trim()) return <br key={index} />;
    if (line.startsWith('### ')) return <h4 key={index}>{line.replace('### ', '')}</h4>;
    if (line.startsWith('## ')) return <h3 key={index}>{line.replace('## ', '')}</h3>;
    if (line.startsWith('- ')) return <li key={index}>{line.replace('- ', '')}</li>;
    return <p key={index}>{line}</p>;
  });
}

export default function Lessons({ profile }) {
  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeSection, setActiveSection] = useState(COURSE_SECTIONS[0].key);
  const [form, setForm] = useState(emptyLesson);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });

    if (!error) {
      const rows = data || [];
      setLessons(rows);
      if (!selected && rows.length > 0) {
        const first = rows[0];
        setSelected(first);
        setActiveSection(inferCategory(first));
      }
    }
  }

  function selectLesson(lesson) {
    setSelected(lesson);
    setActiveSection(inferCategory(lesson));
    setForm({ ...emptyLesson, ...lesson, category_key: inferCategory(lesson) });
    setMessage('');
  }

  function startNewLesson(sectionKey = activeSection) {
    setSelected(null);
    setForm({ ...emptyLesson, category_key: sectionKey, order_index: lessons.length + 1 });
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
      practice_task: form.practice_task || '',
      difficulty: form.difficulty || 'Başlangıç',
      estimated_minutes: Number(form.estimated_minutes || 20),
      category_key: form.category_key || activeSection,
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

  const filteredLessons = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('tr-TR');
    return lessons.filter((lesson) => {
      const matchesSection = inferCategory(lesson) === activeSection;
      const matchesSearch = !q || `${lesson.title} ${lesson.description} ${lesson.content}`.toLocaleLowerCase('tr-TR').includes(q);
      return matchesSection && matchesSearch;
    });
  }, [lessons, activeSection, search]);

  const activeSectionInfo = sectionMap[activeSection] || COURSE_SECTIONS[0];
  const totalMinutes = lessons.reduce((sum, lesson) => sum + Number(lesson.estimated_minutes || 20), 0);

  return (
    <div className="page course-page">
      <section className="course-hero panel">
        <div>
          <div className="pill"><BookOpen size={16} /> Kurs Planı</div>
          <h2>Python Eğitim Yol Haritası</h2>
          <p>Konuları kurs bölümleri halinde takip et. Önce bölüm seç, sonra o bölümün derslerini sırayla aç.</p>
        </div>
        <div className="course-hero-stats">
          <div><strong>{COURSE_SECTIONS.length}</strong><span>Bölüm</span></div>
          <div><strong>{lessons.length}</strong><span>Ders</span></div>
          <div><strong>{totalMinutes}</strong><span>Dakika</span></div>
        </div>
      </section>

      <section className="course-shell">
        <aside className="panel course-sidebar">
          <div className="course-sidebar-title">
            <Layers size={18} />
            <span>Bölümler</span>
          </div>
          <div className="course-search">
            <Search size={17} />
            <input placeholder="Ders ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="section-list">
            {COURSE_SECTIONS.map((section) => {
              const count = getSectionLessonCount(lessons, section.key);
              return (
                <button
                  key={section.key}
                  className={`section-card ${activeSection === section.key ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection(section.key);
                    const firstInSection = lessons.find((lesson) => inferCategory(lesson) === section.key);
                    if (firstInSection) selectLesson(firstInSection);
                    else setSelected(null);
                  }}
                >
                  <span className="section-number">{section.accent}</span>
                  <span className="section-main">
                    <strong>{section.shortTitle}</strong>
                    <small>{count} ders</small>
                  </span>
                  <ChevronRight size={17} />
                </button>
              );
            })}
          </div>
        </aside>

        <main className="course-main">
          <div className="panel module-header-card">
            <div>
              <span className="module-eyebrow">Bölüm {activeSectionInfo.accent}</span>
              <h3>{activeSectionInfo.title}</h3>
              <p>{activeSectionInfo.subtitle}</p>
            </div>
            {profile?.role === 'teacher' && (
              <button className="secondary-button" onClick={() => startNewLesson(activeSection)}>
                + Bu bölüme ders ekle
              </button>
            )}
          </div>

          <div className="lesson-roadmap">
            {filteredLessons.length === 0 && <div className="panel empty-state">Bu bölümde ders bulunamadı.</div>}
            {filteredLessons.map((lesson, index) => (
              <button
                key={lesson.id}
                className={`roadmap-item ${selected?.id === lesson.id ? 'active' : ''}`}
                onClick={() => selectLesson(lesson)}
              >
                <span className="roadmap-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="roadmap-body">
                  <strong>{lesson.title}</strong>
                  <small>{lesson.description}</small>
                  <em><Clock3 size={13} /> {lesson.estimated_minutes || 20} dk · {lesson.difficulty || 'Başlangıç'}</em>
                </span>
                <PlayCircle size={22} />
              </button>
            ))}
          </div>

          <div className="panel lesson-reader">
            {selected ? (
              <article>
                <div className="reader-topline">
                  <span><CheckCircle2 size={16} /> Ders {selected.order_index}</span>
                  <span>{sectionMap[inferCategory(selected)]?.title}</span>
                </div>
                <h3>{selected.title}</h3>
                <p className="reader-description">{selected.description}</p>

                <div className="lesson-content-rich whitespace">{renderContent(selected.content)}</div>

                {selected.example_code && (
                  <div className="example-section">
                    <h4><Code2 size={17} /> Örnek kod</h4>
                    <CodeBlock code={selected.example_code} title={`${selected.title || 'ornek'}.py`} />
                  </div>
                )}

                {selected.practice_task && (
                  <div className="practice-box">
                    <strong>Mini görev</strong>
                    <p>{selected.practice_task}</p>
                  </div>
                )}
              </article>
            ) : (
              <div className="empty-state">Bu bölümden bir ders seç.</div>
            )}
          </div>
        </main>
      </section>

      {profile?.role === 'teacher' && (
        <section className="panel teacher-editor">
          <div className="panel-header">
            <div>
              <h3>{selected ? 'Dersi düzenle' : 'Yeni ders ekle'}</h3>
              <p className="muted">Bu alan sadece öğretmene görünür. Öğrenciler kurs planını ve ders içeriklerini görür.</p>
            </div>
            {selected && <button className="danger-button" onClick={() => deleteLesson(selected.id)}><Trash2 size={16} /> Sil</button>}
          </div>
          <form className="form-grid" onSubmit={saveLesson}>
            <label>
              Bölüm
              <select value={form.category_key} onChange={(e) => setForm({ ...form, category_key: e.target.value })}>
                {COURSE_SECTIONS.map((section) => <option key={section.key} value={section.key}>{section.title}</option>)}
              </select>
            </label>
            <label>
              Sıra
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: e.target.value })} />
            </label>
            <label>
              Zorluk
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option>Başlangıç</option>
                <option>Orta</option>
                <option>İleri</option>
              </select>
            </label>
            <label>
              Süre / dakika
              <input type="number" value={form.estimated_minutes} onChange={(e) => setForm({ ...form, estimated_minutes: e.target.value })} />
            </label>
            <label className="span-2">
              Başlık
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </label>
            <label className="span-2">
              Kısa açıklama
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <label className="span-2">
              Konu anlatımı
              <textarea rows="10" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </label>
            <label className="span-2">
              Örnek kod
              <CodeEditor rows={8} value={form.example_code} onChange={(value) => setForm({ ...form, example_code: value })} title="ornek_kod.py" placeholder="Örnek Python kodunu buraya yaz..." />
            </label>
            <label className="span-2">
              Mini görev
              <textarea rows="3" value={form.practice_task} onChange={(e) => setForm({ ...form, practice_task: e.target.value })} />
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
