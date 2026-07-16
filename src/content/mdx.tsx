import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentPropsWithoutRef } from "react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { PluggableList } from "unified";

import { cn } from "@/shared/lib/cn";
import { Divider, Heading, Text } from "@/shared/ui";

const components = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <Heading level={1} size="h1" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <Heading level={2} size="h2" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <Heading level={3} size="h3" {...props} />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <Heading level={4} size="h4" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => <Text {...props} />,
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="list-disc space-y-2 ps-6 text-muted-foreground" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="list-decimal space-y-2 ps-6 text-muted-foreground"
      {...props}
    />
  ),
  a: ({ href, className, ...props }: ComponentPropsWithoutRef<"a">) => {
    // Heading anchors (rehype-autolink-headings, "wrap") must read as headings,
    // not links: inherit the heading color, no underline, subtle accent on hover.
    const isHeadingLink =
      typeof className === "string" && className.includes("heading-link");
    return (
      <a
        href={href ?? "#"}
        className={cn(
          isHeadingLink
            ? "text-inherit no-underline transition-colors duration-fast hover:text-accent"
            : "text-accent underline underline-offset-4 hover:no-underline",
          className,
        )}
        {...props}
      />
    );
  },
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-s-2 border-accent bg-surface-muted px-4 py-2 text-muted-foreground"
      {...props}
    />
  ),
  hr: () => <Divider />,
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded-sm bg-surface-muted px-1.5 py-0.5 font-mono text-small"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="overflow-x-auto rounded-lg border border-border bg-surface-muted p-4 font-mono text-small"
      {...props}
    />
  ),
};

const remarkPlugins: PluggableList = [remarkGfm];
const rehypePlugins: PluggableList = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    { behavior: "wrap", properties: { className: ["heading-link"] } },
  ],
  [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
];
const mdxOptions = { remarkPlugins, rehypePlugins };

export interface MDXContentProps {
  /** Raw MDX body from the content-access API. */
  source: string;
}

/** Render a compiled MDX body through the design-system component map. */
export function MDXContent({ source }: MDXContentProps) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{ mdxOptions }}
    />
  );
}
