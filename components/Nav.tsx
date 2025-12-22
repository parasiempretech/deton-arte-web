"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { categories, site } from "@/lib/site";
import { Container } from "./Container";

function NavLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={[
        "rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200",
        active
          ? "bg-red-600 text-white shadow-lg shadow-red-600/40"
          : "text-gray-400 hover:bg-white/5 hover:text-white",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = useMemo(
    () => [
      { href: "/", label: "Inicio" },
      ...categories.map((c) => ({ href: c.href, label: c.title })),
      { href: "/contacto", label: "Contacto" },
    ],
    []
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-gray-950/95 backdrop-blur-md">
      <Container>
        <div className="flex items-center justify-between py-3 sm:py-4">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="Ir al inicio"
          >
            {/* El Oso: Grande y completo */}
            <div className="relative h-20 w-20 sm:h-28 sm:w-28 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logodeton.png"
                alt="Logo DetonAR73"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Texto DetonAR73 */}
            <div className="flex flex-col">
              <span className="text-2xl font-black italic tracking-tighter text-white sm:text-3xl">
                Deton<span className="text-red-600">AR73</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold -mt-1 ml-1">
                Arte & Diseño
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-widest text-white border border-white/10 hover:bg-white/10 transition-all active:scale-95"
          >
            <span>{open ? "Cerrar" : "Menú"}</span>
            <div className="flex flex-col gap-1 w-5">
              <span
                className={`h-0.5 w-full bg-current transition-all ${
                  open ? "rotate-45 translate-y-1.5 text-red-500" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full bg-current transition-all ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full bg-current transition-all ${
                  open ? "-rotate-45 -translate-y-1.5 text-red-500" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Menú Desplegable */}
        {open && (
          <div className="pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <nav className="flex flex-col gap-2 border-t border-white/5 pt-6">
              {links.map((l) => (
                <NavLink
                  key={l.href}
                  href={l.href}
                  label={l.label}
                  onNavigate={() => setOpen(false)}
                />
              ))}

              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-3 rounded-xl bg-white text-black px-6 py-4 text-sm font-black uppercase tracking-widest transition-all hover:bg-red-600 hover:text-white active:scale-95 shadow-xl shadow-white/5"
              >
                Instagram
              </a>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
