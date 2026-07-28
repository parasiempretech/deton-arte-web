import "server-only";

import {
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "deton_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  csrf: string;
  exp: number;
  v: 1;
};

export type AdminSession = SessionPayload;

function getPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() ?? "";
}

function shouldUseSecureCookies() {
  if (process.env.VERCEL === "1") return true;

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    return siteUrl ? new URL(siteUrl).protocol === "https:" : false;
  } catch {
    return false;
  }
}

export function isAdminConfigured() {
  return getPassword().length >= 12 && getSessionSecret().length >= 32;
}

function safeEqual(left: string, right: string) {
  const leftDigest = createHmac("sha256", "deton-arte").update(left).digest();
  const rightDigest = createHmac("sha256", "deton-arte").update(right).digest();
  return timingSafeEqual(leftDigest, rightDigest);
}

export function verifyAdminPassword(password: string) {
  return isAdminConfigured() && safeEqual(password, getPassword());
}

function sign(encodedPayload: string) {
  return createHmac("sha256", getSessionSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function createSessionToken() {
  const payload: SessionPayload = {
    csrf: randomBytes(24).toString("base64url"),
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
    v: 1,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );

  return {
    payload,
    token: `${encodedPayload}.${sign(encodedPayload)}`,
  };
}

function verifySessionToken(token: string): AdminSession | null {
  if (!isAdminConfigured()) return null;

  const [encodedPayload, signature, extra] = token.split(".");
  if (!encodedPayload || !signature || extra) return null;
  if (!safeEqual(signature, sign(encodedPayload))) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<SessionPayload>;

    if (
      payload.v !== 1 ||
      typeof payload.exp !== "number" ||
      typeof payload.csrf !== "string" ||
      payload.csrf.length < 24 ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload as AdminSession;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function startAdminSession() {
  const { payload, token } = createSessionToken();

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
    sameSite: "strict",
    secure: shouldUseSecureCookies(),
  });

  return payload;
}

export async function endAdminSession() {
  (await cookies()).set(COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "strict",
    secure: shouldUseSecureCookies(),
  });
}

function firstForwardedValue(value: string | null) {
  return value?.split(",")[0]?.trim();
}

export function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);
    const forwardedHost = firstForwardedValue(
      request.headers.get("x-forwarded-host"),
    );
    const host =
      request.headers.get("host")?.trim() ?? forwardedHost ?? requestUrl.host;
    const forwardedProtocol = firstForwardedValue(
      request.headers.get("x-forwarded-proto"),
    );
    const protocol = forwardedProtocol
      ? `${forwardedProtocol}:`
      : requestUrl.protocol;

    return originUrl.host === host && originUrl.protocol === protocol;
  } catch {
    return false;
  }
}

export async function authorizeMutation(
  request: Request,
  csrfToken?: string | null,
) {
  const session = await getAdminSession();

  return Boolean(
    session &&
      hasTrustedOrigin(request) &&
      csrfToken &&
      safeEqual(csrfToken, session.csrf),
  );
}
