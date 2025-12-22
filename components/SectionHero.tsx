import Image from "next/image";
import { Container } from "./Container";
import { Badge } from "./Badge";
import { site } from "@/lib/site";

type Props = {
  title: string;
  subtitle: string;
  coverSrc: string;
  badge?: string;
};

export function SectionHero({ title, subtitle, coverSrc, badge }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      {/* Fondo */}
      <div className="absolute inset-0">
        <Image
          src={coverSrc}
          alt=""
          fill
          className="object-cover opacity-55"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/20 via-ink-950/75 to-ink-950" />
        <div className="absolute inset-0 [background:radial-gradient(80%_60%_at_50%_40%,rgba(0,0,0,0)_0%,rgba(0,0,0,.55)_70%,rgba(0,0,0,.8)_100%)]" />
      </div>

      <Container>
        <div className="relative pt-6 pb-10 sm:pt-16 sm:pb-16">
          {/* Encabezado */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{badge ?? `@${site.handle}`}</Badge>
            </div>

            <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-white/85 sm:text-lg">
              {subtitle}
            </p>

            {/* CTA único */}
            <div className="mt-3">
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-red-500/40 bg-red-600/10 backdrop-blur-sm px-7 py-3.5 text-base font-bold text-white transition shadow-md shadow-black/20
                           hover:bg-red-600/20 hover:border-red-500/60 active:bg-red-600/30 sm:w-auto
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
              >
                Hablemos por Instagram
              </a>

              <p className="mt-3 max-w-xl text-sm text-white/70">
                Enviame una referencia y medidas aproximadas para orientarte
                mejor.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
