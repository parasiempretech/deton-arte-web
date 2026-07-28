import { CategoryPage } from "@/components/CategoryPage";
import { getGallery } from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "Retratos hechos a mano. Ideal para regalar o inmortalizar a tu compañero.";

export const metadata = createPageMetadata({
  title: "Cuadros Mascotas",
  description,
  path: "/mascotas",
});

export default async function Page() {
  const items = await getGallery("mascotas");

  return (
    <CategoryPage
      title="Cuadros Mascotas"
      subtitle={description}
      coverSrc="/covers/mascotas.jpg"
      items={items}
    />
  );
}
