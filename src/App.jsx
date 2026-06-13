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
      return;
    }

    setProfile(data);
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

  return (
    <Layout page={safePage} setPage={setPage} session={session} profile={profile}>
      <ActivePage session={session} profile={profile} setPage={setPage} />
    </Layout>
  );
}
