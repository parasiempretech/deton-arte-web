"use client";

import { useEffect } from "react";

const LAST_AUTOMATIC_RELOAD_KEY = "deton:last-automatic-error-reload";
const RELOAD_COOLDOWN_MS = 30_000;
const DEPLOYMENT_ERROR_PATTERN =
  /chunkloaderror|loading chunk|failed to fetch dynamically imported module|importing a module script failed|failed to load script|failed to fetch rsc payload|networkerror|fetch failed/i;

export function reloadCurrentPage() {
  window.location.reload();
}

export function ErrorRecovery({ error }: { error: Error }) {
  useEffect(() => {
    const description = `${error.name} ${error.message}`;
    if (!DEPLOYMENT_ERROR_PATTERN.test(description)) return;

    const now = Date.now();
    const lastReload = Number(
      window.sessionStorage.getItem(LAST_AUTOMATIC_RELOAD_KEY),
    );
    if (Number.isFinite(lastReload) && now - lastReload < RELOAD_COOLDOWN_MS) {
      return;
    }

    window.sessionStorage.setItem(
      LAST_AUTOMATIC_RELOAD_KEY,
      String(now),
    );
    window.location.reload();
  }, [error]);

  return null;
}
