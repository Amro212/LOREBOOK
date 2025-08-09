export function slugifyUsername(input: string): string {
  const lower = input.trim().toLowerCase();
  // Keep letters, numbers, underscores and hyphens; collapse repeats
  const slug = lower.replace(/[^a-z0-9_-]+/g, "-").replace(/-+/g, "-");
  // Trim hyphens from ends
  return slug.replace(/(^-+|-+$)/g, "");
}

export function isValidUsername(input: string): boolean {
  const slug = slugifyUsername(input);
  if (slug.length < 3 || slug.length > 24) return false;
  return /^[a-z0-9_-]+$/.test(slug);
}


