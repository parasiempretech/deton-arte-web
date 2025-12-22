"use client";

import { site } from "@/lib/site";
import { Container } from "./Container";

export function Conditions() {
  return (
    <section className="py-16 sm:py-24 border-t border-white/[0.05] relative overflow-hidden">
      {/* Luz de fondo sutil para dar profundidad */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

      <Container>
        <div className="relative group rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:border-white/20">
          {/* Decoración de esquina */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-red-600/10 blur-[60px] rounded-full pointer-events-none" />

          <div className="flex flex-col gap-4 relative z-10">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                Condiciones del encargo
              </h2>
              <p className="max-w-2xl text-base text-white/50 leading-relaxed">
                Acá te explico de forma simple cómo trabajo y qué tener en
                cuenta antes de encargar una obra. La idea es que todo esté
                claro desde el comienzo.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2 relative z-10">
            {[
              {
                title: "📩 Respuesta",
                content: (
                  <>
                    Te respondo por Instagram dentro del horario{" "}
                    <span className="text-white font-bold">{site.hours}</span>.
                  </>
                ),
                sub: "Si podés contarme tu idea con algo de detalle, mejor.",
              },
              {
                title: "🧾 Cotización",
                content:
                  "El precio se define según el tamaño de la obra y el nivel de detalle.",
                sub: "Una vez visto eso, te paso el valor correspondiente.",
              },
              {
                title: "✅ Reserva",
                content: (
                  <>
                    Para reservar fecha o turno se solicita una seña de{" "}
                    <span className="text-white font-bold">{site.deposit}</span>
                    .
                  </>
                ),
                sub: "De esa forma puedo organizar el trabajo con tiempo.",
              },
              {
                title: "💳 Cuotas",
                content: (
                  <>
                    Si lo necesitás, se puede pagar en{" "}
                    <span className="text-white font-bold">
                      {site.installments}
                    </span>
                    .
                  </>
                ),
                sub: "Esto se acuerda antes de comenzar.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group/card rounded-[1.5rem] border border-white/5 bg-white/[0.03] p-6 transition-all duration-500 hover:bg-white/[0.07] hover:border-white/10 hover:-translate-y-1"
              >
                <div className="text-sm font-black uppercase tracking-wider text-red-500/80 group-hover/card:text-red-400 transition-colors">
                  {item.title}
                </div>
                <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed">
                  {item.content}
                </p>
                <p className="mt-3 text-xs text-white/40 italic leading-snug border-l border-white/10 pl-4 group-hover/card:border-red-500/30 transition-all">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>

          {/* CTA SECCIÓN */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between relative z-10">
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group/btn relative inline-flex items-center justify-center rounded-2xl bg-red-600 px-8 py-4 text-sm font-black text-white transition-all duration-300 hover:bg-red-500 hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_-10px_rgba(220,38,38,0.5)]"
            >
              Pedir cotización por Instagram
            </a>

            <div className="flex items-center gap-3">
              <div className="w-10 h-[1px] bg-white/10" />
              <div className="text-xs sm:text-sm text-white/40 font-medium">
                Me escribís y vemos juntos cómo seguir.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
