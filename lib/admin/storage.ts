import "server-only";

import { createHash, randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { del, list, put, type ListBlobResultBlob } from "@vercel/blob";
import sharp from "sharp";

import type {
  ManagedGalleryItem,
  StorageMode,
} from "../gallery-types";
import type { CategoryKey } from "../site";
import { isStaticGalleryItem } from "../static-gallery";
import {
  categoryKeys,
  isCategoryKey,
  MAX_IMAGE_PIXELS,
  MAX_OUTPUT_DIMENSION,
  MAX_UPLOAD_BYTES,
} from "./constants";

const BLOB_PREFIX = "deton-gallery";
const STAGING_PREFIX = "deton-staging";
const HIDDEN_STATIC_PREFIX = "deton-hidden";
const LOCAL_ROOT = path.join(process.cwd(), "data", "gallery");
const LOCAL_HIDDEN_ROOT = path.join(LOCAL_ROOT, ".hidden");
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type LocalMetadata = {
  category: CategoryKey;
  createdAt: string;
  height: number;
  id: string;
  originalName: string;
  size: number;
  width: number;
};

export class UploadValidationError extends Error {}

export function getStorageMode(): StorageMode {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) return "blob";
  if (process.env.NODE_ENV === "production") return "unavailable";
  return "local";
}

function getCategoryDirectory(category: CategoryKey) {
  return path.join(LOCAL_ROOT, category);
}

