import fs from "fs";
import path from "path";
import type { CategoryKey } from "./site";

export type GalleryItem = {
  id: string;
  title: string;
  src: string;
};

function readGallery(dir: string, label: string): GalleryItem[] {
  const basePath = path.join(process.cwd(), "public", dir);

  if (!fs.existsSync(basePath)) return [];

  return fs
    .readdirSync(basePath)
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort()
    .map((file, index) => ({
      id: `${label}-${index + 1}`,
      title: `${label.charAt(0).toUpperCase() + label.slice(1)} ${index + 1}`,
      src: `/${dir}/${file}`,
    }));
}

export const galleries: Record<CategoryKey, GalleryItem[]> = {
  cuadros: readGallery("galeria/cuadros", "cuadro"),
  mascotas: readGallery("galeria/mascotas", "mascota"),
  murales: readGallery("galeria/murales", "mural"),
  telas: readGallery("galeria/telas", "tela"),
  cositas: readGallery("galeria/cositas", "cosita"),
};
