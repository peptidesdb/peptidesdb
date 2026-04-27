"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: ReadonlyArray<NavLink>;
  externalLinks: ReadonlyArray<NavLink>;
}

/* =========================================================
   Atlas-native mobile navigation.

   Below 640px viewport, replaces the inline desktop nav with
   an explicit `Menu ▾` text toggle (no hamburger glyph — that
   fights the monograph aesthetic, but a fully-invisible reveal
   would fail discovery on cold-arrival readers, so we keep an
   explicit signifier per Codex feedback + NN/g + UK gov design
   evidence on hidden mobile nav).

   Behavior:
   - Tap Menu ▾ → slide-down panel reveals nav links
   - Tap any link → panel auto-closes + browser navigates
   - Press Esc → panel closes
   - Resize ≥640px → panel auto-closes (desktop nav takes over)
   ========================================================= */
export function MobileNav({ links, externalLinks }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close on pathname change. We don't close in the link's onClick
  // because closing synchronously can race with Next's Link navigation
  // handler — the panel unmounts before the router push lands. Listening
  // for pathname change is the canonical pattern in Next 13+.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      // Tailwind sm breakpoint = 640px. Above that, desktop nav is visible.
      if (window.innerWidth >= 640) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="at-folio text-at-ink tracking-[0.22em] flex items-center gap-1 py-1 px-1 hover:text-at-gold transition-colors"
      >
        Menu {open ? "▴" : "▾"}
      </button>
      {open && (
        <nav
          id="mobile-nav-panel"
          aria-label="Site navigation"
          className="absolute left-0 right-0 top-full bg-at-cream border-b border-at-ink/20 z-30 shadow-none"
        >
          <ul className="mx-auto max-w-[1280px] px-6 py-2 flex flex-col">
            {links.map((link) => (
              <li
                key={link.href}
                className="border-b border-at-rule"
              >
                <Link
                  href={link.href}
                  className="at-link block py-3 text-[14px] tracking-wide"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {externalLinks.map((link) => (
              <li
                key={link.href}
                className="border-b border-at-rule last:border-b-0"
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="at-folio block py-3 text-[12px] text-at-ink-soft hover:text-at-gold"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
