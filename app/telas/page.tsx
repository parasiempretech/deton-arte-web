import { SectionHero } from "@/components/SectionHero";
import { Gallery } from "@/components/Gallery";
import { Conditions } from "@/components/Conditions";
import { CtaBand } from "@/components/CtaBand";
import { galleries } from "@/lib/gallery";

export default function Page() {
  return (
    <>
      <SectionHero title="Telas / Banderas" subtitle="Diseños sobre tela por encargo (banderas y piezas personalizadas). Cotización a medida." coverSrc="/covers/telas.jpg" />
      <Gallery title="Galería" items={galleries.telas} />
      <CtaBand />
      <Conditions />
    </>
  );
}
