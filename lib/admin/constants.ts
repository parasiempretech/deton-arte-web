import type { CategoryKey } from "../site";

export const MAX_UPLOAD_BYTES = 40 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 60_000_000;
export const MAX_OUTPUT_DIMENSION = 2400;

export const categoryKeys: CategoryKey[] = [
  "cuadros",
  "mascotas",
  "murales",
  "telas",
  "cositas",
];

export const categoryLabels: Record<CategoryKey, string> = {
  cuadros: "Cuadros",
  mascotas: "Mascotas",
  murales: "Murales",
  telas: "Telas / Banderas",
  cositas: "Cositas",
};

export function isCategoryKey(value: unknown): value is CategoryKey {
  return typeof value === "string" && categoryKeys.includes(value as CategoryKey);
}
