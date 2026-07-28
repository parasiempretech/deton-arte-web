"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

export function ContactDock() {
  const pathname = usePathname();
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");

    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (pathname === "/contacto" || footerVisible) return null;

  return (
    <aside
      data-quick-contact
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 transition-[opacity,transform,visibility] duration-200 sm:bottom-6 sm:right-6"
      aria-label="Contacto rápido"
    >
      <a
        href={site.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex min-h-12 items-center gap-2.5 rounded-full border border-red-300/25 bg-[#151416]/95 p-1.5 pr-1.5 text-white shadow-[0_14px_34px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-colors duration-200 hover:border-red-300/45 hover:bg-[#1b181a] sm:pr-4"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 font-[family-name:var(--font-body)] text-xs font-semibold tracking-[0.01em] text-white transition-colors group-hover:bg-red-500"
          aria-hidden="true"
        >
          WA
        </span>
        <span className="hidden font-[family-name:var(--font-body)] text-xs font-semibold uppercase tracking-[0.09em] sm:block">
          WhatsApp
        </span>
        <span className="sr-only">{site.phone}</span>
      </a>
    </aside>
  );
}
