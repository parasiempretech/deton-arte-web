import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import {
  getAdminSession,
  isAdminConfigured,
} from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function PanelLoginPage() {
  if (await getAdminSession()) redirect("/panel");

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#070708] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(240,47,60,0.13),transparent_30rem)]" />
      <div className="grain-overlay absolute inset-0 opacity-35" />

      <main className="surface-card relative w-full max-w-md p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Image
            src="/logodeton.png"
            alt=""
            width={52}
            height={52}
            className="h-[52px] w-[52px] object-cover object-top"
          />
          <div>
            <div className="font-[family-name:var(--font-display)] text-xl font-semibold leading-none">
              Deton Arte
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-red-300/70">
              Acceso privado
            </div>
          </div>
        </div>

        <h1 className="mt-8 font-[family-name:var(--font-display)] text-4xl font-semibold leading-none tracking-[-0.03em] sm:text-5xl">
          Panel de obras
        </h1>
        <p className="mt-4 text-sm leading-6 text-white/55">
          Ingresá para publicar y administrar las imágenes de las galerías.
        </p>

        <LoginForm configured={isAdminConfigured()} />

        <Link
          href="/"
          className="mt-6 block text-center text-xs font-semibold text-white/40 transition hover:text-white/75"
        >
          Volver al sitio
        </Link>
      </main>
    </div>
  );
}
