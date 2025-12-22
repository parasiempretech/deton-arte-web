import Image from "next/image";
import type { GalleryItem } from "@/lib/gallery";
import { Container } from "./Container";

export function Gallery({
  title,
  items,
}: {
  title: string;
  items: GalleryItem[];
}) {
  return (
    <section className="py-10">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30 transition-all duration-300 [transform-style:preserve-3d] hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/10 hover:shadow-black/40"
            >
              {/* Glow / halo suave */}
              <div className="pointer-events-none absolute -inset-24 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100">
                <div className="h-full w-full [background:radial-gradient(closest-side,rgba(239,68,68,0.22),transparent_70%)]" />
              </div>

              {/* Imagen */}
              <div className="relative aspect-[4/5]">
                <Image
                  src={it.src}
                  alt={it.title}
                  fill
                  className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.06] group-hover:[transform:translateZ(12px)]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Gradiente para contraste y look pro */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

                {/* Brillo tipo “sheen” al hover */}
                <div className="pointer-events-none absolute -inset-10 translate-x-[-140%] rotate-12 opacity-0 transition-all duration-700 group-hover:translate-x-[140%] group-hover:opacity-100">
                  <div className="h-full w-24 bg-white/10 blur-xl" />
                </div>
              </div>

              {/* Sin títulos visibles (solo imagen). Mantengo un border inferior sutil para “finish” */}
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
