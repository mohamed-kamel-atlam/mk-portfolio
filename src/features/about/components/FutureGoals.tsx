import { type Locale } from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";

import { HighlightList } from "./HighlightList";

export interface FutureGoalsProps {
  locale: Locale;
}

/** Where the work is heading next. */
export async function FutureGoals({ locale }: FutureGoalsProps) {
  const t = await getDictionary(locale);
  const section = t.about.goals;

  return (
    <HighlightList
      eyebrow={section.eyebrow}
      title={section.title}
      intro={section.intro}
      items={section.items}
    />
  );
}
