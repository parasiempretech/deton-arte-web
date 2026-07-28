import "server-only";

import {
  getStaticImageKey,
  listAllManagedImages,
  listHiddenStaticImageKeys,
  listManagedImages,
} from "./admin/storage";
import type {
  AdminGalleryItem,
  GalleryItem,
} from "./gallery-types";
import type { CategoryKey } from "./site";
import {
  listStaticAdminImages,
  staticGalleries,
} from "./static-gallery";

export type { GalleryItem } from "./gallery-types";

export async function getGallery(category: CategoryKey) {
  try {
    const [managedItems, hiddenStaticKeys] = await Promise.all([
      listManagedImages(category),
      listHiddenStaticImageKeys(category),
    ]);
    const visibleStaticItems = staticGalleries[category].filter(
      (item) =>
        !hiddenStaticKeys.has(getStaticImageKey(category, item.id)),
    );

    return [...managedItems, ...visibleStaticItems];
  } catch {
    return staticGalleries[category];
  }
}

export async function getAdminGalleryItems(): Promise<AdminGalleryItem[]> {
  const [managedItems, hiddenStaticKeys] = await Promise.all([
    listAllManagedImages(),
    listHiddenStaticImageKeys(),
  ]);
  const staticItems = listStaticAdminImages().filter(
    (item) =>
      !hiddenStaticKeys.has(getStaticImageKey(item.category, item.id)),
  );

  return [...managedItems, ...staticItems];
}
