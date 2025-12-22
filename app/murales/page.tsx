import { SectionHero } from "@/components/SectionHero";
import { Gallery } from "@/components/Gallery";
import { Conditions } from "@/components/Conditions";
import { CtaBand } from "@/components/CtaBand";
import { galleries } from "@/lib/gallery";

export default function Page() {
  return (
    <>
      <SectionHero title="Murales" subtitle="Cada mural se cotiza a medida según superficie, medidas y complejidad." coverSrc="/covers/murales.jpg" />
      <Gallery title="Galería" items={galleries.murales} />
      <CtaBand />
      <Conditions />
    </>
  );
}
