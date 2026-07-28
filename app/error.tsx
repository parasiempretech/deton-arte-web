"use client";

import Link from "next/link";
import { Container } from "@/components/Container";
import {
  ErrorRecovery,
  reloadCurrentPage,
} from "@/components/ErrorRecovery";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error }: ErrorPageProps) {
  return (
    <section className="flex min-h-[calc(100dvh-72px)] items-center py-16 sm:min-h-[620px] sm:py-24">
      <ErrorRecovery error={error} />
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow">Error inesperado</div>
          <h1 className="section-title mt-5">No pudimos cargar esta página</h1>
          <p className="lead-copy mx-auto mt-5">
            Podés volver a intentarlo o regresar al inicio.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reloadCurrentPage}
              className="primary-action"
            >
              Volver a intentar
            </button>
            <Link href="/" className="secondary-action">
              Ir al inicio
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
