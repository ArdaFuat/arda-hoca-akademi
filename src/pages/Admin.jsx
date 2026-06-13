import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, UserCheck } from 'lucide-react';
import { formatDate } from '../lib/helpers';

export default function Admin({ profile }) {
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [profilesRes, lessonsRes, assignmentsRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('lessons').select('*').order('order_index'),
      supabase.from('assignments').select('*, assigned_student:profiles!assignments_assigned_to_fkey(full_name)').order('created_at', { ascending: false })
    ]);
    setStudents(profilesRes.data || []);
    setLessons(lessonsRes.data || []);
    setAssignments(assignmentsRes.data || []);
  }

  async function makeTeacher(user) {
    if (!confirm(`${user.full_name} öğretmen yapılsın mı?`)) return;
    await supabase.from('profiles').update({ role: 'teacher' }).eq('id', user.id);
    load();
  }

  async function makeStudent(user) {
    if (!confirm(`${user.full_name} öğrenci yapılsın mı?`)) return;
    await supabase.from('profiles').update({ role: 'student' }).eq('id', user.id);
    load();
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="pill"><Shield size={16} /> Yönetim</div>
          <h2>Öğretmen paneli</h2>
          <p>Öğrencileri, dersleri ve ödevleri genel olarak kontrol et.</p>
        </div>
      </div>

      <section className="stats-grid">
        <div className="stat-card static"><UserCheck /><span>Kullanıcı</span><strong>{students.length}</strong></div>
        <div className="stat-card static"><UserCheck /><span>Ders</span><strong>{lessons.length}</strong></div>
        <div className="stat-card static"><UserCheck /><span>Ödev</span><strong>{assignments.length}</strong></div>
      </section>

      <section className="panel">
        <h3>Kullanıcılar</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Ad</th><th>Rol</th><th>Kayıt</th><th>İşlem</th></tr>
            </thead>
            <tbody>
              {students.map((user) => (
                <tr key={user.id}>
                  <td>{user.full_name}</td>
                  <td>{user.role === 'teacher' ? 'Öğretmen' : 'Öğrenci'}</td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    {user.id !== profile.id && (
                      user.role === 'teacher'
                        ? <button className="secondary-button" onClick={() => makeStudent(user)}>Öğrenci yap</button>
                        : <button className="secondary-button" onClick={() => makeTeacher(user)}>Öğretmen yap</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="two-column">
        <div className="panel">
          <h3>Ders özeti</h3>
          {lessons.map((lesson) => <div className="mini-row" key={lesson.id}><strong>{lesson.title}</strong><span>{lesson.visible ? 'Görünür' : 'Gizli'}</span></div>)}
        </div>
        <div className="panel">
          <h3>Ödev özeti</h3>
          {assignments.map((assignment) => <div className="mini-row" key={assignment.id}><strong>{assignment.title}</strong><span>{assignment.assigned_student?.full_name || 'Tüm sınıf'}</span></div>)}
        </div>
      </section>
    </div>
  );
}
