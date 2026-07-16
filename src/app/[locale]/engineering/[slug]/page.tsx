import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildContentMetadata } from "@/content";
import { MDXContent } from "@/content/mdx";
import {
  buildToc,
  DocHeader,
  DocPager,
  DocToc,
  formatDate,
  getAdjacentDocs,
  getEngineeringDoc,
  getEngineeringSlugs,
} from "@/features/engineering";
import { siteConfig } from "@/shared/config/site";
import {
  defaultLocale,
  isLocale,
  localizedHref,
  type Locale,
} from "@/shared/i18n/config";
import { getDictionary } from "@/shared/i18n/get-dictionary";
import { breadcrumbJsonLd } from "@/shared/lib/structured-data";
import { Container, JsonLd, Section } from "@/shared/ui";

interface DocPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

/** Prebuild every engineering-doc route (MDX_PIPELINE §7). */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getEngineeringSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const doc = await getEngineeringDoc(slug, active);
  if (!doc) return {};
  return buildContentMetadata(doc, `/engineering/${slug}`);
}

/**
 * Engineering doc — reads like official documentation: a header, a same-page
 * table of contents, the MDX body rendered through the design-system component
 * map, and previous/next paging. Static per (locale, slug).
 */
export default async function DocPage({ params }: DocPageProps) {
  const { locale, slug } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const doc = await getEngineeringDoc(slug, active);
  if (!doc) notFound();

  const t = await getDictionary(active);
  const article = t.engineering.article;
  const { frontmatter } = doc;
  const toc = buildToc(doc.body);
  const adjacent = await getAdjacentDocs(slug, active);
  const url = `${siteConfig.url}${localizedHref(active, `/engineering/${slug}`)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: frontmatter.title,
    description: frontmatter.summary,
    inLanguage: active,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: { "@type": "Person", name: siteConfig.name },
    url,
  };
  const breadcrumb = breadcrumbJsonLd(active, [
    { name: t.nav.home, path: "" },
    { name: t.nav.engineering, path: "/engineering" },
    { name: frontmatter.title, path: `/engineering/${slug}` },
  ]);

  return (
    <Section>
      <Container>
        <JsonLd data={jsonLd} />
        <JsonLd data={breadcrumb} />
        <div className="mx-auto flex max-w-5xl flex-col-reverse gap-10 lg:flex-row lg:items-start lg:gap-12">
          <article className="flex min-w-0 flex-1 flex-col gap-10 lg:max-w-3xl">
            <DocHeader
              backHref={localizedHref(active, "/engineering")}
              backLabel={article.back}
              kindLabel={t.engineering.kinds[frontmatter.kind]}
              title={frontmatter.title}
              summary={frontmatter.summary}
              updatedLabel={article.updated}
              updatedDate={formatDate(active, frontmatter.date)}
            />

            <div className="space-y-6 [&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24">
              <MDXContent source={doc.body} />
            </div>

            <DocPager
              prev={adjacent.prev}
              next={adjacent.next}
              locale={active}
              labels={{
                previous: article.previous,
                next: article.next,
                nav: article.pager,
              }}
            />
          </article>

          <aside className="lg:sticky lg:top-24 lg:w-56 lg:shrink-0">
            <DocToc items={toc} label={article.onThisPage} />
          </aside>
        </div>
      </Container>
    </Section>
  );
}
