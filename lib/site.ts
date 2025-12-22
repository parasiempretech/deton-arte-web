export const site = {
  brand: "Deton Arte",
  handle: "deton.arte",
  instagramUrl: "https://www.instagram.com/deton.arte/",
  hours: "10:00 a 20:00",
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
  pricingMode: "estimativo" | "a_medida";
}> = [
  { key: "cuadros", title: "Cuadros", subtitle: "Piezas a pedido, hechas a mano.", href: "/cuadros", cta: "Ver cuadros", pricingMode: "estimativo" },
  { key: "mascotas", title: "Mascotas", subtitle: "Retratos con alma. Ideal para regalar.", href: "/mascotas", cta: "Ver retratos", pricingMode: "estimativo" },
  { key: "murales", title: "Murales", subtitle: "Interiores y exteriores. Cada proyecto es único.", href: "/murales", cta: "Ver murales", pricingMode: "a_medida" },
  { key: "telas", title: "Telas / Banderas", subtitle: "Diseños sobre tela por encargo.", href: "/telas", cta: "Ver telas", pricingMode: "a_medida" },
  { key: "cositas", title: "Cositas", subtitle: "Piezas varias e intervenidas. Únicas.", href: "/cositas", cta: "Ver cositas", pricingMode: "a_medida" },
];
