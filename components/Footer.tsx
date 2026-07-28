import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { categories, site } from "@/lib/site";

const navigationLinks = [
  { name: "Inicio", href: "/" },
  ...categories.map((category) => ({
    name: category.title,
    href: category.href,
  })),
  { name: "Contacto", href: "/contacto" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/[0.08] bg-[#040405] py-7 sm:py-16 lg:py-20">
      <div className="grain-overlay absolute inset-0 opacity-25" />
      <div className="section-divider absolute inset-x-0 top-0" />

      <Container className="relative">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="hidden sm:block">
            <Link
              href="/"
              className="group inline-flex items-center gap-4 rounded-2xl"
              aria-label="Ir al inicio"
            >
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/[0.12] bg-[#f4d8ca]">
                <Image
                  src="/logodeton.png"
                  alt=""
                  fill
                  className="scale-[1.08] object-cover object-top"
                  sizes="64px"
                />
              </span>
              <span>
                <span className="block font-[family-name:var(--font-display)] text-3xl font-semibold italic leading-none tracking-[-0.04em] text-white">
                  Deton<span className="text-red-500">AR73</span>
                </span>
                <span className="mt-2 block font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.17em] text-white/40">
                  Arte & Diseño
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-6 text-white/50">
              Arte & Diseño Personalizado.
            </p>

            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-action mt-7"
              aria-label="Instagram"
            >
              Instagram
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-[0.75fr_1.25fr] sm:gap-10">
            <nav aria-label="Navegación del pie">
              <div className="eyebrow hidden sm:inline-flex">Navegación</div>
              <ul className="flex flex-wrap gap-x-5 gap-y-1 sm:mt-5 sm:grid sm:grid-cols-1 sm:gap-x-0 sm:gap-y-1">
                {navigationLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group inline-flex min-h-7 items-center gap-2 rounded-lg text-xs font-semibold text-white/[0.58] transition-colors hover:text-white sm:min-h-10 sm:text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <div className="eyebrow hidden sm:inline-flex">Contacto</div>
              <div className="grid grid-cols-[0.86fr_1.14fr] gap-px overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.09] sm:mt-5 sm:grid-cols-2 sm:gap-2 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent lg:grid-cols-1">
                <a
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-[3.35rem] items-center justify-between gap-2 bg-[#080809] px-3 transition-colors duration-200 hover:bg-red-500/[0.06] sm:min-h-[3.75rem] sm:rounded-2xl sm:border sm:border-white/[0.1] sm:bg-white/[0.035] sm:px-4 sm:hover:border-red-300/25 lg:min-h-[4.25rem]"
                >
                  <span>
                    <span className="block font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.13em] text-red-300/70">
                      WhatsApp
                    </span>
                    <span className="mt-0.5 block text-xs font-bold text-white/75 sm:text-sm">
                      {site.phone}
                    </span>
                  </span>
                  <span
                    className="text-xs text-white/25 transition-colors group-hover:text-red-300 sm:text-base"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>

                <a
                  href={site.emailUrl}
                  className="group flex min-h-[3.35rem] min-w-0 items-center justify-between gap-2 bg-[#080809] px-3 transition-colors duration-200 hover:bg-red-500/[0.06] sm:min-h-[3.75rem] sm:rounded-2xl sm:border sm:border-white/[0.1] sm:bg-white/[0.035] sm:px-4 sm:hover:border-red-300/25 lg:min-h-[4.25rem]"
                >
                  <span className="min-w-0">
                    <span className="block font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.13em] text-red-300/70">
                      Email
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold leading-4 text-white/75 [overflow-wrap:anywhere] sm:text-sm">
                      {site.email}
                    </span>
                  </span>
                  <span
                    className="hidden shrink-0 text-white/25 transition-colors group-hover:text-red-300 sm:inline"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>

                <div className="col-span-2 flex min-h-[3rem] items-center bg-[#080809] px-3 sm:min-h-[3.75rem] sm:rounded-2xl sm:border sm:border-white/[0.1] sm:bg-white/[0.035] sm:px-4 lg:col-span-1 lg:min-h-[4.25rem]">
                  <span>
                    <span className="block font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.13em] text-red-300/70">
                      Horario
                    </span>
                    <span className="mt-0.5 block text-xs font-bold leading-4 text-white/75 sm:text-sm sm:leading-5">
                      {site.hours}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start gap-2 border-t border-white/[0.08] pt-4 sm:mt-12 sm:flex-row sm:items-center sm:gap-5 sm:pt-7">
          <div className="min-w-0 text-[10px] uppercase leading-4 tracking-[0.08em] text-white/50 sm:tracking-[0.12em]">
            © {currentYear} {site.brand} — Todos los derechos reservados.
          </div>

          <a
            href={site.studioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-1 text-[10px] font-medium uppercase tracking-[0.08em] text-white/50 transition-colors hover:text-white sm:ml-auto sm:tracking-[0.12em]"
            aria-label={`${site.studioName} en Instagram`}
          >
            BY{" "}
            <span className="ml-1 text-white/70 transition-colors group-hover:text-red-400">
              {site.studioName}
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
