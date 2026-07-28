import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { categories, site } from "@/lib/site";
import { Conditions } from "@/components/Conditions";

const categoryCovers = {
  cuadros: { src: "/covers/cuadros.webp", width: 896, height: 1152 },
  mascotas: { src: "/covers/mascotas.jpg", width: 533, height: 677 },
  murales: { src: "/covers/murales.jpg", width: 1900, height: 1365 },
  telas: { src: "/covers/telas.webp", width: 1440, height: 1080 },
  cositas: { src: "/covers/cositas.webp", width: 1080, height: 1920 },
};

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="section-title mt-5">{title}</h2>
      </div>
      {subtitle && (
        <p className="lead-copy lg:justify-self-end">
          {subtitle}
        </p>
      )}
    </header>
  );
}

function ProcessStep({
  step,
  title,
  description,
  footnote,
}: {
  step: number;
  title: string;
  description: string;
  footnote: string;
}) {
  return (
    <article className="group relative p-6 sm:p-8 lg:px-7">
      <div className="absolute inset-0 rounded-[1.25rem] border border-white/[0.08] bg-white/[0.018] transition-colors duration-200 group-hover:border-red-400/25 group-hover:bg-red-500/[0.035]" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <span className="font-[family-name:var(--font-display)] text-5xl font-semibold italic leading-none tracking-[-0.035em] text-white/[0.12] transition-colors group-hover:text-red-400/30">
            0{step}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-red-500/40 to-transparent" />
        </div>
        <h3 className="mt-8 text-2xl font-bold text-white sm:text-3xl">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-white/[0.62] sm:text-base">
          {description}
        </p>
        <p className="mt-6 font-[family-name:var(--font-display)] text-sm italic leading-5 text-white/[0.42]">
          {footnote}
        </p>
      </div>
    </article>
  );
}

