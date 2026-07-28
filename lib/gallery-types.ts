import type { CategoryKey } from "./site";

export type GalleryItem = {
  id: string;
  src: string;
  width: number;
  height: number;
};

export type ManagedGalleryItem = GalleryItem & {
  category: CategoryKey;
  createdAt: string;
  managed: true;
  size: number;
  source: "managed";
};

export type StaticAdminGalleryItem = GalleryItem & {
  category: CategoryKey;
  source: "static";
};

export type AdminGalleryItem =
  | ManagedGalleryItem
  | StaticAdminGalleryItem;

export type StorageMode = "blob" | "local" | "unavailable";
