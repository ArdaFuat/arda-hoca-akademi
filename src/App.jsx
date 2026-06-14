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

const PAGES = {
  dashboard: Dashboard,
  lessons: Lessons,
  assignments: Assignments,
  community: Community,
  messages: Messages,
  code: CodeRunner,
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
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      setProfile(null);
      return;
    }

    if (!data) {
      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Öğrenci';
      const { data: inserted } = await supabase
        .from('profiles')
        .insert({ id: user.id, full_name: fullName, role: 'student' })
        .select('*')
        .single();
      setProfile(inserted || { id: user.id, full_name: fullName, role: 'student' });
      await touchLastSeen();
      return;
    }

    setProfile(data);
    await touchLastSeen();
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      await loadProfile(data.session?.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      await loadProfile(newSession?.user);
      setLoading(false);
      if (!newSession) setPage('dashboard');
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) return undefined;

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
  }, [session?.user?.id]);

  const ActivePage = useMemo(() => PAGES[page] || Dashboard, [page]);

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

  if (page === 'admin' && profile?.role !== 'teacher') {
    setPage('dashboard');
    return null;
  }

  return (
    <Layout page={page} setPage={setPage} session={session} profile={profile}>
      <ActivePage session={session} profile={profile} setPage={setPage} />
    </Layout>
  );
}
