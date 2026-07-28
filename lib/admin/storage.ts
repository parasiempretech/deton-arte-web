import "server-only";

import { createHash, randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

import type {
  ManagedGalleryItem,
  StorageMode,
} from "../gallery-types";
import type { CategoryKey } from "../site";
import { isStaticGalleryItem } from "../static-gallery";
import {
  categoryKeys,
  MAX_IMAGE_PIXELS,
  MAX_OUTPUT_DIMENSION,
  MAX_UPLOAD_BYTES,
} from "./constants";

const LOCAL_DEVELOPMENT_ROOT = path.join(
  process.cwd(),
  "data",
  "gallery",
);
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ImageMetadata = {
  category: CategoryKey;
  createdAt: string;
  height: number;
  id: string;
  originalName: string;
  size: number;
  width: number;
};

export class UploadValidationError extends Error {}

function resolveStorageRoot() {
  const configuredPath = process.env.GALLERY_STORAGE_PATH?.trim();
  if (configuredPath) return path.resolve(configuredPath);

  if (process.env.NODE_ENV !== "production") {
    return LOCAL_DEVELOPMENT_ROOT;
  }

  const runtimeDirectory = process.cwd();
  if (path.basename(runtimeDirectory).toLowerCase() === "nodejs") {
    return path.join(
      path.dirname(runtimeDirectory),
      "deton-arte-storage",
      "gallery",
    );
  }

  const accountHome =
    process.env.HOME?.trim() || process.env.USERPROFILE?.trim();
  if (!accountHome) return null;

  try {
    const hostname = new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "",
    ).hostname;
    if (hostname) {
      return path.join(
        accountHome,
        "domains",
        hostname,
        "deton-arte-storage",
        "gallery",
      );
    }
  } catch {
    // La ruta general de la cuenta sigue siendo persistente.
  }

  return path.join(accountHome, "deton-arte-storage", "gallery");
}

function requireStorageRoot() {
  const root = resolveStorageRoot();
  if (!root) {
    throw new UploadValidationError(
      "El almacenamiento del hosting no está disponible.",
    );
  }
  return root;
}

export function getStorageMode(): StorageMode {
  return resolveStorageRoot() ? "filesystem" : "unavailable";
}

function getCategoryDirectory(category: CategoryKey) {
  return path.join(requireStorageRoot(), category);
}

function getHiddenDirectory(category: CategoryKey) {
  return path.join(requireStorageRoot(), ".hidden", category);
}

function getImagePaths(category: CategoryKey, id: string) {
  if (!UUID_PATTERN.test(id)) {
    throw new UploadValidationError("Identificador de imagen inválido.");
  }

  const directory = getCategoryDirectory(category);
  return {
    directory,
    image: path.join(directory, `${id}.webp`),
    metadata: path.join(directory, `${id}.json`),
  };
}

function normalizeOriginalName(name: string) {
  const cleanName = path
    .basename(name)
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();

  return cleanName.slice(0, 140) || "imagen";
}

async function normalizeImage(buffer: Buffer) {
  if (buffer.length === 0 || buffer.length > MAX_UPLOAD_BYTES) {
    throw new UploadValidationError(
      "La imagen está vacía o supera el límite de 40 MB.",
    );
  }

  try {
    const { data, info } = await sharp(buffer, {
      failOn: "error",
      limitInputPixels: MAX_IMAGE_PIXELS,
      sequentialRead: true,
    })
      .rotate()
      .resize({
        fit: "inside",
        height: MAX_OUTPUT_DIMENSION,
        width: MAX_OUTPUT_DIMENSION,
        withoutEnlargement: true,
      })
      .webp({
        alphaQuality: 90,
        effort: 4,
        quality: 86,
        smartSubsample: true,
      })
      .toBuffer({ resolveWithObject: true });

    if (!info.width || !info.height) {
      throw new Error("Dimensiones no disponibles");
    }

    return {
      buffer: data,
      height: info.height,
      size: data.length,
      width: info.width,
    };
  } catch (error) {
    if (error instanceof UploadValidationError) throw error;
    throw new UploadValidationError(
      "El archivo no es una imagen válida o utiliza un formato no compatible.",
    );
  }
}

function toManagedItem(metadata: ImageMetadata): ManagedGalleryItem {
  return {
    category: metadata.category,
    createdAt: metadata.createdAt,
    height: metadata.height,
    id: metadata.id,
    managed: true,
    size: metadata.size,
    source: "managed",
    src: `/api/media/${metadata.category}/${metadata.id}.webp`,
    width: metadata.width,
  };
}

async function readImageMetadata(
  category: CategoryKey,
  fileName: string,
): Promise<ManagedGalleryItem | null> {
  if (!fileName.endsWith(".json")) return null;

  try {
    const raw = await fs.readFile(
      path.join(getCategoryDirectory(category), fileName),
      "utf8",
    );
    const metadata = JSON.parse(raw) as Partial<ImageMetadata>;

    if (
      !UUID_PATTERN.test(metadata.id ?? "") ||
      metadata.category !== category ||
      typeof metadata.createdAt !== "string" ||
      !Number.isFinite(Date.parse(metadata.createdAt)) ||
      typeof metadata.height !== "number" ||
      !Number.isSafeInteger(metadata.height) ||
      metadata.height <= 0 ||
      metadata.height > MAX_OUTPUT_DIMENSION ||
      typeof metadata.width !== "number" ||
      !Number.isSafeInteger(metadata.width) ||
      metadata.width <= 0 ||
      metadata.width > MAX_OUTPUT_DIMENSION ||
      typeof metadata.size !== "number" ||
      !Number.isSafeInteger(metadata.size) ||
      metadata.size <= 0 ||
      metadata.size > MAX_UPLOAD_BYTES
    ) {
      return null;
    }

    const paths = getImagePaths(category, metadata.id as string);
    await fs.access(paths.image);
    return toManagedItem(metadata as ImageMetadata);
  } catch {
    return null;
  }
}

