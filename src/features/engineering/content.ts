/**
 * Engineering-hub structural data — the non-translatable atoms. The hub groups
 * the engineering docs into categories by their `kind`; labels for the groups
 * live in the `engineering` dictionary namespace, keyed by the same identifiers.
 *
 * Adding a doc is a content file plus (if a new category) one entry here.
 */

/** Category groups for the hub, mapped to the engineering-doc `kind` values. */
export const docGroups = [
  { key: "foundations", kinds: ["architecture", "folder-structure"] },
  { key: "rendering", kinds: ["rendering", "react-internals"] },
  { key: "quality", kinds: ["performance", "accessibility"] },
  { key: "workflow", kinds: ["ai-workflow", "workflow"] },
  { key: "decisions", kinds: ["design-decision"] },
] as const;

export type DocGroupKey = (typeof docGroups)[number]["key"];
