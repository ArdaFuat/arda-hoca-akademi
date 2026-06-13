import { BookOpen, ClipboardList, Code2, Home, LogOut, MessageCircle, Shield, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { initials } from '../lib/helpers';

const baseItems = [
  { key: 'dashboard', label: 'Panel', icon: Home },
  { key: 'lessons', label: 'Dersler', icon: BookOpen },
  { key: 'assignments', label: 'Ödevler', icon: ClipboardList },
  { key: 'community', label: 'Topluluk', icon: Users },
  { key: 'messages', label: 'Arda Hoca Mesaj', icon: MessageCircle },
  { key: 'code', label: 'Python Çalıştır', icon: Code2 }
];

export default function Layout({ children, page, setPage, profile }) {
  const menuItems = profile?.role === 'teacher'
    ? [...baseItems, { key: 'admin', label: 'Yönetim', icon: Shield }]
    : baseItems;

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand" onClick={() => setPage('dashboard')}>
          <div className="brand-logo">AH</div>
          <div>
            <h1>Arda Hoca</h1>
            <p>Akademi</p>
          </div>
        </div>

        <nav className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`nav-item ${page === item.key ? 'active' : ''}`}
                onClick={() => setPage(item.key)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-user">
          <div className="avatar">{initials(profile?.full_name)}</div>
          <div className="sidebar-user-text">
            <strong>{profile?.full_name || 'Öğrenci'}</strong>
            <span>{profile?.role === 'teacher' ? 'Öğretmen' : 'Öğrenci'}</span>
          </div>
          <button className="icon-button" onClick={logout} title="Çıkış yap">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="mobile-topbar">
          <button onClick={() => setPage('dashboard')} className="mini-brand">AH Akademi</button>
          <button onClick={logout} className="ghost-button">Çıkış</button>
        </div>
        {children}
      </main>
    </div>
  );
}
