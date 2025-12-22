"use client";

import Image from "next/image";
import { Container } from "@/components/Container";
import { Badge } from "@/components/Badge";
import { categories, site } from "@/lib/site";
import { Conditions } from "@/components/Conditions";

/* =========================
   UI helpers (Senior refinements)
========================= */
function SoftBackground() {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-[#020617]" />
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Ambient Glows with smoother interpolation */}
        <div className="absolute -top-[10%] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-red-600/[0.14] blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute top-[20%] -left-24 h-[500px] w-[500px] rounded-full bg-red-500/[0.09] blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-slate-400/[0.05] blur-[120px]" />
      </div>
    </>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-10 sm:mb-14 group">
      <h2 className="text-3xl sm:text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-white/90 to-red-500/80 bg-clip-text text-transparent drop-shadow-sm">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-3xl text-base sm:text-lg text-white/40 leading-relaxed border-l-2 border-red-600/30 pl-6 transition-all duration-500 group-hover:border-red-500 group-hover:text-white/60">
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
    <article className="group relative rounded-[2.2rem] border border-white/5 bg-white/[0.02] p-7 sm:p-9 transition-all duration-700 hover:bg-white/[0.04] hover:border-red-500/30 hover:-translate-y-2 overflow-hidden shadow-2xl">
      {/* Subtle hover light effect */}
      <div className="absolute -inset-px bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-800 text-white font-black shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
        {step}
      </div>
      <h3 className="relative text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
        {title}
      </h3>
      <p className="relative text-sm sm:text-base text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
        {description}
      </p>
      <div className="relative mt-6 pt-5 border-t border-white/5 text-xs text-white/40 italic flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-red-600/60 animate-ping" />
        {footnote}
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen selection:bg-red-600/40 selection:text-white">
      <SoftBackground />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <Image
            src="/covers/home.jpg"
            alt="Portada Deton AR73"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-[0.15] scale-105 animate-[subtle-zoom_20s_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/80 to-[#020617]" />
        </div>

        <Container>
          <div className="relative pt-12 pb-16 sm:pt-20 sm:pb-24">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* LEFT */}
              <div className="flex flex-col gap-10">
                <div className="max-w-2xl">
                  {/* ✅ TÍTULO Refined with elegant shadow */}
                  <h1 className="text-[clamp(2rem,5.5vw,3.4rem)] sm:text-[clamp(2.2rem,5vw,3.6rem)] text-white font-serif italic leading-[1.15] tracking-tight drop-shadow-2xl">
                    “Que en tu risa <br /> viva el{" "}
                    <span className="text-red-500 not-italic font-black bg-gradient-to-b from-red-400 to-red-600 bg-clip-text text-transparent">
                      arte
                    </span>
                    ” 🎨
                  </h1>

                  <ul className="mt-8 space-y-5 text-sm sm:text-base text-white/50">
                    <li className="flex items-center gap-4 group/li">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] transition-all duration-300 group-hover/li:bg-red-500/20 group-hover/li:scale-125 group-hover/li:shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                        ★
                      </span>
                      <span className="group-hover/li:text-white/80 transition-colors duration-300">
                        Muralista & Arte Público
                      </span>
                    </li>
                    <li className="flex items-start gap-4 group/li">
                      <span className="flex h-6 w-6 mt-1 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] transition-all duration-300 group-hover/li:bg-red-500/20 group-hover/li:scale-125 group-hover/li:shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                        ★
                      </span>
                      <span className="group-hover/li:text-white/80 transition-colors duration-300">
                        Cuadros y murales únicos.
                      </span>
                    </li>
                  </ul>

                  <p className="mt-8 text-base sm:text-lg text-white/40 leading-relaxed max-w-lg font-medium transition-colors hover:text-white/60 duration-700">
                    Hago obras personalizadas, pensadas para vos y para tu
                    espacio. Me escribís, me contás tu idea y te acompaño para
                    que el resultado sea exacto a lo que imaginás.
                  </p>
                </div>

                <div className="flex flex-col gap-8">
                  <a
                    href={site.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative overflow-hidden inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-10 py-4 text-base font-bold text-white text-center transition-all duration-500 backdrop-blur-md hover:border-red-500/40 hover:bg-red-500/[0.05] hover:shadow-[0_0_40px_rgba(239,68,68,0.1)] active:scale-[0.98]"
                  >
                    {/* Shimmer effect inside button */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform" />
                    <span className="relative z-10">Contame tu idea</span>
                  </a>

                  <div className="flex flex-col gap-6">
                    {[
                      { label: "Horarios", value: site.hours, icon: "🕒" },
                      { label: "Seña", value: site.deposit, icon: "💳" },
                      { label: "Cuotas", value: site.installments, icon: "🔥" },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="group/item flex flex-col border-l border-white/5 pl-4 hover:border-red-500/40 transition-all duration-500"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-red-500/80 text-sm group-hover/item:scale-125 transition-transform duration-300">
                            {item.icon}
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-white/90 group-hover/item:text-white transition-colors">
                            {item.label}
                          </h3>
                        </div>
                        <p className="mt-1 text-sm sm:text-base text-white/40 group-hover/item:text-white/60 transition-colors duration-500">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT (Spacer for balanced layout) */}
              <div className="hidden lg:block lg:max-w-md lg:ml-auto" />
            </div>
          </div>
        </Container>
      </section>

      {/* ================= SERVICIOS ================= */}
      <section className="py-20 sm:py-32">
        <Container>
          <SectionHeader
            title="Categorías"
            subtitle="Explorá mis trabajos o pedime algo nuevo."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <a
                key={c.key}
                href={c.href}
                className="group relative rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-700 hover:border-red-500/40 hover:bg-red-950/[0.05] hover:shadow-[0_20px_60px_-20px_rgba(220,38,38,0.15)] overflow-hidden"
              >
                <div className="absolute top-0 right-0 h-32 w-32 bg-red-600/[0.02] blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-red-600/[0.08] transition-all duration-700" />
                <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-500">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm text-white/40 leading-relaxed group-hover:text-white/70 transition-colors duration-500">
                  {c.subtitle}
                </p>
                <div className="mt-8 flex items-center text-red-500/80 font-black text-[10px] uppercase tracking-[0.2em] group-hover:text-red-500 transition-colors">
                  <span className="mr-3 transition-all duration-500 group-hover:mr-5">
                    {c.cta}
                  </span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-500">
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= PROCESO ================= */}
      <section className="relative border-y border-white/5 bg-[#030816]/50 py-24 sm:py-32 overflow-hidden">
        <Container>
          <SectionHeader
            title="El Camino"
            subtitle="Un proceso transparente paso a paso."
          />
          <div className="grid gap-8 lg:grid-cols-3">
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

      <div className="py-24 sm:py-32 bg-gradient-to-b from-[#020617] via-[#020617] to-black/90">
        <Conditions />
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes subtle-zoom {
          from {
            transform: scale(1.05);
          }
          to {
            transform: scale(1.12);
          }
        }
      `}</style>
    </div>
  );
}
