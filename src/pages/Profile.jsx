import { useRef, useState } from 'react';
import { Camera, ImageOff, UserCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Avatar from '../components/Avatar';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function Profile({ profile, session, onProfileUpdated }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  async function updateOwnAvatar(avatarUrl) {
    const { data, error } = await supabase.rpc('update_own_avatar', {
      avatar_url_value: avatarUrl || ''
    });

    if (error) throw error;
    if (onProfileUpdated) await onProfileUpdated(data || undefined);
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Sadece görsel dosyası yükleyebilirsin.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage('Profil resmi en fazla 2 MB olabilir.');
      event.target.value = '';
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
      const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'png';
      const filePath = `${session.user.id}/profile-${Date.now()}.${safeExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      await updateOwnAvatar(data.publicUrl);
      setMessage('Profil resmi güncellendi.');
    } catch (error) {
      setMessage(error.message || 'Profil resmi yüklenemedi.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  async function removeAvatar() {
    if (!profile.avatar_url) return;
    if (!confirm('Profil resmin kaldırılsın mı?')) return;

    setUploading(true);
    setMessage('');
    try {
      await updateOwnAvatar('');
      setMessage('Profil resmi kaldırıldı.');
    } catch (error) {
      setMessage(error.message || 'Profil resmi kaldırılamadı.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="page profile-page">
      <div className="page-header">
        <div>
          <div className="pill"><UserCircle size={16} /> Profilim</div>
          <h2>Profil ayarları</h2>
          <p>Öğrenciler yalnızca profil fotoğrafını değiştirebilir. İsim değişiklikleri Arda Hoca tarafından yönetilir.</p>
        </div>
      </div>

      <section className="profile-grid">
        <div className="panel profile-card-large">
          <Avatar name={profile.full_name} url={profile.avatar_url} className="profile-avatar" />
          <div>
            <h3>{profile.full_name}</h3>
            <p>{profile.role === 'teacher' ? 'Öğretmen hesabı' : 'Öğrenci hesabı'}</p>
          </div>
        </div>

        <div className="panel profile-settings-card">
          <h3>Profil fotoğrafı</h3>
          <p className="muted">JPG, PNG, WEBP veya GIF yükleyebilirsin. En fazla 2 MB.</p>
          <div className="profile-actions">
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
            <button className="primary-button" disabled={uploading} onClick={() => inputRef.current?.click()}>
              <Camera size={16} /> {uploading ? 'Yükleniyor...' : 'Fotoğraf seç'}
            </button>
            <button className="danger-button" disabled={uploading || !profile.avatar_url} onClick={removeAvatar}>
              <ImageOff size={16} /> Fotoğrafı kaldır
            </button>
          </div>
          {message && <div className="notice">{message}</div>}
        </div>

        <div className="panel profile-readonly-card">
          <h3>Hesap bilgileri</h3>
          <label>
            Ad Soyad
            <input value={profile.full_name || ''} disabled readOnly />
          </label>
          <label>
            Rol
            <input value={profile.role === 'teacher' ? 'Öğretmen' : 'Öğrenci'} disabled readOnly />
          </label>
          <p className="muted">Ad soyad alanı öğrenciler tarafından değiştirilemez. Gerekirse yönetim panelinden Arda Hoca değiştirir.</p>
        </div>
      </section>
    </div>
  );
}
