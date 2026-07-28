import Image from "next/image";
import { Container } from "./Container";
import { Badge } from "./Badge";
import { site } from "@/lib/site";

type Props = {
  title: string;
  subtitle: string;
  coverSrc: string;
  badge?: string;
  variant?: "cover" | "portrait";
};

function HeroCopy({
  title,
  subtitle,
  badge,
  compact = false,
}: Pick<Props, "title" | "subtitle" | "badge"> & { compact?: boolean }) {
  return (
    <div className="min-w-0 max-w-3xl">
      <Badge>{badge ?? `@${site.handle}`}</Badge>

      <h1
        className={[
          "display-title mt-6 max-w-[13ch] [text-shadow:0_18px_50px_rgba(0,0,0,.58)]",
          compact ? "lg:text-[5.4rem]" : "",
        ].join(" ")}
      >
        {title}
      </h1>

      <p className="lead-copy mt-6">
        {subtitle}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="primary-action w-full sm:w-auto"
        >
          Hablemos por Instagram
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

      <p className="mt-4 max-w-xl text-sm leading-6 text-white/[0.56]">
        Enviame una referencia y medidas aproximadas para orientarte mejor.
      </p>
    </div>
  );
}

function PortraitHero({
  title,
  subtitle,
  coverSrc,
  badge,
}: Omit<Props, "variant">) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.08] bg-[#070708]">
      <div className="absolute inset-0 -z-30">
        <Image
          src={coverSrc}
          alt=""
          fill
          className="scale-110 object-cover object-center opacity-[0.05] blur-2xl"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(100deg,#070708_6%,rgba(7,7,8,0.97)_56%,rgba(7,7,8,0.84)_100%)]" />
      <div className="grain-overlay absolute inset-0 -z-10 opacity-25" />

      <Container>
        <div className="grid items-center gap-8 py-10 sm:gap-10 sm:py-14 lg:min-h-[620px] lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:py-10">
          <HeroCopy
            title={title}
            subtitle={subtitle}
            badge={badge}
            compact
          />

          <div className="relative mx-auto w-full max-w-[500px] lg:justify-self-end">
            <figure className="group relative mx-auto w-[58%] max-w-[270px] sm:w-[68%] sm:max-w-[380px] lg:w-[86%] lg:max-w-none">
              <Image
                src={coverSrc}
                alt="Deton AR73"
                width={1153}
                height={1612}
                priority
                className="h-auto w-full drop-shadow-[0_26px_38px_rgba(0,0,0,0.46)]"
                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 62vw, 430px"
              />
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="h-px w-8 bg-gradient-to-r from-red-500 to-amber-200/70" />
                <span className="font-[family-name:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.16em] text-red-300/75">
                  @{site.handle}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function SectionHero({
  title,
  subtitle,
  coverSrc,
  badge,
  variant = "cover",
}: Props) {
  if (variant === "portrait") {
    return (
      <PortraitHero
        title={title}
        subtitle={subtitle}
        coverSrc={coverSrc}
        badge={badge}
      />
    );
  }

  return (
    <section className="relative isolate min-h-[490px] overflow-hidden border-b border-white/[0.08] sm:min-h-[560px]">
      <div className="absolute inset-0 -z-30">
        <Image
          src={coverSrc}
          alt=""
          fill
          className="scale-[1.02] object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(4,4,5,0.99)_0%,rgba(4,4,5,0.93)_38%,rgba(4,4,5,0.46)_72%,rgba(4,4,5,0.35)_100%)] max-sm:bg-[linear-gradient(180deg,rgba(4,4,5,0.38)_0%,rgba(4,4,5,0.74)_38%,rgba(4,4,5,0.98)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#070708] via-transparent to-black/30" />
      <div className="grain-overlay absolute inset-0 -z-10 opacity-30" />

      <div
        className="absolute bottom-0 left-0 top-0 hidden w-px bg-gradient-to-b from-transparent via-red-500/40 to-transparent lg:block"
        style={{ left: "max(2rem, calc((100vw - 80rem) / 2))" }}
      />

      <Container>
        <div className="flex min-h-[490px] items-end py-10 sm:min-h-[560px] sm:py-14 lg:items-center lg:py-[4.5rem]">
          <HeroCopy title={title} subtitle={subtitle} badge={badge} />
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="absolute bottom-7 right-7 hidden items-center gap-3 lg:flex"
      >
        <span className="h-px w-10 bg-white/25" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
          {site.brand}
        </span>
      </div>
    </section>
  );
}
