import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen, Code2, MessageCircle } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName || 'Öğrenci' }
        }
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Kayıt alındı. Supabase ayarına göre e-posta onayı gerekebilir.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
    }

    setLoading(false);
  }

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="pill">Python Eğitim Platformu</div>
        <h1>Arda Hoca Akademi</h1>
        <p>
          Dersler, bireysel ödevler, sınıf topluluğu, kalıcı öğretmen mesajlaşması
          ve tarayıcı içinde Python kod çalıştırma alanı.
        </p>
        <div className="hero-cards">
          <div><BookOpen /><span>Ders sistemi</span></div>
          <div><MessageCircle /><span>Arda Hoca mesaj</span></div>
          <div><Code2 /><span>Python runner</span></div>
        </div>
      </section>

      <section className="login-card">
        <h2>{mode === 'login' ? 'Giriş yap' : 'Öğrenci kaydı'}</h2>
        <p className="muted">Devam etmek için hesabına gir.</p>

        <form onSubmit={handleSubmit} className="form-stack">
          {mode === 'register' && (
            <label>
              Ad Soyad
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Furkan Demir" />
            </label>
          )}

          <label>
            E-posta
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ogrenci@mail.com" />
          </label>

          <label>
            Şifre
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="En az 6 karakter" />
          </label>

          {message && <div className="notice">{message}</div>}

          <button className="primary-button" disabled={loading}>
            {loading ? 'İşleniyor...' : mode === 'login' ? 'Giriş yap' : 'Kayıt ol'}
          </button>
        </form>

        <button className="link-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Hesabım yok, kayıt olayım' : 'Hesabım var, giriş yapayım'}
        </button>
      </section>
    </div>
  );
}
