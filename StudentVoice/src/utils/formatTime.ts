export function formatTimeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  if (diff < 60_000) {
    return 'Just now';
  }
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) {
    return `${mins} min ago`;
  }
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }
  const days = Math.floor(diff / 86_400_000);
  if (days === 1) {
    return '1 day ago';
  }
  if (days < 7) {
    return `${days} days ago`;
  }
  const weeks = Math.floor(days / 7);
  if (weeks < 5) {
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  return new Date(iso).toLocaleDateString();
}
