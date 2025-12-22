import type { Metadata, Viewport } from "next";
import { Oswald, Inter } from "next/font/google";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Deton Arte | Piezas únicas hechas a mano",
  description:
    "Arte a pedido en Argentina: cuadros personalizdos, retratos de mascotas, murales y banderas. Transformamos tus ideas en arte.",
  keywords: [
    "arte",
    "murales",
    "retratos mascotas",
    "cuadros a pedido",
    "diseño",
  ],
};

// ✅ Importante para mobile (zoom y viewport correcto)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${oswald.variable} ${inter.variable} scroll-smooth`}
    >
      <body
        className={[
          "relative bg-ink-950 text-white antialiased",
          "min-h-dvh overflow-x-hidden", // ✅ dvh + sin scroll lateral
          "selection:bg-red-500/30 selection:text-red-200",
        ].join(" ")}
      >
        {/* ================= CAPAS DE FONDO (RESPONSIVE) ================= */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {/* 1. Base sólida */}
          <div className="absolute inset-0 bg-ink-950" />

          {/* 2. Glows (más chicos en mobile, más grandes en desktop) */}
          <div className="absolute -left-[20%] -top-[20%] h-[55vw] w-[55vw] sm:h-[40%] sm:w-[40%] rounded-full bg-red-900/10 blur-[120px]" />
          <div className="absolute -right-[15%] top-[15%] h-[45vw] w-[45vw] sm:h-[30%] sm:w-[30%] rounded-full bg-blue-900/5 blur-[100px]" />

          {/* 3. Dot pattern (suave en mobile, un poco más visible en desktop) */}
          <div
            className="absolute inset-0 opacity-[0.08] sm:opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* 4. Ruido (menos en mobile para que no ensucie y no pese tanto) */}
          <div
            className="absolute inset-0 opacity-[0.05] sm:opacity-[0.08] mix-blend-soft-light"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        {/* ================= ESTRUCTURA ================= */}
        <div className="flex min-h-dvh flex-col">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
