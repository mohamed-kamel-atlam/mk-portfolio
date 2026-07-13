import Image from "next/image";

import type { Project } from "../lib/get-projects";

export interface ProjectGalleryProps {
  gallery: NonNullable<Project["frontmatter"]["gallery"]>;
}

/**
 * Project media gallery. Uses `next/image` with the required width/height for
 * layout stability and AVIF/WebP delivery (QAT-1). Renders nothing when empty.
 */
export function ProjectGallery({ gallery }: ProjectGalleryProps) {
  if (gallery.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {gallery.map((image) => (
        <figure key={image.src} className="flex flex-col gap-2">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="h-auto w-full rounded-lg border border-border"
          />
          {image.caption ? (
            <figcaption className="text-small text-muted-foreground">
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