async function listCategoryImages(category: CategoryKey) {
  const directory = getCategoryDirectory(category);

  try {
    const fileNames = await fs.readdir(directory);
    const items = await Promise.all(
      fileNames.map((fileName) =>
        readImageMetadata(category, fileName),
      ),
    );

    return items
      .filter((item): item is ManagedGalleryItem => item !== null)
      .sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt),
      );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function listManagedImages(category: CategoryKey) {
  if (getStorageMode() !== "filesystem") return [];
  return listCategoryImages(category);
}

export async function listAllManagedImages() {
  if (getStorageMode() !== "filesystem") return [];

  const grouped = await Promise.all(
    categoryKeys.map(listCategoryImages),
  );
  return grouped
    .flat()
    .sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    );
}

export async function saveFilesystemUpload(
  file: File,
  category: CategoryKey,
) {
  if (getStorageMode() !== "filesystem") {
    throw new UploadValidationError(
      "El almacenamiento del hosting no está disponible.",
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadValidationError(
      "La imagen supera el límite de 40 MB.",
    );
  }

  const normalized = await normalizeImage(
    Buffer.from(await file.arrayBuffer()),
  );
  const id = randomUUID();
  const paths = getImagePaths(category, id);
  const metadata: ImageMetadata = {
    category,
    createdAt: new Date().toISOString(),
    height: normalized.height,
    id,
    originalName: normalizeOriginalName(file.name),
    size: normalized.size,
    width: normalized.width,
  };

  await fs.mkdir(paths.directory, { recursive: true });

  try {
    await fs.writeFile(`${paths.image}.tmp`, normalized.buffer, {
      flag: "wx",
    });
    await fs.rename(`${paths.image}.tmp`, paths.image);
    await fs.writeFile(
      `${paths.metadata}.tmp`,
      JSON.stringify(metadata, null, 2),
      { encoding: "utf8", flag: "wx" },
    );
    await fs.rename(`${paths.metadata}.tmp`, paths.metadata);
  } catch (error) {
    await Promise.allSettled([
      fs.rm(`${paths.image}.tmp`, { force: true }),
      fs.rm(paths.image, { force: true }),
      fs.rm(`${paths.metadata}.tmp`, { force: true }),
      fs.rm(paths.metadata, { force: true }),
    ]);
    throw error;
  }

  return toManagedItem(metadata);
}

export async function deleteManagedImage(
  category: CategoryKey,
  id: string,
) {
  if (!UUID_PATTERN.test(id)) {
    throw new UploadValidationError(
      "Identificador de imagen inválido.",
    );
  }
  if (getStorageMode() !== "filesystem") {
    throw new UploadValidationError(
      "El almacenamiento del hosting no está disponible.",
    );
  }

  const paths = getImagePaths(category, id);
  const results = await Promise.allSettled([
    fs.rm(paths.image, { force: true }),
    fs.rm(paths.metadata, { force: true }),
  ]);
  if (results.some((result) => result.status === "rejected")) {
    throw new Error("No se pudo eliminar la imagen.");
  }
}

export function getStaticImageKey(category: CategoryKey, id: string) {
  return createHash("sha256")
    .update(`${category}:${id}`)
    .digest("hex");
}

async function listHiddenKeysForCategory(category: CategoryKey) {
  try {
    const names = await fs.readdir(getHiddenDirectory(category));
    return names
      .filter((name) => /^[0-9a-f]{64}\.hidden$/i.test(name))
      .map((name) => name.slice(0, -".hidden".length));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function listHiddenStaticImageKeys(
  category?: CategoryKey,
) {
  if (getStorageMode() !== "filesystem") return new Set<string>();

  const categories = category ? [category] : categoryKeys;
  const grouped = await Promise.all(
    categories.map(listHiddenKeysForCategory),
  );
  return new Set(grouped.flat());
}

export async function hideStaticImage(
  category: CategoryKey,
  id: string,
) {
  if (!isStaticGalleryItem(category, id)) {
    throw new UploadValidationError("La imagen ya no existe.");
  }
  if (getStorageMode() !== "filesystem") {
    throw new UploadValidationError(
      "El almacenamiento del hosting no está disponible.",
    );
  }

  const directory = getHiddenDirectory(category);
  const key = getStaticImageKey(category, id);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(
    path.join(directory, `${key}.hidden`),
    new Date().toISOString(),
    { encoding: "utf8", flag: "wx" },
  ).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== "EEXIST") throw error;
  });
}

export async function readFilesystemImage(
  category: CategoryKey,
  fileName: string,
) {
  const match = fileName.match(
    /^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\.webp$/i,
  );
  if (!match || getStorageMode() !== "filesystem") return null;

  try {
    return await fs.readFile(
      getImagePaths(category, match[1]).image,
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
