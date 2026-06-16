import { useEffect, useMemo, useRef, useState } from 'react';
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

const REQUEST_TIMEOUT_MS = 12000;

function getDisplayName(user) {
  return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Öğrenci';
}

function withTimeout(promise, timeoutMs = REQUEST_TIMEOUT_MS, label = 'İstek') {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(new Error(`${label} zaman aşımına uğradı.`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    window.clearTimeout(timeoutId);
  });
}

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('dashboard');
  const bootRequestRef = useRef(0);

  async function touchLastSeen() {
    try {
      await withTimeout(supabase.rpc('touch_profile_last_seen'), 6000, 'Son görülme güncellemesi');
    } catch (error) {
      // Migration çalıştırılmadıysa veya bağlantı geç gelirse siteyi bozmasın.
      console.warn('last_seen güncellenemedi:', error?.message || error);
    }
  }

  async function loadProfile(user) {
    if (!user) {
      setProfile(null);
      return null;
    }

    const { data, error } = await withTimeout(
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(),
      REQUEST_TIMEOUT_MS,
      'Profil bilgisi'
    );

    if (error) {
      console.error('Profil okunamadı:', error);
      const fallback = { id: user.id, full_name: getDisplayName(user), role: 'student' };
      setProfile(fallback);
      void touchLastSeen();
      return fallback;
    }

    if (!data) {
      const fullName = getDisplayName(user);
      const { data: inserted, error: insertError } = await withTimeout(
        supabase
          .from('profiles')
          .insert({ id: user.id, full_name: fullName, role: 'student' })
          .select('*')
          .single(),
        REQUEST_TIMEOUT_MS,
        'Profil oluşturma'
      );

      if (insertError) {
        console.error('Profil oluşturulamadı:', insertError);
        const fallback = { id: user.id, full_name: fullName, role: 'student' };
        setProfile(fallback);
        void touchLastSeen();
        return fallback;
      }

      const nextProfile = inserted || { id: user.id, full_name: fullName, role: 'student' };
      setProfile(nextProfile);
      void touchLastSeen();
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
    void touchLastSeen();
    return data;
  }

  async function reloadProfile() {
    if (!session?.user) return null;
    return await loadProfile(session.user);
  }

  async function applySession(nextSession) {
    const requestId = bootRequestRef.current + 1;
    bootRequestRef.current = requestId;

    setLoading(true);

    try {
      if (!nextSession) {
        setSession(null);
        setProfile(null);
        setPage('dashboard');
        return;
      }

      // Önce loading true kalsın; profil gelmeden Dashboard/Messages render olursa beyaz ekran oluşuyordu.
      setSession(nextSession);
      await loadProfile(nextSession.user);
    } catch (error) {
      console.error('Açılış sırasında hata oluştu:', error);

      if (nextSession?.user) {
        // Bağlantı ilk denemede takılırsa kullanıcıyı sonsuz loader'da bırakma.
        setSession(nextSession);
        setProfile({
          id: nextSession.user.id,
          full_name: getDisplayName(nextSession.user),
          role: 'student'
        });
      } else {
        setSession(null);
        setProfile(null);
        setPage('dashboard');
      }
    } finally {
      if (bootRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    let mounted = true;

    withTimeout(supabase.auth.getSession(), 10000, 'Oturum kontrolü')
      .then(async ({ data }) => {
        if (!mounted) return;
        await applySession(data.session);
      })
      .catch((error) => {
        console.error('Oturum kontrol edilemedi:', error);
        if (!mounted) return;
        setSession(null);
        setProfile(null);
        setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      // Supabase auth callback'i içinde tekrar Supabase sorgusu await edilirse ilk açılışta kilitlenme olabiliyor.
      // Bu yüzden profil sorgusunu bir sonraki event-loop'a atıyoruz.
      window.setTimeout(() => {
        if (mounted) void applySession(newSession);
      }, 0);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user || !profile?.id) return undefined;

    void touchLastSeen();
    const interval = window.setInterval(() => void touchLastSeen(), 60000);

    function handleVisibility() {
      if (document.visibilityState === 'visible') void touchLastSeen();
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
