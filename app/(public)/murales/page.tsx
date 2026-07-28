import { CategoryPage } from "@/components/CategoryPage";
import { getGallery } from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "Cada mural se cotiza a medida según superficie, medidas y complejidad.";

export const metadata = createPageMetadata({
  title: "Murales",
  description,
  path: "/murales",
});

export default async function Page() {
  const items = await getGallery("murales");

  return (
    <CategoryPage
      title="Murales"
      subtitle={description}
      coverSrc="/covers/murales.jpg"
      items={items}
    />
  );
}
