import Image from "next/image";
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
    <section className="relative py-8 sm:py-12">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[1.5rem] border border-red-300/20 bg-[#111113] p-7 shadow-[0_24px_70px_-48px_rgba(0,0,0,0.95)] sm:p-10 lg:p-14">
          <div className="grain-overlay absolute inset-0 -z-10 opacity-25" />
          <div className="absolute -bottom-28 -right-8 -z-10 h-80 w-80 opacity-[0.09] sm:-right-2">
            <Image
              src="/logodeton.png"
              alt=""
              fill
              className="object-contain"
              sizes="320px"
            />
          </div>

          <div className="grid gap-9 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <div className="eyebrow">Arte personalizado</div>
              <h2 className="section-title mt-5">{title}</h2>
              <p className="lead-copy mt-5">
                {text}
              </p>
            </div>

            <div className="relative flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-center font-[family-name:var(--font-body)] text-[13px] font-semibold uppercase tracking-[0.075em] text-black transition-colors duration-200 hover:bg-red-500 hover:text-white"
              >
                Escribirme por Instagram
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
          </div>
        </div>
      </Container>
    </section>
  );
}
