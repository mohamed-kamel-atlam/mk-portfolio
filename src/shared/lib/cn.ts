/**
 * Compose class names, dropping falsey values — the project's className
 * composition helper (FOLDER_STRUCTURE.md §4). Dependency-free by design; it can
 * later adopt `clsx` + `tailwind-merge` without changing any call site.
 *
 * @example cn("px-4", isActive && "bg-accent", className)
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
