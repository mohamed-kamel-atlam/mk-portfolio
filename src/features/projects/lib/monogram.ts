/**
 * Derive a 1–2 character monogram from a project name, for the logo and cover
 * fallbacks (so a project without a brand asset still reads as intentionally
 * designed). Two words → their initials; one word → its first two letters.
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const first = words[0] ?? "";
  if (words.length === 1) return first.slice(0, 2).toUpperCase();
  const last = words[words.length - 1] ?? "";
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}
