/**
 * Theme types. Owned here (cross-cutting); the runtime lists and keys live in
 * `@/shared/constants/theme`, validated against these types.
 */

/** The user's selectable theme preference (ADR-0005 / FR-002). */
export type Theme = "light" | "dark" | "system";

/** The concrete theme actually applied to the document. */
export type ResolvedTheme = Exclude<Theme, "system">;
