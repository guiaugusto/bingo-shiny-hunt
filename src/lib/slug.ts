export function slugify(title: string, fallback = 'bingo'): string {
  return (
    (title || fallback)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || fallback
  );
}
