import Link from "next/link";
import { Badge } from "@/components/Badge";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="flex min-h-[calc(100dvh-72px)] items-center py-16 sm:min-h-[620px] sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge>@{site.handle}</Badge>
          <div
            className="mt-8 font-[family-name:var(--font-display)] text-7xl font-semibold italic leading-none text-red-400/25 sm:text-9xl"
            aria-hidden="true"
          >
            404
          </div>
          <h1 className="section-title mt-3">Página no encontrada</h1>
          <p className="lead-copy mx-auto mt-5">
            La dirección que abriste no existe o ya no está disponible.
          </p>
          <Link href="/" className="primary-action mt-8">
            Volver al inicio
          </Link>
        </div>
      </Container>
    </section>
  );
}
