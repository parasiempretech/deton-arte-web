import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Newsreader } from "next/font/google";

import "./globals.css";

const displayFont = Newsreader({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-display",
});

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: "variable",
  style: "normal",
  axes: ["wdth"],
  variable: "--font-body",
});

const siteTitle = "Deton Arte | Piezas únicas hechas a mano";
const siteDescription =
  "Arte a pedido en Argentina: cuadros personalizados, retratos de mascotas, murales y banderas. Transformamos tus ideas en arte.";

function getMetadataBase() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  const value = configuredUrl || (vercelUrl ? `https://${vercelUrl}` : "");

  try {
    return new URL(value || "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: siteTitle,
    template: "%s | Deton Arte",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "arte",
    "murales",
    "retratos mascotas",
    "cuadros a pedido",
    "diseño",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    title: siteTitle,
    description: siteDescription,
    url: "/",
    images: [
      {
        url: "/og.jpg",
        width: 1536,
        height: 1024,
        alt: "Deton Arte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#060607",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${displayFont.variable} ${bodyFont.variable} scroll-smooth`}
    >
      <body
        className={[
          "relative min-h-dvh overflow-x-hidden bg-ink-950 text-white antialiased",
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}
