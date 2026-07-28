import { redirect } from "next/navigation";

import { AdminPanel } from "@/components/admin/AdminPanel";
import { getAdminSession, isAdminConfigured } from "@/lib/admin/auth";
import { getStorageMode } from "@/lib/admin/storage";
import { getAdminGalleryItems } from "@/lib/gallery";
import type { AdminGalleryItem } from "@/lib/gallery-types";

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const session = await getAdminSession();
  if (!isAdminConfigured() || !session) redirect("/panel/login");

  const storageMode = getStorageMode();
  let initialItems: AdminGalleryItem[] = [];
  let loadError: string | undefined;

  try {
    initialItems = await getAdminGalleryItems();
  } catch {
    loadError =
      "No se pudieron leer las imágenes administradas. Volvé a intentar.";
  }

  return (
    <AdminPanel
      csrfToken={session.csrf}
      initialItems={initialItems}
      loadError={loadError}
      storageMode={storageMode}
    />
  );
}
