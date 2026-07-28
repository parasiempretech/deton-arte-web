"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/panel/session", {
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(body.error || "No se pudo iniciar la sesión.");
      }

      router.replace("/panel");
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo iniciar la sesión.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="mt-8" onSubmit={handleSubmit} aria-busy={submitting}>
      <label
        htmlFor="admin-password"
        className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-white/55"
      >
        Contraseña
      </label>
      <input
        id="admin-password"
        type="password"
        autoComplete="current-password"
        autoFocus
        disabled={!configured || submitting}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error
            ? "admin-password-error"
            : !configured
              ? "admin-configuration-status"
              : undefined
        }
        className="mt-3 min-h-14 w-full rounded-xl border border-white/[0.14] bg-white/[0.05] px-4 text-base text-white outline-none transition focus:border-red-300/60 focus:bg-white/[0.075] disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Ingresá tu contraseña"
        required
      />

      {error && (
        <p
          id="admin-password-error"
          className="mt-3 text-sm leading-6 text-red-300"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      {!configured && (
        <p
          id="admin-configuration-status"
          className="mt-3 text-sm leading-6 text-amber-200/75"
          role="status"
        >
          El acceso privado requiere configurar las variables de entorno del
          panel.
        </p>
      )}

      <button
        type="submit"
        disabled={!configured || submitting || password.length === 0}
        className="primary-action mt-6 w-full disabled:cursor-not-allowed disabled:opacity-45"
      >
        {submitting ? "Verificando…" : "Ingresar al panel"}
      </button>
    </form>
  );
}
