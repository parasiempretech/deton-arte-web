import { site } from "@/lib/site";
import { Container } from "./Container";

const conditions = [
  {
    title: "📩 Respuesta",
    content: (
      <>
        Te respondo por Instagram dentro del horario{" "}
        <span className="font-bold text-white">{site.hours}</span>.
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
        Para reservar fecha o turno se solicita:{" "}
        <span className="font-bold text-white">{site.deposit}</span>.
      </>
    ),
    sub: "De esa forma puedo organizar el trabajo con tiempo.",
  },
  {
    title: "💳 Cuotas",
    content: (
      <>
        Si lo necesitás, se puede pagar en{" "}
        <span className="font-bold text-white">{site.installments}</span>.
      </>
    ),
    sub: "Esto se acuerda antes de comenzar.",
  },
];

export function Conditions() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <div className="section-divider absolute inset-x-0 top-0" />
      <div className="absolute -right-48 top-16 h-96 w-96 rounded-full bg-red-700/[0.065] blur-[130px]" />

      <Container>
        <div className="surface-card relative isolate overflow-hidden p-6 sm:p-10 lg:p-14">
          <div className="grain-overlay absolute inset-0 -z-10 opacity-35" />
          <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-red-600/[0.1] blur-[90px]" />
          <div
            aria-hidden="true"
            className="absolute right-6 top-4 -z-10 font-[family-name:var(--font-display)] text-[8rem] font-semibold italic leading-none tracking-[-0.045em] text-white/[0.025] sm:right-10 sm:top-0 sm:text-[13rem]"
          >
            04
          </div>

          <header className="relative grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <div className="eyebrow">Antes de empezar</div>
              <h2 className="section-title mt-5">Condiciones del encargo</h2>
            </div>
            <p className="lead-copy lg:justify-self-end">
              Acá te explico de forma simple cómo trabajo y qué tener en cuenta
              antes de encargar una obra. La idea es que todo esté claro desde
              el comienzo.
            </p>
          </header>

          <div className="relative mt-10 grid overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.09] md:grid-cols-2">
            {conditions.map((item, index) => (
              <article
                key={item.title}
                className="group relative bg-[#0b0b0d]/90 p-5 transition-colors duration-200 hover:bg-white/[0.035] sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-red-300">
                    {item.title}
                  </h3>
                  <span
                    className="font-[family-name:var(--font-display)] text-3xl font-semibold italic leading-none tracking-[-0.035em] text-white/[0.09] transition-colors group-hover:text-red-400/20"
                    aria-hidden="true"
                  >
                    0{index + 1}
                  </span>
                </div>
                <p className="mt-5 max-w-md text-sm leading-6 text-white/[0.72] sm:text-base sm:leading-7">
                  {item.content}
                </p>
                <p className="mt-4 font-[family-name:var(--font-display)] text-[15px] italic leading-6 text-white/[0.48]">
                  {item.sub}
                </p>
              </article>
            ))}
          </div>

          <div className="relative mt-8 flex flex-col gap-5 border-t border-white/[0.09] pt-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="primary-action"
              >
                Pedir cotización por Instagram
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-action"
              >
                WhatsApp
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm font-medium text-white/[0.46]">
              <div className="h-px w-8 bg-gradient-to-r from-red-500/70 to-amber-200/40" />
              <div>Me escribís y vemos juntos cómo seguir.</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
