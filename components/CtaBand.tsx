"use client";

import { Container } from "./Container";
import { site } from "@/lib/site";

export function CtaBand({
  title = "¿Seguimos?",
  text = "Si te gustó el estilo o tenés una idea en mente, escribime y lo vemos juntos.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="py-20 relative overflow-hidden group">
      {/* TRUCO DE PROGRAMADOR SENIOR:
          Efecto de "Radial Mesh" rojo en las esquinas que solo aparece
          suavemente al interactuar con la sección.
      */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-red-600/10 transition-colors duration-1000" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-600/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 group-hover:bg-red-600/10 transition-colors duration-1000" />

      <Container>
        <div className="relative rounded-[2.5rem] border border-white/5 bg-[#050505] p-8 sm:p-14 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Borde de luz roja superior (Subtle Highlight) */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">
                {title}
              </h2>

              <p className="mt-6 text-base sm:text-lg text-white/40 leading-relaxed font-medium">
                {text}
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-6">
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="group/btn relative inline-flex items-center justify-center rounded-2xl bg-white px-10 py-5 text-sm font-black text-black transition-all duration-300 hover:bg-red-600 hover:text-white hover:scale-[1.03] active:scale-[0.97] overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
              >
                {/* TRUCO UX:
                    El cambio de color de blanco a rojo en hover genera
                    un sentido de urgencia y pasión por el arte.
                */}
                <span className="relative z-10">Escribirme por Instagram</span>
              </a>

              {/* Detalle visual mínimo en rojo */}
              <div className="flex items-center gap-3 px-2">
                <div className="h-px w-8 bg-red-600/50" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-red-500/80">
                  Arte Personalizado
                </span>
              </div>
            </div>
          </div>

          {/* DETALLE UI SENIOR:
              Una máscara de ruido o textura sutil que se ve solo en monitores de alta gama
              para que el negro no se vea "plano".
          */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
        </div>
      </Container>
    </section>
  );
}
