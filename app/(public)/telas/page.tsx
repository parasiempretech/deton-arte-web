import { CategoryPage } from "@/components/CategoryPage";
import { getGallery } from "@/lib/gallery";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "Diseños sobre tela por encargo (banderas y piezas personalizadas). Cotización a medida.";

export const metadata = createPageMetadata({
  title: "Telas / Banderas",
  description,
  path: "/telas",
});

export default async function Page() {
  const items = await getGallery("telas");

  return (
    <CategoryPage
      title="Telas / Banderas"
      subtitle={description}
      coverSrc="/covers/telas.webp"
      items={items}
    />
  );
}
