import { CategoryPage } from "@/components/CategoryPage";
import { getGallery } from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "Cuadros personalizados. Cada obra se ajusta según tamaño, técnica y nivel de detalle.";

export const metadata = createPageMetadata({
  title: "Cuadros",
  description,
  path: "/cuadros",
});

export default async function Page() {
  const items = await getGallery("cuadros");

  return (
    <CategoryPage
      title="Cuadros"
      subtitle={description}
      coverSrc="/covers/cuadros.webp"
      items={items}
    />
  );
}
