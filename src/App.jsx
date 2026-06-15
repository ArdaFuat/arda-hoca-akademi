import { useEffect, useMemo, useState } from 'react';
import { supabase } from './lib/supabase';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import Assignments from './pages/Assignments';
import Community from './pages/Community';
import Messages from './pages/Messages';
import CodeRunner from './pages/CodeRunner';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

const PAGES = {
  dashboard: Dashboard,
  lessons: Lessons,
  assignments: Assignments,
  community: Community,
  messages: Messages,
  code: CodeRunner,
  profile: Profile,
  admin: Admin
};

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('dashboard');

  async function touchLastSeen() {
    try {
      await supabase.rpc('touch_profile_last_seen');
    } catch (error) {
      // Migration çalıştırılmadıysa siteyi bozmasın.
      console.warn('last_seen güncellenemedi:', error?.message || error);
    }
  }

  async function loadProfile(user) {
    if (!user) {
      setProfile(null);
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      setProfile(null);
      return null;
    }

    if (!data) {
      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Öğrenci';
      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: user.id, full_name: fullName, role: 'student' })
        .select('*')
        .single();

      if (insertError) {
        console.error(insertError);
        const fallback = { id: user.id, full_name: fullName, role: 'student' };
        setProfile(fallback);
        await touchLastSeen();
        return fallback;
      }

      const nextProfile = inserted || { id: user.id, full_name: fullName, role: 'student' };
      setProfile(nextProfile);
      await touchLastSeen();
      return nextProfile;
    }

    if (data.is_deleted) {
      alert('Bu öğrenci hesabı öğretmen tarafından silinmiş. Giriş yapılamaz.');
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
      return null;
    }

    setProfile(data);
    await touchLastSeen();
    return data;
  }

  async function reloadProfile() {
    if (!session?.user) return null;
    return await loadProfile(session.user);
  }

  async function applySession(nextSession) {
    setLoading(true);

    if (!nextSession) {
      setSession(null);
      setProfile(null);
      setPage('dashboard');
      setLoading(false);
      return;
    }

    // Önce loading true kalsın; profil gelmeden Dashboard/Messages render olursa beyaz ekran oluşuyordu.
    setSession(nextSession);
    await loadProfile(nextSession.user);
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      await applySession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      await applySession(newSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user || !profile?.id) return undefined;

    touchLastSeen();
    const interval = window.setInterval(touchLastSeen, 60000);

    function handleVisibility() {
      if (document.visibilityState === 'visible') touchLastSeen();
    }

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [session?.user?.id, profile?.id]);

  const safePage = page === 'admin' && profile?.role !== 'teacher' ? 'dashboard' : page;
  const ActivePage = useMemo(() => PAGES[safePage] || Dashboard, [safePage]);

  if (loading) {
    return (
      <div className="screen-center">
        <div className="loader"></div>
        <p>Arda Hoca Akademi açılıyor...</p>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  if (!profile) {
    return (
      <div className="screen-center">
        <div className="loader"></div>
        <p>Profil hazırlanıyor...</p>
      </div>
    );
  }

  return (
    <Layout page={safePage} setPage={setPage} session={session} profile={profile}>
      <ActivePage session={session} profile={profile} setPage={setPage} onProfileUpdated={reloadProfile} />
    </Layout>
  );
}
