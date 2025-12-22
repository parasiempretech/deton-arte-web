import { SectionHero } from "@/components/SectionHero";
import { Gallery } from "@/components/Gallery";
import { Conditions } from "@/components/Conditions";
import { CtaBand } from "@/components/CtaBand";
import { galleries } from "@/lib/gallery";

export default function Page() {
  return (
    <>
      <SectionHero title="Cositas" subtitle="Piezas varias e intervenidas. Algunas pueden tener precio, otras se cotizan según la idea." coverSrc="/covers/cositas.jpg" />
      <Gallery title="Galería" items={galleries.cositas} />
      <CtaBand />
      <Conditions />
    </>
  );
}
