import "server-only";

import fs from "fs";
import path from "path";

import type {
  GalleryItem,
  StaticAdminGalleryItem,
} from "./gallery-types";
import type { CategoryKey } from "./site";

function readJpegSize(buffer: Buffer) {
  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    offset += 2;

    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 1 >= buffer.length) break;

    const blockLength = buffer.readUInt16BE(offset);
    const sizeMarkers = [
      0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce,
      0xcf,
    ];

    if (sizeMarkers.includes(marker) && offset + 7 < buffer.length) {
      return {
        width: buffer.readUInt16BE(offset + 5),
        height: buffer.readUInt16BE(offset + 3),
      };
    }

    if (blockLength < 2) break;
    offset += blockLength;
  }

  return null;
}

function readWebpSize(buffer: Buffer) {
  const chunk = buffer.toString("ascii", 12, 16);

  if (chunk === "VP8X" && buffer.length >= 30) {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }

  if (chunk === "VP8L" && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);
    return {
      width: 1 + (bits & 0x3fff),
      height: 1 + ((bits >> 14) & 0x3fff),
    };
  }

  if (chunk === "VP8 " && buffer.length >= 30) {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  return null;
}

function readImageSize(filePath: string) {
  const buffer = fs.readFileSync(filePath);

  if (buffer.toString("ascii", 0, 4) === "RIFF") {
    return readWebpSize(buffer) ?? { width: 4, height: 5 };
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    return readJpegSize(buffer) ?? { width: 4, height: 5 };
  }

  if (
    buffer.length >= 24 &&
    buffer.toString("hex", 0, 8) === "89504e470d0a1a0a"
  ) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  return { width: 4, height: 5 };
}

function readGallery(dir: string): GalleryItem[] {
  const basePath = path.join(process.cwd(), "public", dir);

  if (!fs.existsSync(basePath)) return [];

  return fs
    .readdirSync(basePath)
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort()
    .map((file) => {
      const dimensions = readImageSize(path.join(basePath, file));

      return {
        id: `${dir}/${file}`,
        src: `/${dir}/${file}`,
        ...dimensions,
      };
    });
}

export const staticGalleries: Record<CategoryKey, GalleryItem[]> = {
  cuadros: readGallery("galeria/cuadros"),
  mascotas: readGallery("galeria/mascotas"),
  murales: readGallery("galeria/murales"),
  telas: readGallery("galeria/telas"),
  cositas: readGallery("galeria/cositas"),
};

export function isStaticGalleryItem(category: CategoryKey, id: string) {
  return staticGalleries[category].some((item) => item.id === id);
}

export function listStaticAdminImages(): StaticAdminGalleryItem[] {
  return (Object.entries(staticGalleries) as Array<
    [CategoryKey, GalleryItem[]]
  >).flatMap(([category, items]) =>
    items.map((item) => ({
      ...item,
      category,
      source: "static" as const,
    })),
  );
}
