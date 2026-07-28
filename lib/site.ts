export const site = {
  brand: "Deton Arte",
  handle: "deton.arte",
  instagramUrl: "https://www.instagram.com/deton.arte/",
  phone: "1132312327",
  whatsappUrl: "https://wa.me/5491132312327",
  email: "Deton.arte@hotmail.com",
  emailUrl: "mailto:Deton.arte@hotmail.com",
  hours: "de lunes a viernes, de 10 a 19 hs",
  studioName: "Eversys Solutions",
  studioUrl: "https://www.instagram.com/eversys.solutions/",
  deposit: "Seña del 50% (obligatoria)",
  installments: "3 cuotas con 15% de recargo",
};

export type CategoryKey = "cuadros" | "mascotas" | "murales" | "telas" | "cositas";

export const categories: Array<{
  key: CategoryKey;
  title: string;
  subtitle: string;
  href: string;
  cta: string;
}> = [
  {
    key: "cuadros",
    title: "Cuadros",
    subtitle: "Piezas a pedido, hechas a mano.",
    href: "/cuadros",
    cta: "Ver cuadros",
  },
  {
    key: "mascotas",
    title: "Mascotas",
    subtitle: "Retratos con alma. Ideal para regalar.",
    href: "/mascotas",
    cta: "Ver retratos",
  },
  {
    key: "murales",
    title: "Murales",
    subtitle: "Interiores y exteriores. Cada proyecto es único.",
    href: "/murales",
    cta: "Ver murales",
  },
  {
    key: "telas",
    title: "Telas / Banderas",
    subtitle: "Diseños sobre tela por encargo.",
    href: "/telas",
    cta: "Ver telas",
  },
  {
    key: "cositas",
    title: "Cositas",
    subtitle: "Piezas varias e intervenidas. Únicas.",
    href: "/cositas",
    cta: "Ver cositas",
  },
];
