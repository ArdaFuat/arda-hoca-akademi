import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, Send, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { formatDateTime } from '../lib/helpers';

export default function Messages({ profile, session }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(profile.role === 'teacher' ? '' : session.user.id);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [liveStatus, setLiveStatus] = useState('connecting');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (profile.role === 'teacher') loadStudents();
  }, [profile?.id]);

  useEffect(() => {
    if (!selectedStudent) return;

    let isActive = true;
    setLiveStatus('connecting');
    loadMessages(selectedStudent);

    const channel = supabase
      .channel(`messages-live-${selectedStudent}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `student_id=eq.${selectedStudent}` },
        () => loadMessages(selectedStudent)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages', filter: `student_id=eq.${selectedStudent}` },
        () => loadMessages(selectedStudent)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages', filter: `student_id=eq.${selectedStudent}` },
        () => loadMessages(selectedStudent)
      )
      .subscribe((status) => {
        if (!isActive) return;
        setLiveStatus(status === 'SUBSCRIBED' ? 'live' : 'connecting');
      });

    // Realtime bazı tarayıcı/ağ durumlarında geç düşerse konuşma yine yenilensin.
    const interval = window.setInterval(() => {
      if (document.visibilityState !== 'hidden') loadMessages(selectedStudent, false);
    }, 5000);

    const refreshOnFocus = () => loadMessages(selectedStudent, false);
    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshOnFocus);

    return () => {
      isActive = false;
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshOnFocus);
      document.removeEventListener('visibilitychange', refreshOnFocus);
      supabase.removeChannel(channel);
    };
  }, [selectedStudent]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadStudents() {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, last_seen')
      .eq('role', 'student')
      .order('full_name');

    setStudents(data || []);
    if (!selectedStudent && data?.[0]) setSelectedStudent(data[0].id);
  }

  async function loadMessages(studentId = selectedStudent) {
    if (!studentId) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles!messages_sender_id_fkey(full_name, role)')
      .eq('student_id', studentId)
      .order('created_at', { ascending: true });

    if (!error) setMessages(data || []);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim() || !selectedStudent || sending) return;

    setSending(true);
    const payload = {
      student_id: selectedStudent,
      sender_id: session.user.id,
      text: text.trim()
    };

    const { error } = await supabase.from('messages').insert(payload);

    if (!error) {
      setText('');
      await loadMessages(selectedStudent);
    } else {
      alert(error.message);
    }

    setSending(false);
  }

  const selectedStudentName = students.find((student) => student.id === selectedStudent)?.full_name;

  return (
    <div className="page messages-page">
      <div className="page-header">
        <div>
          <div className="pill"><MessageCircle size={16} /> Mesajlar</div>
          <h2>{profile.role === 'teacher' ? 'Öğrenci konuşmaları' : 'Arda Hoca’ya mesaj at'}</h2>
          <p>Bu konuşmalar kalıcı olarak kaydedilir. Öğrenciler birbirine özel mesaj atamaz.</p>
        </div>
        <div className={`live-chip ${liveStatus === 'live' ? 'online' : ''}`}>
          {liveStatus === 'live' ? <Wifi size={15} /> : <WifiOff size={15} />}
          {liveStatus === 'live' ? 'Canlı mesaj açık' : 'Bağlanıyor'}
        </div>
      </div>

      <section className="chat-layout">
        {profile.role === 'teacher' && (
          <aside className="student-list panel">
            <div className="panel-title-row">
              <h3>Öğrenciler</h3>
              <button className="icon-button" onClick={loadStudents} title="Öğrencileri yenile"><RefreshCw size={16} /></button>
            </div>
            {students.length === 0 && <p className="muted">Henüz öğrenci yok.</p>}
            {students.map((student) => (
              <button key={student.id} className={selectedStudent === student.id ? 'active' : ''} onClick={() => setSelectedStudent(student.id)}>
                <span>{student.full_name}</span>
              </button>
            ))}
          </aside>
        )}

        <div className="chat-panel panel">
          {!selectedStudent ? (
            <div className="empty-state">Bir öğrenci seç.</div>
          ) : (
            <>
              <div className="chat-topbar">
                <div>
                  <strong>{profile.role === 'teacher' ? selectedStudentName || 'Öğrenci' : 'Arda Hoca'}</strong>
                  <span>Mesajlar sayfa yenilemeden gelir.</span>
                </div>
                <button className="secondary-button small" onClick={() => loadMessages(selectedStudent)}>
                  <RefreshCw size={15} /> Yenile
                </button>
              </div>

              <div className="chat-messages">
                {messages.length === 0 && <div className="empty-state">Henüz mesaj yok.</div>}
                {messages.map((msg) => {
                  const mine = msg.sender_id === session.user.id;
                  return (
                    <div className={`bubble ${mine ? 'mine' : ''}`} key={msg.id}>
                      <strong>{msg.sender?.full_name || 'Kullanıcı'}</strong>
                      <p>{msg.text}</p>
                      <span>{formatDateTime(msg.created_at)}</span>
                    </div>
                  );
                })}
                <div ref={bottomRef}></div>
              </div>

              <form className="chat-input" onSubmit={sendMessage}>
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Mesaj yaz..." />
                <button className="primary-button" disabled={sending}>
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
