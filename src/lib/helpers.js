export function formatDate(date) {
  if (!date) return 'Tarih yok';
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
}

export function formatDateTime(date) {
  if (!date) return 'Yok';
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function formatRelativeTime(date) {
  if (!date) return 'Hiç görülmedi';
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60000));

  // Yeşil "aktif" göstergesiyle uyumlu olsun diye sadece çok yeni hareketleri
  // "Şimdi aktif" diye gösteriyoruz. 3-4 dakika önce görülen kişi artık aktif sayılmaz.
  if (diffMs <= 90 * 1000) return 'Şimdi aktif';
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

export function isRecentlyActive(date, thresholdMinutes = 2) {
  if (!date) return false;
  return Date.now() - new Date(date).getTime() <= thresholdMinutes * 60000;
}

export function initials(name = 'Ö') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'Ö';
}