function getLocalPaths(category: CategoryKey, id: string) {
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

function toLocalItem(metadata: LocalMetadata): ManagedGalleryItem {
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

async function readLocalMetadata(
  category: CategoryKey,
  fileName: string,
): Promise<ManagedGalleryItem | null> {
  if (!fileName.endsWith(".json")) return null;

  try {
    const raw = await fs.readFile(
      path.join(getCategoryDirectory(category), fileName),
      "utf8",
    );
    const metadata = JSON.parse(raw) as Partial<LocalMetadata>;

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

    const paths = getLocalPaths(category, metadata.id as string);
    await fs.access(paths.image);
    return toLocalItem(metadata as LocalMetadata);
  } catch {
    return null;
  }
}

async function listLocalImages(category: CategoryKey) {
  const directory = getCategoryDirectory(category);

  try {
    const fileNames = await fs.readdir(directory);
    const items = await Promise.all(
      fileNames.map((fileName) => readLocalMetadata(category, fileName)),
    );

    return items
      .filter((item): item is ManagedGalleryItem => item !== null)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

function parseBlobItem(blob: ListBlobResultBlob): ManagedGalleryItem | null {
  const match = blob.pathname.match(
    /^deton-gallery\/(cuadros|mascotas|murales|telas|cositas)\/\d+-([0-9a-f-]{36})-(\d+)x(\d+)\.webp$/i,
  );

  if (!match || !isCategoryKey(match[1]) || !UUID_PATTERN.test(match[2])) {
    return null;
  }

  const width = Number(match[3]);
  const height = Number(match[4]);
  if (
    !Number.isSafeInteger(width) ||
    !Number.isSafeInteger(height) ||
    width <= 0 ||
    height <= 0 ||
    width > MAX_OUTPUT_DIMENSION ||
    height > MAX_OUTPUT_DIMENSION
  ) {
    return null;
  }

  return {
    category: match[1],
    createdAt: blob.uploadedAt.toISOString(),
    height,
    id: match[2],
    managed: true,
    size: blob.size,
    source: "managed",
    src: blob.url,
    width,
  };
}

async function listBlobImages(category?: CategoryKey) {
  const prefix = category
    ? `${BLOB_PREFIX}/${category}/`
    : `${BLOB_PREFIX}/`;
  const blobs: ListBlobResultBlob[] = [];
  let cursor: string | undefined;

  do {
    const result = await list({ cursor, limit: 1000, prefix });
    blobs.push(...result.blobs);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  return blobs
    .map(parseBlobItem)
    .filter((item): item is ManagedGalleryItem => item !== null)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

async function cleanupStaleStagingBlobs() {
  const expiration = Date.now() - 60 * 60 * 1000;
  const stalePathnames: string[] = [];
  let cursor: string | undefined;

  do {
    const result = await list({
      cursor,
      limit: 1000,
      prefix: `${STAGING_PREFIX}/`,
    });
    result.blobs.forEach((blob) => {
      if (blob.uploadedAt.getTime() < expiration) {
        stalePathnames.push(blob.pathname);
      }
    });
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  if (stalePathnames.length) await del(stalePathnames);
}

export async function listManagedImages(category: CategoryKey) {
  const mode = getStorageMode();
  if (mode === "blob") return listBlobImages(category);
  if (mode === "local") return listLocalImages(category);
  return [];
}

export async function listAllManagedImages() {
  const mode = getStorageMode();
  if (mode === "blob") {
    await cleanupStaleStagingBlobs();
    return listBlobImages();
  }
  if (mode === "unavailable") return [];

  const grouped = await Promise.all(categoryKeys.map(listLocalImages));
  return grouped.flat().sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

export async function saveLocalUpload(file: File, category: CategoryKey) {
  if (getStorageMode() !== "local") {
    throw new UploadValidationError(
      "El almacenamiento local no está disponible en este entorno.",
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadValidationError("La imagen supera el límite de 40 MB.");
  }

  const normalized = await normalizeImage(
    Buffer.from(await file.arrayBuffer()),
  );
  const id = randomUUID();
  const paths = getLocalPaths(category, id);
  const metadata: LocalMetadata = {
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
    await fs.writeFile(`${paths.image}.tmp`, normalized.buffer, { flag: "wx" });
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

  return toLocalItem(metadata);
}

function isTrustedBlobUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".public.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

function blobUrlMatchesPath(urlValue: string, pathname: string) {
  try {
    const url = new URL(urlValue);
    const decodedPath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    return decodedPath === pathname;
  } catch {
    return false;
  }
}

async function readResponseWithLimit(response: Response, limit: number) {
  if (!response.body) {
    throw new UploadValidationError("No se pudo leer la imagen cargada.");
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      totalBytes += value.byteLength;
      if (totalBytes > limit) {
        await reader.cancel();
        throw new UploadValidationError(
          "La imagen supera el límite de 40 MB.",
        );
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return Buffer.concat(
    chunks.map((chunk) => Buffer.from(chunk)),
    totalBytes,
  );
}

export async function processStagedBlob(input: {
  category: CategoryKey;
  pathname: string;
  url: string;
}) {
  if (getStorageMode() !== "blob") {
    throw new UploadValidationError(
      "El almacenamiento permanente no está configurado.",
    );
  }
  if (
    !isTrustedBlobUrl(input.url) ||
    !blobUrlMatchesPath(input.url, input.pathname) ||
    !input.pathname.startsWith(`${STAGING_PREFIX}/${input.category}/`)
  ) {
    throw new UploadValidationError("La carga temporal no es válida.");
  }

  try {
    const response = await fetch(input.url, {
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      throw new UploadValidationError("No se pudo leer la imagen cargada.");
    }

    const contentLength = Number(response.headers.get("content-length") ?? 0);
    if (contentLength > MAX_UPLOAD_BYTES) {
      throw new UploadValidationError("La imagen supera el límite de 40 MB.");
    }

    const source = await readResponseWithLimit(response, MAX_UPLOAD_BYTES);
    const normalized = await normalizeImage(source);
    const id = randomUUID();
    const createdAt = Date.now();
    const pathname = `${BLOB_PREFIX}/${input.category}/${createdAt}-${id}-${normalized.width}x${normalized.height}.webp`;
    const blob = await put(pathname, normalized.buffer, {
      access: "public",
      addRandomSuffix: false,
      cacheControlMaxAge: 31_536_000,
      contentType: "image/webp",
    });

    return {
      category: input.category,
      createdAt: new Date(createdAt).toISOString(),
      height: normalized.height,
      id,
      managed: true,
      size: normalized.size,
      source: "managed",
      src: blob.url,
      width: normalized.width,
    } satisfies ManagedGalleryItem;
  } finally {
    await del(input.pathname).catch(() => undefined);
  }
}

export async function deleteManagedImage(
  category: CategoryKey,
  id: string,
) {
  if (!UUID_PATTERN.test(id)) {
    throw new UploadValidationError("Identificador de imagen inválido.");
  }

  const mode = getStorageMode();
  if (mode === "local") {
    const paths = getLocalPaths(category, id);
    const results = await Promise.allSettled([
      fs.rm(paths.image, { force: true }),
      fs.rm(paths.metadata, { force: true }),
    ]);
    if (results.some((result) => result.status === "rejected")) {
      throw new Error("No se pudo eliminar la imagen.");
    }
    return;
  }

  if (mode === "blob") {
    let blob: ListBlobResultBlob | undefined;
    let cursor: string | undefined;

    do {
      const result = await list({
        cursor,
        limit: 1000,
        prefix: `${BLOB_PREFIX}/${category}/`,
      });
      blob = result.blobs.find((item) =>
        item.pathname.includes(`-${id}-`),
      );
      cursor = !blob && result.hasMore ? result.cursor : undefined;
    } while (!blob && cursor);

    if (!blob) throw new UploadValidationError("La imagen ya no existe.");
    await del(blob.pathname);
    return;
  }

  throw new UploadValidationError(
    "El almacenamiento permanente no está configurado.",
  );
}

export function getStaticImageKey(category: CategoryKey, id: string) {
  return createHash("sha256")
    .update(`${category}:${id}`)
    .digest("hex");
}

function getLocalHiddenDirectory(category: CategoryKey) {
  return path.join(LOCAL_HIDDEN_ROOT, category);
}

async function listLocalHiddenStaticImageKeys(category?: CategoryKey) {
  const categories = category ? [category] : categoryKeys;
  const grouped = await Promise.all(
    categories.map(async (currentCategory) => {
      try {
        const names = await fs.readdir(
          getLocalHiddenDirectory(currentCategory),
        );
        return names
          .filter((name) => /^[0-9a-f]{64}\.hidden$/i.test(name))
          .map((name) => name.slice(0, -".hidden".length));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
        throw error;
      }
    }),
  );

  return new Set(grouped.flat());
}

async function listBlobHiddenStaticImageKeys(category?: CategoryKey) {
  const prefix = category
    ? `${HIDDEN_STATIC_PREFIX}/${category}/`
    : `${HIDDEN_STATIC_PREFIX}/`;
  const keys = new Set<string>();
  let cursor: string | undefined;

  do {
    const result = await list({ cursor, limit: 1000, prefix });
    result.blobs.forEach((blob) => {
      const match = blob.pathname.match(
        /^deton-hidden\/(?:cuadros|mascotas|murales|telas|cositas)\/([0-9a-f]{64})\.hidden$/i,
      );
      if (match) keys.add(match[1]);
    });
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  return keys;
}

export async function listHiddenStaticImageKeys(category?: CategoryKey) {
  const mode = getStorageMode();
  if (mode === "blob") return listBlobHiddenStaticImageKeys(category);
  if (mode === "local") return listLocalHiddenStaticImageKeys(category);
  return new Set<string>();
}

export async function hideStaticImage(
  category: CategoryKey,
  id: string,
) {
  if (!isStaticGalleryItem(category, id)) {
    throw new UploadValidationError("La imagen ya no existe.");
  }

  const key = getStaticImageKey(category, id);
  const mode = getStorageMode();

  if (mode === "local") {
    const directory = getLocalHiddenDirectory(category);
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(
      path.join(directory, `${key}.hidden`),
      new Date().toISOString(),
      "utf8",
    );
    return;
  }

  if (mode === "blob") {
    await put(
      `${HIDDEN_STATIC_PREFIX}/${category}/${key}.hidden`,
      new Date().toISOString(),
      {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "text/plain; charset=utf-8",
      },
    );
    return;
  }

  throw new UploadValidationError(
    "El almacenamiento permanente no está configurado.",
  );
}

export async function readLocalImage(
  category: CategoryKey,
  fileName: string,
) {
  const match = fileName.match(
    /^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\.webp$/i,
  );
  if (!match) return null;

  try {
    return await fs.readFile(getLocalPaths(category, match[1]).image);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export function getStagingPrefix(category: CategoryKey) {
  return `${STAGING_PREFIX}/${category}/`;
}
