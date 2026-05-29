import slugify from 'slugify';
import readingTime from 'reading-time';

export function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function calculateReadTime(content: string): number {
  // Strip HTML tags for accurate word count
  const text = content.replace(/<[^>]*>/g, '');
  const stats = readingTime(text);
  return Math.ceil(stats.minutes);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + '…';
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
