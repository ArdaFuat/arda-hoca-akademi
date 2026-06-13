import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, Send } from 'lucide-react';
import { formatDateTime } from '../lib/helpers';

export default function Messages({ profile, session }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(profile.role === 'teacher' ? '' : session.user.id);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (profile.role === 'teacher') loadStudents();
  }, [profile?.id]);

  useEffect(() => {
    if (!selectedStudent) return;
    loadMessages();
    const channel = supabase
      .channel(`messages-${selectedStudent}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `student_id=eq.${selectedStudent}` }, loadMessages)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [selectedStudent]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadStudents() {
    const { data } = await supabase.from('profiles').select('id, full_name').eq('role', 'student').order('full_name');
    setStudents(data || []);
    if (!selectedStudent && data?.[0]) setSelectedStudent(data[0].id);
  }

  async function loadMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*, sender:profiles!messages_sender_id_fkey(full_name, role)')
      .eq('student_id', selectedStudent)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim() || !selectedStudent) return;
    const payload = {
      student_id: selectedStudent,
      sender_id: session.user.id,
      text: text.trim()
    };
    const { error } = await supabase.from('messages').insert(payload);
    if (!error) {
      setText('');
      loadMessages();
    } else {
      alert(error.message);
    }
  }

  return (
    <div className="page messages-page">
      <div className="page-header">
        <div>
          <div className="pill"><MessageCircle size={16} /> Mesajlar</div>
          <h2>{profile.role === 'teacher' ? 'Öğrenci konuşmaları' : 'Arda Hoca’ya mesaj at'}</h2>
          <p>Bu konuşmalar kalıcı olarak kaydedilir. Öğrenciler birbirine özel mesaj atamaz.</p>
        </div>
      </div>

      <section className="chat-layout">
        {profile.role === 'teacher' && (
          <aside className="student-list panel">
            <h3>Öğrenciler</h3>
            {students.length === 0 && <p className="muted">Henüz öğrenci yok.</p>}
            {students.map((student) => (
              <button key={student.id} className={selectedStudent === student.id ? 'active' : ''} onClick={() => setSelectedStudent(student.id)}>
                {student.full_name}
              </button>
            ))}
          </aside>
        )}

        <div className="chat-panel panel">
          {!selectedStudent ? (
            <div className="empty-state">Bir öğrenci seç.</div>
          ) : (
            <>
              <div className="chat-messages">
                {messages.length === 0 && <div className="empty-state">Henüz mesaj yok.</div>}
                {messages.map((msg) => {
                  const mine = msg.sender_id === session.user.id;
                  return (
                    <div className={`bubble ${mine ? 'mine' : ''}`} key={msg.id}>
                      <strong>{msg.sender?.full_name}</strong>
                      <p>{msg.text}</p>
                      <span>{formatDateTime(msg.created_at)}</span>
                    </div>
                  );
                })}
                <div ref={bottomRef}></div>
              </div>
              <form className="chat-input" onSubmit={sendMessage}>
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Mesaj yaz..." />
                <button className="primary-button"><Send size={16} /></button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
