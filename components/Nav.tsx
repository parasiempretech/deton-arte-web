"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Ref } from "react";
import { categories, site } from "@/lib/site";
import { Container } from "./Container";

type NavLinkProps = {
  href: string;
  label: string;
  mobile?: boolean;
  index?: number;
  onNavigate?: () => void;
  linkRef?: Ref<HTMLAnchorElement>;
};

function NavLink({
  href,
  label,
  mobile = false,
  index,
  onNavigate,
  linkRef,
}: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      ref={linkRef}
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={[
        "group relative flex items-center font-[family-name:var(--font-body)] font-medium tracking-[-0.01em] transition-colors duration-200",
        mobile
          ? "min-h-[3.65rem] justify-between overflow-hidden rounded-2xl border px-4 py-3 text-base"
          : "min-h-11 rounded-xl px-3 py-2 text-[12px] xl:px-3.5 xl:text-[13px]",
        active
          ? mobile
            ? "border-red-400/35 bg-red-500/[0.12] text-white"
            : "text-white"
          : mobile
            ? "border-white/[0.08] bg-[#111113] text-white/[0.68] hover:border-white/[0.16] hover:bg-[#171719] hover:text-white"
            : "text-white/[0.58] hover:bg-white/[0.045] hover:text-white",
      ].join(" ")}
    >
      <span className={mobile ? "flex min-w-0 items-center gap-3.5" : ""}>
        {mobile && index !== undefined && (
          <span
            className={[
              "w-5 shrink-0 text-[10px] font-semibold tracking-[0.1em]",
              active ? "text-red-200/75" : "text-white/25",
            ].join(" ")}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <span className={mobile ? "truncate text-[1.05rem]" : ""}>{label}</span>
      </span>
      {mobile ? (
        <span
          aria-hidden="true"
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-base transition-colors duration-200",
            active
              ? "border-red-300/25 bg-red-500 text-white"
              : "border-white/[0.08] bg-white/[0.025] text-white/30 group-hover:border-white/15 group-hover:text-white",
          ].join(" ")}
        >
          →
        </span>
      ) : (
        <span
          aria-hidden="true"
          className={[
            "absolute inset-x-3 bottom-1 h-px origin-left bg-gradient-to-r from-red-500 to-amber-200 transition-transform duration-200",
            active
              ? "scale-x-100"
              : "scale-x-0 group-hover:scale-x-100",
          ].join(" ")}
        />
      )}
    </Link>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const menuDetailsRef = useRef<HTMLDetailsElement>(null);
  const menuButtonRef = useRef<HTMLElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  const links = useMemo(
    () => [
      { href: "/", label: "Inicio" },
      ...categories.map((category) => ({
        href: category.href,
        label: category.title,
      })),
      { href: "/contacto", label: "Contacto" },
    ],
    []
  );

  const closeMenu = useCallback(() => {
    menuDetailsRef.current?.removeAttribute("open");
    setOpen(false);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [closeMenu, pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        closeMenu();
        menuButtonRef.current?.focus();
      }

      if (event.key === "Tab" && open) {
        const focusableElements =
          menuPanelRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])'
          );
        if (!focusableElements?.length) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenu, open]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktopQuery.matches) closeMenu();
    };

    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, [closeMenu]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.menuOpen = "true";
    window.requestAnimationFrame(() => firstMobileLinkRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      delete document.body.dataset.menuOpen;
    };
  }, [open]);

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#08080a] shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
    >
      <div className="h-[3px] bg-gradient-to-r from-red-700 via-red-500 to-amber-200/70" />

      <Container className="max-w-[1440px]">
        <div className="flex h-[69px] items-center justify-between gap-4 sm:h-[77px]">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2.5 rounded-xl text-white sm:gap-3"
            aria-label="Ir al inicio"
          >
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/[0.12] bg-[#f5d9cd] transition-colors duration-200 group-hover:border-white/25 sm:h-12 sm:w-12">
              <Image
                src="/logodeton.png"
                alt="Logo DetonAR73"
                fill
                className="scale-[1.08] object-cover object-top"
                loading="eager"
                sizes="48px"
              />
            </span>

            <span className="flex min-w-0 flex-col">
              <span className="truncate font-[family-name:var(--font-display)] text-[1.35rem] font-semibold italic leading-none tracking-[-0.04em] text-white sm:text-[1.55rem]">
                Deton<span className="text-red-500">AR73</span>
              </span>
              <span className="mt-1 truncate font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
                Arte & Diseño
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Navegación principal"
          >
            {links.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-500/[0.1] px-4 font-[family-name:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:border-red-300/40 hover:bg-red-600 xl:inline-flex"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-red-400"
              aria-hidden="true"
            />
            WhatsApp
          </a>

          <details
            ref={menuDetailsRef}
            onToggle={(event) => setOpen(event.currentTarget.open)}
            className="group shrink-0 lg:hidden"
          >
            <summary
              ref={menuButtonRef}
              className="inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white transition-colors hover:border-white/20 hover:bg-white/[0.09] active:bg-white/[0.12] [&::-webkit-details-marker]:hidden"
              aria-controls="mobile-navigation"
              aria-label="Abrir o cerrar menú"
            >
              <span className="relative block h-5 w-5" aria-hidden="true">
                <span className="absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 group-open:translate-y-[6px] group-open:rotate-45 group-open:text-red-400" />
                <span className="absolute left-0 top-[9px] block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 group-open:opacity-0" />
                <span className="absolute bottom-1 left-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 group-open:-translate-y-[6px] group-open:-rotate-45 group-open:text-red-400" />
              </span>
            </summary>

            <div
              ref={menuPanelRef}
              id="mobile-navigation"
              aria-label="Navegación principal"
              className="fixed inset-x-0 top-[72px] h-[calc(100dvh-72px)] overflow-hidden border-t border-white/[0.07] bg-[#08080a] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)] sm:top-[80px] sm:h-[calc(100dvh-80px)]"
            >
              <div className="grain-overlay pointer-events-none absolute inset-0 opacity-15" />

              <Container className="relative h-full">
                <div className="flex h-full min-h-0 flex-col">
                  <div className="flex shrink-0 items-center justify-between gap-4 py-4">
                    <div className="eyebrow">Menú</div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                      @{site.handle}
                    </div>
                  </div>

                  <nav
                    className="grid min-h-0 flex-1 auto-rows-min gap-2 overflow-y-auto overscroll-contain pb-4 sm:grid-cols-2 sm:content-start"
                    aria-label="Navegación móvil"
                  >
                    {links.map((link, index) => (
                      <NavLink
                        key={link.href}
                        href={link.href}
                        label={link.label}
                        index={index}
                        mobile
                        linkRef={
                          index === 0 ? firstMobileLinkRef : undefined
                        }
                        onNavigate={closeMenu}
                      />
                    ))}
                  </nav>

                  <div className="shrink-0 border-t border-white/[0.08] bg-[#08080a]/95 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={site.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="primary-action px-4"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={site.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="secondary-action px-4"
                      >
                        Instagram
                      </a>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4 text-[10px] font-medium uppercase tracking-[0.1em] text-white/50">
                      <span>{site.brand}</span>
                      <span>Arte & Diseño</span>
                    </div>
                  </div>
                </div>
              </Container>
            </div>
          </details>
        </div>
      </Container>

    </header>
  );
}
