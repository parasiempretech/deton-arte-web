import Image from "next/image";
import { SectionHero } from "@/components/SectionHero";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export default function ContactoPage() {
  return (
    <>
      <SectionHero
        title="Contacto"
        subtitle="Gracias por estar acá. Si querés cotizar, escribime con confianza y contame tu idea: te leo y te respondo apenas pueda."
        coverSrc="/covers/contacto.jpg"
      />

      {/* CONTENIDO PRINCIPAL */}
      <section className="py-14">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-2">
            {/* IZQUIERDA: TEXTO + CTA + GUIA */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Cupos limitados por semana
              </div>

              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                Hagamos tu idea realidad
              </h2>

              <p className="mt-5 text-white/75 leading-relaxed">
                Hola ✨ Gracias de corazón por interesarte en mi trabajo. Cada
                encargo lo hago con mucha dedicación y detalle, buscando que te
                enamores del resultado. Si me contás lo que tenés en mente, te
                voy guiando para armar una propuesta clara y a medida.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative inline-flex items-center justify-center rounded-full border border-red-500/45 bg-red-600/15 px-7 py-3 text-sm font-semibold text-white transition hover:bg-red-600/25 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_18px_rgba(220,38,38,0.22)]"
                  aria-label="Contactar por Instagram"
                >
                  <span className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="absolute inset-0 rounded-full [background:radial-gradient(60%_120%_at_50%_0%,rgba(220,38,38,0.30),transparent_60%)]" />
                  </span>
                  <span className="relative">Hablemos por Instagram</span>
                </a>

                <div className="text-xs text-white/60">
                  Respondo en el día cuando estoy en el taller.
                </div>
              </div>

              <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-bold">
                    Para cotizar más rápido
                  </div>
                  <span className="text-[11px] text-white/55">
                    (con esos datos te oriento mejor)
                  </span>
                </div>

                <ul className="mt-4 grid gap-2 text-sm text-white/75">
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    Qué querés (cuadro / mascota / mural / tela / cositas)
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    Medidas aproximadas
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    Foto o referencia (si tenés)
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    Ciudad / barrio (para murales)
                  </li>
                </ul>

                <div className="mt-6 rounded-2xl border border-red-500/15 bg-red-500/5 p-4">
                  <p className="text-xs leading-relaxed text-white/65">
                    Gracias por tu tiempo 💛 De verdad. Cuando me mandás estos
                    detalles, puedo darte un presupuesto más claro y una mejor
                    estimación.
                  </p>
                </div>
              </div>

              <div className="mt-6 text-sm text-white/65 leading-relaxed">
                Si preferís, también podés mandarme tu idea en pocas palabras y
                lo vamos armando juntos. Me encanta acompañar el proceso desde
                el inicio.
              </div>
            </div>

            {/* DERECHA: FOTO + TARJETA */}
            <div className="lg:sticky lg:top-24">
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/35">
                {/* Halo rojo suave */}
                <div className="pointer-events-none absolute -inset-24 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100">
                  <div className="h-full w-full [background:radial-gradient(closest-side,rgba(220,38,38,0.22),transparent_70%)]" />
                </div>

                <div className="relative aspect-[4/5]">
                  <Image
                    src="/contacto/perfil.jpg"
                    alt="Deton AR73"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 520px"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Sheen */}
                  <div className="pointer-events-none absolute -inset-10 translate-x-[-140%] rotate-12 opacity-0 transition-all duration-700 group-hover:translate-x-[140%] group-hover:opacity-100">
                    <div className="h-full w-24 bg-white/10 blur-xl" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-sm font-semibold text-white">
                    Deton AR73 — Arte & Diseño
                  </div>
                  <div className="mt-2 text-sm text-white/70">
                    <span className="text-white font-medium">
                      Encargos personalizados
                    </span>{" "}
                    • Hecho a mano • A medida
                  </div>

                  <div className="mt-5 grid gap-3">
                    <a
                      href={site.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 hover:border-red-500/25"
                    >
                      Ver y escribir por Instagram →
                    </a>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-[11px] text-white/60">Instagram</div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        @{site.handle}
                      </div>
                      <div className="mt-2 text-xs text-white/55">
                        Gracias por apoyar el arte hecho con amor en Argentina
                        💛
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-xs text-white/55 leading-relaxed">
                    Tu mensaje siempre es bienvenido. Gracias por confiar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
