"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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
        "group relative flex items-center font-[family-name:var(--font-body)] font-medium tracking-[-0.01em] transition-all duration-200",
        mobile
          ? "min-h-[3.65rem] justify-between overflow-hidden rounded-2xl border px-4 py-3 text-base"
          : "min-h-11 rounded-xl px-3 py-2 text-[12px] xl:px-3.5 xl:text-[13px]",
        active
          ? mobile
            ? "border-red-400/35 bg-[linear-gradient(100deg,rgba(194,18,31,0.34),rgba(240,47,60,0.12))] text-white shadow-[0_14px_40px_-25px_rgba(240,47,60,0.75)]"
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
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-base transition-all duration-200 group-hover:translate-x-0.5",
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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
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
  }, [open]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktopQuery.matches) setOpen(false);
    };

    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);

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
      className={[
        "sticky top-0 z-50 border-b border-white/[0.08] shadow-[0_14px_45px_rgba(0,0,0,0.24)] backdrop-blur-2xl transition-colors duration-200",
        open ? "bg-[#08080a]" : "bg-[#08080a]/[0.88]",
      ].join(" ")}
    >
      <div className="h-[3px] bg-gradient-to-r from-red-700 via-red-500 to-amber-200/70" />

      <Container className="max-w-[1440px]">
        <div className="flex h-[69px] items-center justify-between gap-4 sm:h-[77px]">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2.5 rounded-xl text-white sm:gap-3"
            aria-label="Ir al inicio"
          >
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/[0.12] bg-[#f5d9cd] shadow-[0_8px_24px_-10px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-[1.04] sm:h-12 sm:w-12">
              <Image
                src="/logodeton.png"
                alt="Logo DetonAR73"
                fill
                className="scale-[1.08] object-cover object-top"
                priority
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
            className="hidden min-h-11 items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-500/[0.1] px-4 font-[family-name:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-all hover:-translate-y-0.5 hover:border-red-300/40 hover:bg-red-600 xl:inline-flex"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.85)]"
              aria-hidden="true"
            />
            WhatsApp
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white transition-all hover:border-white/20 hover:bg-white/[0.09] active:scale-95 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            <span className="relative block h-5 w-5" aria-hidden="true">
              <span
                className={[
                  "absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-current transition-transform duration-200",
                  open ? "translate-y-[6px] rotate-45 text-red-400" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-[9px] block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200",
                  open ? "opacity-0" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute bottom-1 left-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-200",
                  open ? "-translate-y-[6px] -rotate-45 text-red-400" : "",
                ].join(" ")}
              />
            </span>
          </button>
        </div>
      </Container>

      <div
        ref={menuPanelRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Navegación principal"
        aria-hidden={!open}
        className={[
          "absolute inset-x-0 top-full h-[calc(100dvh-72px)] overflow-hidden border-t border-white/[0.07] bg-[#08080a] shadow-[0_30px_80px_-24px_rgba(0,0,0,1)] transition-all duration-300 sm:h-[calc(100dvh-80px)] lg:hidden",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0",
        ].join(" ")}
      >
        <div className="grain-overlay pointer-events-none absolute inset-0 opacity-25" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-red-700/[0.09] blur-[100px]" />

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
              aria-label="Navegación mobile"
            >
              {links.map((link, index) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  index={index}
                  mobile
                  linkRef={index === 0 ? firstMobileLinkRef : undefined}
                  onNavigate={() => setOpen(false)}
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
    </header>
  );
}
