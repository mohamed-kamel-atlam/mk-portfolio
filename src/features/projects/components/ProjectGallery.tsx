import Image from "next/image";

import { RevealGroup } from "@/shared/ui/motion";

import type { Project } from "../lib/get-projects";

export interface ProjectGalleryProps {
  gallery: NonNullable<Project["frontmatter"]["gallery"]>;
}

export function ProjectGallery({ gallery }: ProjectGalleryProps) {
  if (gallery.length === 0) return null;

  return (
    <RevealGroup variant="up" className="grid gap-4 sm:grid-cols-2">
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
    </RevealGroup>
  );
}
