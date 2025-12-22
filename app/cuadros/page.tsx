import { SectionHero } from "@/components/SectionHero";
import { Gallery } from "@/components/Gallery";
import { Conditions } from "@/components/Conditions";
import { CtaBand } from "@/components/CtaBand";
import { galleries } from "@/lib/gallery";

export default function Page() {
  return (
    <>
      <SectionHero
        title="Cuadros"
        subtitle="Cuadros personalizados. Cada obra se ajusta según tamaño, técnica y nivel de detalle."
        coverSrc="/covers/cuadros.jpg"
      />

      <Gallery title="Galería" items={galleries.cuadros} />

      <CtaBand />

      <Conditions />
    </>
  );
}
