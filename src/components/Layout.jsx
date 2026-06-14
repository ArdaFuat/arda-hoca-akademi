import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, ClipboardList, Code2, Home, LogOut, MessageCircle, PanelLeftClose, PanelLeftOpen, Shield, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { initials, isRecentlyActive } from '../lib/helpers';

const baseItems = [
  { key: 'dashboard', label: 'Ana Sayfa', icon: Home },
  { key: 'lessons', label: 'Dersler', icon: BookOpen },
  { key: 'assignments', label: 'Ödevler', icon: ClipboardList },
  { key: 'community', label: 'Topluluk', icon: Users },
  { key: 'messages', label: 'Arda Hoca Mesaj', icon: MessageCircle },
  { key: 'code', label: 'Python Çalıştır', icon: Code2 }
];

export default function Layout({ children, page, setPage, profile }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('academy_sidebar_collapsed') === '1');
  const [onlineUsers, setOnlineUsers] = useState([]);

  const menuItems = profile?.role === 'teacher'
    ? [...baseItems, { key: 'admin', label: 'Yönetim', icon: Shield }]
    : baseItems;

  useEffect(() => {
    loadOnlineUsers();
    const interval = window.setInterval(loadOnlineUsers, 60000);
    return () => window.clearInterval(interval);
  }, []);

  async function loadOnlineUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, last_seen_at')
      .order('last_seen_at', { ascending: false, nullsFirst: false })
      .limit(8);

    if (!error) setOnlineUsers((data || []).filter((user) => isRecentlyActive(user.last_seen_at, 2)));
  }

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('academy_sidebar_collapsed', next ? '1' : '0');
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  const onlinePreview = useMemo(() => onlineUsers.slice(0, collapsed ? 4 : 6), [onlineUsers, collapsed]);

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand" onClick={() => setPage('dashboard')} title="Ana Sayfa">
            <div className="brand-logo">AH</div>
            <div className="brand-copy">
              <h1>Arda Hoca</h1>
              <p>Akademi</p>
            </div>
          </div>
          <button className="sidebar-toggle" onClick={toggleCollapsed} title={collapsed ? 'Menüyü büyüt' : 'Menüyü küçült'}>
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <nav className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`nav-item ${page === item.key ? 'active' : ''}`}
                onClick={() => setPage(item.key)}
                title={item.label}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <section className="sidebar-online-card">
          <div className="sidebar-section-title">
            <Users size={16} />
            <span>Aktif kişiler</span>
          </div>
          {onlinePreview.length === 0 ? (
            <p className="sidebar-empty">Şu an aktif görünen yok.</p>
          ) : (
            <div className="online-mini-list">
              {onlinePreview.map((user) => (
                <div className="online-mini-user" key={user.id} title={`${user.full_name} aktif`}>
                  <span className="online-dot"></span>
                  <div className="avatar tiny">{initials(user.full_name)}</div>
                  <strong>{user.full_name}</strong>
                  <small>{user.role === 'teacher' ? 'Hoca' : 'Öğrenci'}</small>
                </div>
              ))}
            </div>
          )}
        </section>

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
          <div className="mobile-actions">
            <button onClick={toggleCollapsed} className="ghost-button">{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button>
            <button onClick={logout} className="ghost-button">Çıkış</button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
