import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { cache } from "react";

import { isLocale, type Locale } from "@/shared/i18n/config";

import {
  collections,
  type ContentItem,
  type ContentType,
  type FrontmatterOf,
} from "./schema";

// Content lives in the Content layer (FOLDER_STRUCTURE §6): src/content/<type>/.
const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

/** Derive the locale-invariant slug and locale from `<slug>.<locale>.mdx`. */
function parseFileName(file: string): { slug: string; locale: Locale } {
  const base = file.replace(/\.mdx$/, "");
  const lastDot = base.lastIndexOf(".");
  if (lastDot < 1) {
    throw new Error(
      `Content file "${file}" must be named "<slug>.<locale>.mdx".`,
    );
  }
  const localePart = base.slice(lastDot + 1);
  const slug = base.slice(0, lastDot);
  if (!isLocale(localePart)) {
    throw new Error(
      `Content file "${file}" has an unsupported locale suffix "${localePart}".`,
    );
  }
  return { slug, locale: localePart };
}

/** A slug must be unique per (type, locale); en/ar share a slug by design. */
function assertUniqueSlugs(
  items: ContentItem<ContentType>[],
  dir: string,
): void {
  const seen = new Set<string>();
  for (const item of items) {
    const key = `${item.locale}:${item.slug}`;
    if (seen.has(key)) {
      throw new Error(
        `Duplicate slug "${item.slug}" (${item.locale}) in content/${dir}.`,
      );
    }
    seen.add(key);
  }
}

const loadRaw = cache(
  async (type: ContentType): Promise<ContentItem<ContentType>[]> => {
    const { dir, schema } = collections[type];
    const dirPath = path.join(CONTENT_ROOT, dir);

    let files: string[];
    try {
      files = await readdir(dirPath);
    } catch {
      return []; // collection directory not created yet
    }

    const items = await Promise.all(
      files
        .filter((file) => file.endsWith(".mdx"))
        .map(async (file): Promise<ContentItem<ContentType>> => {
          const raw = await readFile(path.join(dirPath, file), "utf8");
          const { data, content } = matter(raw);
          const { slug, locale } = parseFileName(file);

          const result = schema.safeParse({ ...data, slug, locale });
          if (!result.success) {
            throw new Error(
              `Invalid frontmatter in content/${dir}/${file}:\n${result.error.message}`,
            );
          }

          return {
            slug,
            locale,
            frontmatter: result.data as FrontmatterOf<ContentType>,
            body: content,
          };
        }),
    );

    assertUniqueSlugs(items, dir);
    return items;
  },
);

/** Typed access to a validated collection. */
export async function loadCollection<T extends ContentType>(
  type: T,
): Promise<ContentItem<T>[]> {
  return (await loadRaw(type)) as ContentItem<T>[];
}
