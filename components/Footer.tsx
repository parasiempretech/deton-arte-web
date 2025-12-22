import Link from "next/link";
import { Container } from "./Container";
import { site } from "@/lib/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { name: "Inicio", href: "/" },
    { name: "Cuadros", href: "/cuadros" },
    { name: "Mascotas", href: "/mascotas" },
    { name: "Murales", href: "/murales" },
    { name: "Telas", href: "/telas" },
    { name: "Cositas", href: "/cositas" },
    { name: "Contacto", href: "/contacto" },
  ];

  return (
    <footer className="mt-auto border-t border-white/5 bg-black py-12">
      <Container>
        <div className="flex flex-col gap-12">
          {/* TOP: Marca y Navegación Simple */}
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
            {/* Branding */}
            <div className="space-y-2">
              <Link
                href="/"
                className="text-lg font-bold tracking-tight text-white transition hover:text-red-500"
              >
                {site.brand.toUpperCase()}
              </Link>
              <p className="text-sm text-zinc-500">
                Arte & Diseño Personalizado.
              </p>
            </div>

            {/* Enlaces en una sola línea (o grid pequeño) */}
            <nav>
              <ul className="flex flex-wrap gap-x-6 gap-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 transition hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* BOTTOM: Copyright y Créditos */}
          <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 md:flex-row">
            <div className="text-[10px] uppercase tracking-widest text-zinc-600">
              © {currentYear} {site.brand} — All Rights Reserved.
            </div>

            <div className="flex items-center gap-6">
              {/* Instagram link minimalista */}
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 transition hover:text-white"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              <div className="h-3 w-px bg-white/10" />

              <a
                href="https://instagram.com/parasiempretech"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-[10px] font-medium tracking-widest text-zinc-600 transition hover:text-white"
              >
                BY{" "}
                <span className="text-zinc-400 group-hover:text-red-500">
                  PARASIEMPRETECH
                </span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
