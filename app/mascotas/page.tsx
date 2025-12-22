import { SectionHero } from "@/components/SectionHero";
import { Gallery } from "@/components/Gallery";
import { Conditions } from "@/components/Conditions";
import { CtaBand } from "@/components/CtaBand";
import { galleries } from "@/lib/gallery";

export default function Page() {
  return (
    <>
      <SectionHero
        title="Cuadros Mascotas"
        subtitle="Retratos hechos a mano. Ideal para regalar o inmortalizar a tu compañero."
        coverSrc="/covers/mascotas.jpg"
      />

      <Gallery title="Galería" items={galleries.mascotas} />

      <CtaBand />

      <Conditions />
    </>
  );
}
