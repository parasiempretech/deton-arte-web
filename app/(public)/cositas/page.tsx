import { CategoryPage } from "@/components/CategoryPage";
import { getGallery } from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "Piezas varias e intervenidas. Algunas pueden tener precio, otras se cotizan según la idea.";

export const metadata = createPageMetadata({
  title: "Cositas",
  description,
  path: "/cositas",
});

export default async function Page() {
  const items = await getGallery("cositas");

  return (
    <CategoryPage
      title="Cositas"
      subtitle={description}
      coverSrc="/covers/cositas.png"
      items={items}
    />
  );
}
