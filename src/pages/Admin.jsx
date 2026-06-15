import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Clock3, ImageOff, Save, Shield, Trash2, UserCheck } from 'lucide-react';
import { formatDate, formatDateTime, formatRelativeTime, isRecentlyActive } from '../lib/helpers';
import Avatar from '../components/Avatar';

export default function Admin({ profile }) {
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [nameDrafts, setNameDrafts] = useState({});
  const [savingId, setSavingId] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [profilesRes, lessonsRes, assignmentsRes] = await Promise.all([
      supabase.from('profiles').select('*').or('is_deleted.is.null,is_deleted.eq.false').order('created_at', { ascending: false }),
      supabase.from('lessons').select('*').order('order_index'),
      supabase.from('assignments').select('*, assigned_student:profiles!assignments_assigned_to_fkey(full_name)').order('created_at', { ascending: false })
    ]);

    let profileRows = profilesRes.data || [];
    if (profilesRes.error) {
      const fallbackProfiles = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      profileRows = (fallbackProfiles.data || []).filter((user) => !user.is_deleted);
    }
    setStudents(profileRows);
    setLessons(lessonsRes.data || []);
    setAssignments(assignmentsRes.data || []);

    const drafts = {};
    profileRows.forEach((user) => {
      drafts[user.id] = user.full_name || '';
    });
    setNameDrafts(drafts);
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

  async function saveStudentName(user) {
    const nextName = (nameDrafts[user.id] || '').trim();
    if (!nextName) {
      alert('İsim boş bırakılamaz.');
      return;
    }

    if (nextName === user.full_name) return;

    setSavingId(user.id);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: nextName })
      .eq('id', user.id)
      .eq('role', 'student');

    if (error) alert(error.message);
    await load();
    setSavingId('');
  }

  async function clearStudentAvatar(user) {
    if (!user.avatar_url) return;
    if (!confirm(`${user.full_name} adlı öğrencinin profil resmi kaldırılsın mı?`)) return;

    setSavingId(user.id);
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: '' })
      .eq('id', user.id)
      .eq('role', 'student');

    if (error) alert(error.message);
    await load();
    setSavingId('');
  }


  async function deleteStudent(user) {
    if (user.role !== 'student') return;
    const confirmed = confirm(`${user.full_name} adlı öğrenciyi silmek istediğinden emin misin?

Bu öğrenci artık giriş yaptığında platformu kullanamaz. Paylaşımları ve ödev kayıtları sistemde kalabilir.`);
    if (!confirmed) return;

    setSavingId(user.id);
    const { error } = await supabase
      .from('profiles')
      .update({ is_deleted: true, deleted_at: new Date().toISOString(), last_seen_at: null })
      .eq('id', user.id)
      .eq('role', 'student');

    if (error) alert(`Öğrenci silinemedi: ${error.message}

Supabase SQL Editor içinde community_interactions_v8.sql dosyasını çalıştırdığından emin ol.`);
    await load();
    setSavingId('');
  }

  return (
    <div className="page admin-page">
      <div className="page-header">
        <div>
          <div className="pill"><Shield size={16} /> Yönetim</div>
          <h2>Öğretmen paneli</h2>
          <p>Öğrencilerin adlarını sen düzenlersin. Öğrenciler kendi adını değiştiremez, yalnızca profil resmini değiştirebilir.</p>
        </div>
      </div>

      <section className="stats-grid">
        <div className="stat-card static"><UserCheck /><span>Kullanıcı</span><strong>{students.length}</strong></div>
        <div className="stat-card static"><UserCheck /><span>Ders</span><strong>{lessons.length}</strong></div>
        <div className="stat-card static"><UserCheck /><span>Ödev</span><strong>{assignments.length}</strong></div>
        <div className="stat-card static"><Clock3 /><span>Aktif</span><strong>{students.filter((user) => isRecentlyActive(user.last_seen_at)).length}</strong></div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Kullanıcılar</h3>
            <p className="muted">Öğrenci ismini sen değiştirebilirsin. Profil fotoğrafı uygunsuzsa buradan kaldırabilirsin.</p>
          </div>
          <button className="secondary-button" onClick={load}>Yenile</button>
        </div>
        <div className="table-wrap">
          <table className="admin-user-table">
            <thead>
              <tr>
                <th>Kullanıcı</th>
                <th>Rol</th>
                <th>Öğrenci adı</th>
                <th>Profil resmi</th>
                <th>Son görülme</th>
                <th>Durum</th>
                <th>Rol işlemi</th>
                <th>Sil</th>
              </tr>
            </thead>
            <tbody>
              {students.map((user) => {
                const online = isRecentlyActive(user.last_seen_at);
                const isStudent = user.role === 'student';
                const isSelf = user.id === profile.id;
                const draftName = nameDrafts[user.id] ?? user.full_name ?? '';
                const nameChanged = draftName.trim() && draftName.trim() !== user.full_name;

                return (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-user-cell">
                        <Avatar name={user.full_name} url={user.avatar_url} className="small" />
                        <div>
                          <strong>{user.full_name}</strong>
                          <span>{formatDate(user.created_at)}</span>
                        </div>
                      </div>
                    </td>
                    <td>{user.role === 'teacher' ? 'Öğretmen' : 'Öğrenci'}</td>
                    <td>
                      {isStudent ? (
                        <div className="inline-edit">
                          <input
                            value={draftName}
                            onChange={(event) => setNameDrafts((prev) => ({ ...prev, [user.id]: event.target.value }))}
                            placeholder="Öğrenci adı"
                          />
                          <button className="secondary-button small" disabled={savingId === user.id || !nameChanged} onClick={() => saveStudentName(user)}>
                            <Save size={15} /> Kaydet
                          </button>
                        </div>
                      ) : (
                        <span className="muted">Öğretmen adı buradan değiştirilmez.</span>
                      )}
                    </td>
                    <td>
                      {isStudent ? (
                        <div className="avatar-admin-actions">
                          <Avatar name={user.full_name} url={user.avatar_url} className="tiny" />
                          <button className="danger-button small" disabled={savingId === user.id || !user.avatar_url} onClick={() => clearStudentAvatar(user)}>
                            <ImageOff size={15} /> Kaldır
                          </button>
                        </div>
                      ) : (
                        <span className="muted">-</span>
                      )}
                    </td>
                    <td>
                      <div className="last-seen-cell">
                        <strong>{formatRelativeTime(user.last_seen_at)}</strong>
                        <span>{formatDateTime(user.last_seen_at)}</span>
                      </div>
                    </td>
                    <td><span className={`status-pill ${online ? 'online' : 'offline'}`}>{online ? 'Aktif' : 'Çevrim dışı'}</span></td>
                    <td>
                      {!isSelf && (
                        user.role === 'teacher'
                          ? <button className="secondary-button small" onClick={() => makeStudent(user)}>Öğrenci yap</button>
                          : <button className="secondary-button small" onClick={() => makeTeacher(user)}>Öğretmen yap</button>
                      )}
                    </td>
                    <td>
                      {isStudent ? (
                        <button className="danger-button small" disabled={savingId === user.id} onClick={() => deleteStudent(user)}>
                          <Trash2 size={15} /> Sil
                        </button>
                      ) : (
                        <span className="muted">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
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
