import Image from "next/image";
import { SectionHero } from "@/components/SectionHero";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "Gracias por estar acá. Si querés cotizar, escribime con confianza y contame tu idea: te leo y te respondo apenas pueda.";

export const metadata = createPageMetadata({
  title: "Contacto",
  description,
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <>
      <SectionHero
        title="Contacto"
        subtitle={description}
        coverSrc="/covers/contacto.jpg"
        variant="portrait"
      />

      <section className="relative overflow-hidden pb-20 pt-16 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-20">
        <div className="absolute -left-44 top-24 h-96 w-96 rounded-full bg-red-800/[0.06] blur-[130px]" />

        <Container>
          <header className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <div className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Cupos limitados por semana
              </div>
              <h2 className="section-title mt-5">Hagamos tu idea realidad</h2>
            </div>

            <p className="lead-copy lg:justify-self-end">
              Hola ✨ Gracias de corazón por interesarte en mi trabajo. Cada
              encargo lo hago con mucha dedicación y detalle, buscando que te
              enamores del resultado. Si me contás lo que tenés en mente, te voy
              guiando para armar una propuesta clara y a medida.
            </p>
          </header>

          <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-12">
            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group surface-panel relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-1 hover:border-red-300/30 hover:bg-red-500/[0.045] sm:p-6"
                >
                  <span
                    className="absolute right-4 top-2 font-[family-name:var(--font-display)] text-6xl font-semibold italic tracking-[-0.04em] text-white/[0.035]"
                    aria-hidden="true"
                  >
                    WA
                  </span>
                  <span className="font-[family-name:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.14em] text-red-300">
                    WhatsApp
                  </span>
                  <span className="mt-6 block text-lg font-bold text-white">
                    {site.phone}
                  </span>
                  <span
                    className="mt-4 inline-flex text-sm text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-red-300"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>

                <a
                  href={site.emailUrl}
                  className="group surface-panel relative min-w-0 overflow-hidden p-5 transition-all duration-200 hover:-translate-y-1 hover:border-red-300/30 hover:bg-red-500/[0.045] sm:p-6"
                >
                  <span
                    className="absolute right-4 top-2 font-[family-name:var(--font-display)] text-6xl font-semibold italic tracking-[-0.04em] text-white/[0.035]"
                    aria-hidden="true"
                  >
                    @
                  </span>
                  <span className="font-[family-name:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.14em] text-red-300">
                    Email
                  </span>
                  <span className="mt-6 block text-base font-semibold text-white [overflow-wrap:anywhere] sm:text-lg">
                    {site.email}
                  </span>
                  <span
                    className="mt-4 inline-flex text-sm text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-red-300"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>

                <div className="surface-panel relative overflow-hidden p-5 sm:col-span-2 sm:p-6">
                  <span
                    className="absolute right-4 top-2 font-[family-name:var(--font-display)] text-6xl font-semibold italic tracking-[-0.04em] text-white/[0.035]"
                    aria-hidden="true"
                  >
                    10—19
                  </span>
                  <span className="font-[family-name:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.14em] text-red-300">
                    Horario
                  </span>
                  <span className="mt-5 block text-lg font-bold text-white">
                    {site.hours}
                  </span>
                </div>
              </div>

              <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="primary-action w-full sm:w-auto"
                  aria-label="Contactar por Instagram"
                >
                  Hablemos por Instagram
                  <span aria-hidden="true">↗</span>
                </a>

                <div className="text-xs leading-5 text-white/50">
                  Respondo en el día cuando estoy en el taller.
                </div>
              </div>

              <div className="surface-card relative mt-10 overflow-hidden p-6 sm:p-8 lg:p-9">
                <div className="grain-overlay absolute inset-0 opacity-25" />
                <div className="relative">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                      Para cotizar más rápido
                    </h3>
                    <span className="text-xs text-white/[0.45]">
                      (con esos datos te oriento mejor)
                    </span>
                  </div>

                  <ol className="mt-7 grid gap-3 text-sm leading-6 text-white/[0.68] sm:grid-cols-2 sm:text-base">
                    {[
                      "Qué querés (cuadro / mascota / mural / tela / cositas)",
                      "Medidas aproximadas",
                      "Foto o referencia (si tenés)",
                      "Ciudad / barrio (para murales)",
                    ].map((item, index) => (
                      <li
                        key={item}
                        className="surface-panel flex min-h-20 items-center gap-4 p-4"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-400/20 bg-red-500/[0.08] font-[family-name:var(--font-display)] text-base font-semibold italic tracking-[-0.025em] text-red-300">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6 rounded-2xl border border-amber-200/[0.14] bg-amber-100/[0.035] p-5">
                    <p className="text-xs leading-6 text-white/[0.58]">
                      Gracias por tu tiempo 💛 De verdad. Cuando me mandás estos
                      detalles, puedo darte un presupuesto más claro y una mejor
                      estimación.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-white/[0.58]">
                Si preferís, también podés mandarme tu idea en pocas palabras y
                lo vamos armando juntos. Me encanta acompañar el proceso desde
                el inicio.
              </p>
            </div>

            <aside className="lg:sticky lg:top-28">
              <div className="group relative">
                <div className="absolute left-[12%] top-[8%] h-[60%] w-[76%] rounded-full bg-red-700/[0.1] blur-[75px]" />
                <figure className="relative">
                  <Image
                    src="/covers/contacto.jpg"
                    alt="Deton AR73"
                    width={1153}
                    height={1612}
                    className="h-auto w-full drop-shadow-[0_34px_44px_rgba(0,0,0,0.48)] transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:scale-[1.006]"
                    sizes="(max-width: 1024px) 100vw, 520px"
                  />
                  <figcaption className="mt-4 flex items-center gap-3">
                    <span className="h-px w-8 bg-gradient-to-r from-red-500 to-amber-200/70" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-300/80">
                      Instagram
                    </span>
                    <span className="text-sm font-semibold text-white/70">
                      @{site.handle}
                    </span>
                  </figcaption>
                </figure>

                <div className="relative mt-7 border-t border-white/[0.1] pt-7">
                  <h3 className="text-2xl font-bold text-white">
                    Deton AR73 — Arte & Diseño
                  </h3>
                  <div className="mt-3 text-sm leading-6 text-white/[0.62]">
                    <span className="font-semibold text-white">
                      Encargos personalizados
                    </span>{" "}
                    • Hecho a mano • A medida
                  </div>

                  <a
                    href={site.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="secondary-action mt-6 w-full"
                  >
                    Ver y escribir por Instagram →
                  </a>

                  <div className="mt-6 max-w-sm font-[family-name:var(--font-display)] text-base italic leading-6 text-white/[0.52]">
                    Gracias por apoyar el arte hecho con amor en Argentina 💛
                  </div>

                  <p className="mt-5 text-xs leading-5 text-white/[0.45]">
                    Tu mensaje siempre es bienvenido. Gracias por confiar.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
