"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { cn } from "@/shared/lib/cn";

import { useIsActive, type NavLinkItem } from "./DesktopNav";
import { IconButton } from "./IconButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export interface MobileNavProps {
  items: readonly NavLinkItem[];
  labels: {
    open: string;
    close: string;
    nav: string;
    toggleTheme: string;
    switchLanguage: string;
  };
  className?: string;
}

export function MobileNav({ items, labels, className }: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  function open() {
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  }

  function close() {
    document.body.style.overflow = "";
    dialogRef.current?.close();
  }

  // Also restore scroll on the native `close` event, which covers the paths
  // that bypass `close()` — notably Escape (handled by the dialog itself).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.body.style.overflow = "";
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // Close on route change (e.g. after following a link).
  useEffect(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
  }, [pathname]);

  function onBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) close();
  }

  const isActive = useIsActive();

  return (
    <div className={className}>
      <IconButton label={labels.open} aria-haspopup="dialog" onClick={open}>
        <Menu className="h-5 w-5" aria-hidden="true" />
      </IconButton>

      <dialog
        ref={dialogRef}
        aria-label={labels.nav}
        onClick={onBackdropClick}
        className="m-0 ms-auto h-dvh max-h-dvh w-full max-w-xs bg-surface text-foreground backdrop:bg-overlay open:animate-fade-in"
      >
        <div className="flex h-full flex-col gap-6 p-6">
          <div className="flex justify-end">
            <IconButton label={labels.close} variant="ghost" onClick={close}>
              <X className="h-5 w-5" aria-hidden="true" />
            </IconButton>
          </div>

          <nav aria-label={labels.nav} className="flex flex-col gap-1">
            {items.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={close}
                  className={cn(
                    "rounded-md px-3 py-2 text-body font-medium transition-colors duration-fast",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex items-center gap-2">
            <LanguageSwitcher label={labels.switchLanguage} />
            <ThemeToggle label={labels.toggleTheme} />
          </div>
        </div>
      </dialog>
    </div>
  );
}
