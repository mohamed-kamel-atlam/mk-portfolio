import { ArrowRight } from "lucide-react";
import Link from "next/link";

export interface DeepDiveLinkProps {
  href: string;
  label: string;
}

export function DeepDiveLink({ href, label }: DeepDiveLinkProps) {
  return (
    <Link
      href={href}
      className="group/link inline-flex items-center gap-2 rounded text-small font-medium text-accent transition-colors duration-fast hover:text-foreground"
    >
      {label}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-fast group-hover/link:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover/link:-translate-x-0.5"
      />
    </Link>
  );
}
