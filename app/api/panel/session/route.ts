import { setTimeout as wait } from "timers/promises";
import {
  authorizeMutation,
  endAdminSession,
  hasTrustedOrigin,
  isAdminConfigured,
  startAdminSession,
  verifyAdminPassword,
} from "@/lib/admin/auth";

export const runtime = "nodejs";

const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const MAX_TRACKED_CLIENTS = 500;
const MAX_LOGIN_BODY_BYTES = 4096;
const MAX_PASSWORD_LENGTH = 512;
const attempts = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: Request) {
  const key =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  return key.slice(0, 128);
}

function pruneAttempts(now: number) {
  attempts.forEach((value, attemptKey) => {
    if (value.resetAt <= now) attempts.delete(attemptKey);
  });

  while (attempts.size >= MAX_TRACKED_CLIENTS) {
    const oldestKey = attempts.keys().next().value as string | undefined;
    if (!oldestKey) break;
    attempts.delete(oldestKey);
  }
}

function noStoreJson(body: object, status = 200) {
  return Response.json(body, {
    headers: { "Cache-Control": "no-store" },
    status,
  });
}

export async function POST(request: Request) {
  if (!hasTrustedOrigin(request)) {
    return noStoreJson({ error: "Solicitud no autorizada." }, 403);
  }
  if (!isAdminConfigured()) {
    return noStoreJson(
      { error: "El acceso privado todavía no está configurado." },
      503,
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (
    !Number.isFinite(contentLength) ||
    contentLength < 0 ||
    contentLength > MAX_LOGIN_BODY_BYTES
  ) {
    return noStoreJson({ error: "Solicitud inválida." }, 400);
  }

  const key = getClientKey(request);
  const now = Date.now();
  pruneAttempts(now);
  const current = attempts.get(key);
  const attempt =
    current && current.resetAt > now
      ? current
      : { count: 0, resetAt: now + ATTEMPT_WINDOW_MS };

  if (attempt.count >= MAX_ATTEMPTS) {
    return noStoreJson(
      { error: "Demasiados intentos. Probá nuevamente más tarde." },
      429,
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password =
      typeof body.password === "string" &&
      body.password.length <= MAX_PASSWORD_LENGTH
        ? body.password
        : "";
  } catch {
    return noStoreJson({ error: "Solicitud inválida." }, 400);
  }

  if (!verifyAdminPassword(password)) {
    attempt.count += 1;
    attempts.set(key, attempt);
    await wait(450);
    return noStoreJson({ error: "La contraseña no es correcta." }, 401);
  }

  attempts.delete(key);
  await startAdminSession();
  return noStoreJson({ ok: true });
}

export async function DELETE(request: Request) {
  const csrfToken = request.headers.get("x-csrf-token");
  if (!(await authorizeMutation(request, csrfToken))) {
    return noStoreJson({ error: "Sesión no autorizada." }, 401);
  }

  await endAdminSession();
  return noStoreJson({ ok: true });
}