function HeroArtwork() {
  return (
    <div className="relative mx-auto w-full max-w-[620px] lg:max-w-none">
      <div className="absolute left-[5%] top-[9%] h-[68%] w-[72%] rounded-full bg-red-600/[0.07] blur-[100px]" />

      <div className="relative aspect-square">
        <figure className="group absolute left-[3%] top-[1%] z-10 w-[74%]">
          <Image
            src="/galeria/murales/mural-05.jpg"
            alt="Obra realizada por Deton Arte"
            width={3120}
            height={3898}
            priority
            className="h-auto w-full drop-shadow-[0_28px_38px_rgba(0,0,0,0.42)]"
            sizes="(max-width: 1024px) 74vw, 500px"
          />
        </figure>

        <figure className="group absolute bottom-[5%] right-[1%] z-20 w-[36%]">
          <Image
            src="/galeria/mascotas/mascota-05.webp"
            alt="Retrato de mascota realizado por Deton Arte"
            width={1440}
            height={1800}
            className="h-auto w-full drop-shadow-[0_24px_34px_rgba(0,0,0,0.56)]"
            sizes="(max-width: 1024px) 36vw, 250px"
          />
        </figure>

        <div className="absolute bottom-[1%] left-[3%] z-30 flex items-center gap-3">
          <span className="h-px w-7 bg-gradient-to-r from-red-500 to-amber-200/70 sm:w-10" />
          <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.16em] text-red-300/75 sm:text-[11px]">
            @{site.handle}
          </span>
        </div>

        <div
          aria-hidden="true"
          className="absolute right-[1%] top-[9%] font-[family-name:var(--font-display)] text-[5.5rem] font-semibold italic leading-none tracking-[-0.045em] text-white/[0.045] sm:text-[8rem]"
        >
          73
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_76%_44%,rgba(128,24,34,0.14),transparent_34rem),linear-gradient(105deg,#040405_5%,#060607_54%,#080708_100%)]" />
        <div className="grain-overlay absolute inset-0 -z-10 opacity-45" />

        <Container className="max-w-[1440px]">
          <div className="grid items-center gap-8 py-10 sm:gap-10 sm:py-16 lg:min-h-[calc(100dvh-80px)] lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:py-[4.5rem] xl:gap-16">
            <div className="relative z-10 max-w-2xl">
              <div className="eyebrow">@{site.handle}</div>

              <h1 className="mt-6 max-w-[12ch] text-balance font-[family-name:var(--font-display)] text-[clamp(2.85rem,6.7vw,5.9rem)] font-semibold leading-[0.91] tracking-[-0.038em] text-white [text-shadow:0_16px_46px_rgba(0,0,0,.45)]">
                “Que en tu risa <br /> viva el{" "}
                <span className="brush-mark not-italic">arte</span>” 🎨
              </h1>

              <ul className="mt-8 flex flex-wrap gap-2.5 text-xs font-bold text-white/[0.72] sm:text-sm">
                <li className="surface-panel flex min-h-10 items-center gap-2.5 px-3.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  <span>Muralista y arte público</span>
                </li>
                <li className="surface-panel flex min-h-10 items-center gap-2.5 px-3.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-200" />
                  <span>Cuadros y murales únicos.</span>
                </li>
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="primary-action w-full sm:w-auto"
                >
                  Contame tu idea
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-action w-full sm:w-auto"
                >
                  WhatsApp
                </a>
              </div>

              <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.09] sm:grid-cols-3">
                {[
                  { label: "Horarios", value: site.hours },
                  { label: "Seña", value: site.deposit },
                  { label: "Cuotas", value: site.installments },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-[#0a0a0c] px-4 py-4"
                  >
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-red-300/70">
                      {item.label}
                    </dt>
                    <dd className="mt-1.5 text-xs leading-5 text-white/[0.58]">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <HeroArtwork />
          </div>
        </Container>
      </section>

      <section className="relative py-14 sm:py-20 lg:py-24">
        <Container>
          <SectionHeader eyebrow="Obras" title="Categorías" />

          <div className="mt-8 grid grid-cols-6 items-start gap-x-2 gap-y-7 sm:mt-10 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-5">
            {categories.map((category, index) => (
              <Link
                key={category.key}
                href={category.href}
                className={[
                  "group col-span-2 block min-w-0 lg:col-span-1",
                  index === 3 ? "col-start-2 lg:col-start-auto" : "",
                ].join(" ")}
              >
                <figure>
                  <div className="flex h-[112px] items-center justify-center overflow-hidden sm:h-[190px] lg:h-[180px] xl:h-[220px]">
                    <Image
                      src={categoryCovers[category.key].src}
                      alt=""
                      width={categoryCovers[category.key].width}
                      height={categoryCovers[category.key].height}
                      className="h-auto max-h-full w-auto max-w-full transition-[filter] duration-200 group-hover:brightness-[1.06]"
                      sizes="(max-width: 1023px) 30vw, 20vw"
                    />
                  </div>

                  <figcaption className="mt-3">
                    <div className="flex items-start justify-between gap-2 border-t border-white/[0.1] pt-3">
                      <h3 className="text-[clamp(1rem,2.2vw,1.65rem)] font-bold leading-[1.05] text-white">
                        {category.title}
                      </h3>
                      <span
                        className="shrink-0 font-[family-name:var(--font-display)] text-2xl font-semibold italic leading-none tracking-[-0.04em] text-white/[0.16]"
                        aria-hidden="true"
                      >
                        0{index + 1}
                      </span>
                    </div>
                    <p className="mt-2 hidden text-xs leading-5 text-white/[0.58] sm:block">
                      {category.subtitle}
                    </p>
                    <span className="mt-2 hidden items-center gap-2 font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.15em] text-red-300 lg:inline-flex">
                      <span>{category.cta}</span>
                      <span aria-hidden="true">
                        →
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden border-y border-white/[0.07] bg-black/25 py-16 sm:py-24 lg:py-28">
        <div className="grain-overlay absolute inset-0 opacity-25" />

        <Container>
          <SectionHeader
            eyebrow="Proceso"
            title="El Camino"
            subtitle="Un proceso transparente paso a paso."
          />

          <div className="relative mt-12 grid gap-4 lg:grid-cols-3">
            <div className="absolute left-[16.66%] right-[16.66%] top-0 hidden h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent lg:block" />
            <ProcessStep
              step={1}
              title="Contacto 💬"
              description="Hablamos sobre lo que buscás."
              footnote="Asesoría sin cargo."
            />
            <ProcessStep
              step={2}
              title="Cotización 💎"
              description="Definimos materiales y presupuesto."
              footnote="Precios claros."
            />
            <ProcessStep
              step={3}
              title="Producción 🔥"
              description="Manos a la obra. Te envío avances."
              footnote="Entrega en tiempo."
            />
          </div>
        </Container>
      </section>

      <Conditions />
    </>
  );
}
