"use client";

import Link from "next/link";
import {
  ErrorRecovery,
  reloadCurrentPage,
} from "@/components/ErrorRecovery";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error }: GlobalErrorProps) {
  return (
    <html lang="es">
      <body
        style={{
          alignItems: "center",
          background: "#070708",
          color: "#ffffff",
          display: "flex",
          fontFamily: "system-ui, sans-serif",
          justifyContent: "center",
          margin: 0,
          minHeight: "100dvh",
          padding: "24px",
        }}
      >
        <ErrorRecovery error={error} />
        <main
          style={{
            maxWidth: "620px",
            textAlign: "center",
            width: "100%",
          }}
        >
          <p
            style={{
              color: "#f58b8f",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Error inesperado
          </p>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2.4rem, 9vw, 4.5rem)",
              lineHeight: 0.98,
              margin: "24px 0 0",
            }}
          >
            No pudimos cargar esta página
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,.68)",
              fontSize: "18px",
              lineHeight: 1.6,
              margin: "24px auto 0",
            }}
          >
            Podés volver a intentarlo o regresar al inicio.
          </p>
          <div
            style={{
              display: "grid",
              gap: "12px",
              marginTop: "32px",
            }}
          >
            <button
              type="button"
              onClick={reloadCurrentPage}
              style={{
                background: "#e92529",
                border: 0,
                borderRadius: "12px",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 800,
                minHeight: "54px",
                padding: "0 24px",
                textTransform: "uppercase",
              }}
            >
              Volver a intentar
            </button>
            <Link
              href="/"
              style={{
                alignItems: "center",
                border: "1px solid rgba(255,255,255,.18)",
                borderRadius: "12px",
                color: "#ffffff",
                display: "flex",
                fontSize: "13px",
                fontWeight: 800,
                justifyContent: "center",
                minHeight: "52px",
                padding: "0 24px",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              Ir al inicio
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
