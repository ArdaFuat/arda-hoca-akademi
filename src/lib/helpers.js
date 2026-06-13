export function formatDate(date) {
  if (!date) return 'Tarih yok';
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
}

export function formatDateTime(date) {
  if (!date) return '';
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function initials(name = 'Ö') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'Ö';
}
