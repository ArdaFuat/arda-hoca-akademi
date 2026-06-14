import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ClipboardList, Save, Send, Trash2 } from 'lucide-react';
import { formatDate } from '../lib/helpers';
import { CodeBlock, CodeEditor } from '../components/CodeBlock';

const emptyAssignment = {
  title: '',
  description: '',
  starter_code: '',
  assigned_to: '',
  due_date: ''
};

export default function Assignments({ profile, session }) {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyAssignment);
  const [submissionText, setSubmissionText] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    load();
  }, [profile?.id]);

  async function load() {
    if (!profile?.id) return;
    const query = profile.role === 'teacher'
      ? supabase.from('assignments').select('*, assigned_student:profiles!assignments_assigned_to_fkey(id, full_name)').order('created_at', { ascending: false })
      : supabase.from('assignments').select('*').or(`assigned_to.is.null,assigned_to.eq.${session.user.id}`).order('created_at', { ascending: false });

    const { data } = await query;
    setAssignments(data || []);

    if (profile.role === 'teacher') {
      const { data: studentList } = await supabase.from('profiles').select('id, full_name, role').eq('role', 'student').order('full_name');
      setStudents(studentList || []);
      const { data: allSubs } = await supabase
        .from('submissions')
        .select('*, student:profiles!submissions_student_id_fkey(full_name), assignment:assignments(title)')
        .order('submitted_at', { ascending: false });
      setSubmissions(allSubs || []);
    }
  }

  async function selectAssignment(item) {
    setSelected(item);
    setForm({
      title: item.title,
      description: item.description,
      starter_code: item.starter_code,
      assigned_to: item.assigned_to || '',
      due_date: item.due_date || ''
    });
    setMessage('');

    if (profile.role !== 'teacher') {
      const { data } = await supabase
        .from('submissions')
        .select('*')
        .eq('assignment_id', item.id)
        .eq('student_id', session.user.id)
        .maybeSingle();
      setSubmissionText(data?.code_text || item.starter_code || '');
    }
  }

  async function saveAssignment(e) {
    e.preventDefault();
    setMessage('');

    const payload = {
      title: form.title,
      description: form.description,
      starter_code: form.starter_code,
      assigned_to: form.assigned_to || null,
      due_date: form.due_date || null,
      created_by: profile.id
    };

    const request = selected?.id
      ? supabase.from('assignments').update(payload).eq('id', selected.id)
      : supabase.from('assignments').insert(payload);

    const { error } = await request;
    if (error) setMessage(error.message);
    else {
      setMessage('Ödev kaydedildi.');
      setForm(emptyAssignment);
      setSelected(null);
      load();
    }
  }

  async function submitAssignment() {
    if (!selected) return;
    const payload = {
      assignment_id: selected.id,
      student_id: session.user.id,
      code_text: submissionText
    };
    const { error } = await supabase
      .from('submissions')
      .upsert(payload, { onConflict: 'assignment_id,student_id' });

    setMessage(error ? error.message : 'Ödev teslim edildi.');
  }

  async function deleteAssignment(id) {
    if (!confirm('Bu ödevi silmek istiyor musun?')) return;
    await supabase.from('assignments').delete().eq('id', id);
    setSelected(null);
    setForm(emptyAssignment);
    load();
  }

  async function saveFeedback(submission) {
    const feedback = prompt('Geri bildirim yaz:', submission.teacher_feedback || '');
    if (feedback === null) return;
    await supabase.from('submissions').update({ teacher_feedback: feedback }).eq('id', submission.id);
    load();
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="pill"><ClipboardList size={16} /> Ödevler</div>
          <h2>{profile.role === 'teacher' ? 'Ödev yönetimi' : 'Benim ödevlerim'}</h2>
          <p>Ödevleri takip et, teslim et ve geri bildirimleri gör.</p>
        </div>
      </div>

      <section className="lesson-grid">
        <div className="panel list-panel">
          {assignments.length === 0 && <p className="muted">Henüz ödev yok.</p>}
          {assignments.map((item) => (
            <button key={item.id} className={`lesson-card ${selected?.id === item.id ? 'active' : ''}`} onClick={() => selectAssignment(item)}>
              <span>{item.assigned_student?.full_name || (item.assigned_to ? 'Bireysel ödev' : 'Tüm sınıf')}</span>
              <strong>{item.title}</strong>
              <p>Teslim: {formatDate(item.due_date)}</p>
            </button>
          ))}
        </div>

        <div className="panel detail-panel">
          {selected ? (
            <article className="lesson-detail">
              <div className="panel-header">
                <h3>{selected.title}</h3>
                {profile.role === 'teacher' && <button className="danger-button" onClick={() => deleteAssignment(selected.id)}><Trash2 size={16} /> Sil</button>}
              </div>
              <p className="muted">Teslim: {formatDate(selected.due_date)}</p>
              <div className="content-box whitespace">{selected.description}</div>
              {selected.starter_code && <CodeBlock code={selected.starter_code} title="baslangic_kodu.py" />}

              {profile.role !== 'teacher' && (
                <div className="submission-box">
                  <h4>Teslim alanı</h4>
                  <CodeEditor rows={12} value={submissionText} onChange={setSubmissionText} title="teslim.py" placeholder="Kodunu buraya yaz veya yapıştır..." />
                  <button className="primary-button" onClick={submitAssignment}><Send size={16} /> Ödevi teslim et</button>
                </div>
              )}
            </article>
          ) : (
            <div className="empty-state">Soldan bir ödev seç.</div>
          )}
          {message && <div className="notice">{message}</div>}
        </div>
      </section>

      {profile.role === 'teacher' && (
        <section className="panel">
          <h3>{selected ? 'Ödevi düzenle' : 'Yeni ödev ver'}</h3>
          <form className="form-grid" onSubmit={saveAssignment}>
            <label>
              Başlık
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </label>
            <label>
              Öğrenci
              <select value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}>
                <option value="">Tüm sınıf</option>
                {students.map((student) => <option key={student.id} value={student.id}>{student.full_name}</option>)}
              </select>
            </label>
            <label>
              Teslim tarihi
              <input type="date" value={form.due_date || ''} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
            </label>
            <label className="span-2">
              Açıklama
              <textarea rows="6" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <label className="span-2">
              Başlangıç kodu
              <CodeEditor rows={8} value={form.starter_code} onChange={(value) => setForm({ ...form, starter_code: value })} title="baslangic_kodu.py" placeholder="Öğrencinin başlayacağı kodu buraya yaz..." />
            </label>
            <button className="primary-button span-2"><Save size={16} /> Kaydet</button>
          </form>
        </section>
      )}

      {profile.role === 'teacher' && (
        <section className="panel">
          <h3>Son teslimler</h3>
          {submissions.length === 0 ? <p className="muted">Henüz teslim yok.</p> : submissions.map((sub) => (
            <div className="submission-row" key={sub.id}>
              <div>
                <strong>{sub.student?.full_name}</strong>
                <span>{sub.assignment?.title}</span>
              </div>
              <CodeBlock compact code={`${sub.code_text.slice(0, 400)}${sub.code_text.length > 400 ? '\n# ...' : ''}`} title="teslim_onizleme.py" />
              <div className="row-actions">
                <button className="secondary-button" onClick={() => saveFeedback(sub)}>Geri bildirim yaz</button>
                {sub.teacher_feedback && <span className="feedback-chip">Geri bildirim var</span>}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
