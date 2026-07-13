import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";

import { HighlightList } from "./HighlightList";

export interface CurrentFocusProps {
  locale: Locale;
}

/** What Mohamed is deepening right now. */
export async function CurrentFocus({ locale }: CurrentFocusProps) {
  const t = await getDictionary(locale);
  const section = t.about.focus;

  return (
    <HighlightList
      eyebrow={section.eyebrow}
      title={section.title}
      intro={section.intro}
      items={section.items}
      className="bg-surface-muted"
    />
  );
}
