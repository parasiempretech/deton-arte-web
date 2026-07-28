import type { GalleryItem } from "@/lib/gallery-types";
import { SectionHero } from "./SectionHero";
import { Gallery } from "./Gallery";
import { CtaBand } from "./CtaBand";
import { Conditions } from "./Conditions";

type CategoryPageProps = {
  title: string;
  subtitle: string;
  coverSrc: string;
  items: GalleryItem[];
};

export function CategoryPage({
  title,
  subtitle,
  coverSrc,
  items,
}: CategoryPageProps) {
  return (
    <>
      <SectionHero title={title} subtitle={subtitle} coverSrc={coverSrc} />
      <Gallery title="Galería" items={items} />
      <CtaBand />
      <Conditions />
    </>
  );
}
