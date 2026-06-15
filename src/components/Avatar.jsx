import { initials } from '../lib/helpers';

export default function Avatar({ name = 'Öğrenci', url = '', className = '', title = '' }) {
  const safeTitle = title || name || 'Kullanıcı';
  return (
    <div className={`avatar ${className}`} title={safeTitle}>
      {url ? (
        <img src={url} alt={`${safeTitle} profil resmi`} loading="lazy" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}
