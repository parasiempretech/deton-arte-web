"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  categoryKeys,
  categoryLabels,
  MAX_UPLOAD_BYTES,
} from "@/lib/admin/constants";
import type {
  AdminGalleryItem,
  ManagedGalleryItem,
  StorageMode,
} from "@/lib/gallery-types";
import type { CategoryKey } from "@/lib/site";

type ApiResult = {
  error?: string;
  item?: ManagedGalleryItem;
};

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function readApiResult(response: Response) {
  const body = (await response.json().catch(() => ({}))) as ApiResult;
  if (!response.ok || !body.item) {
    throw new Error(body.error || "La operación no pudo completarse.");
  }
  return body.item;
}

export function AdminPanel({
  csrfToken,
  initialItems,
  loadError,
  storageMode,
}: {
  csrfToken: string;
  initialItems: AdminGalleryItem[];
  loadError?: string;
  storageMode: StorageMode;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const deleteDialogRef = useRef<HTMLDivElement | null>(null);
  const cancelDeleteRef = useRef<HTMLButtonElement | null>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null);
  const deletingRef = useRef(false);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [items, setItems] = useState(initialItems);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [progress, setProgress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(loadError ?? "");
  const [deleteTarget, setDeleteTarget] =
    useState<AdminGalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  deletingRef.current = deleting;

  const counts = useMemo(() => {
    const result = Object.fromEntries(
      categoryKeys.map((key) => [key, 0]),
    ) as Record<CategoryKey, number>;
    items.forEach((item) => {
      result[item.category] += 1;
    });
    return result;
  }, [items]);

  const categoryItems = useMemo(
    () =>
      activeCategory
        ? items.filter((item) => item.category === activeCategory)
        : [],
    [activeCategory, items],
  );

  useEffect(() => {
    if (!deleteTarget) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => cancelDeleteRef.current?.focus());

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !deletingRef.current) {
        setDeleteTarget(null);
        return;
      }
      if (event.key !== "Tab") return;

      const focusableElements =
        deleteDialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled])',
        );
      if (!focusableElements?.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      const focusTarget = deleteTriggerRef.current ?? previousFocus;
      if (focusTarget?.isConnected) focusTarget.focus();
    };
  }, [deleteTarget]);

  function resetSelection() {
    setFiles([]);
    setMessage("");
    setError(loadError ?? "");
    if (inputRef.current) inputRef.current.value = "";
  }

  function openCategory(category: CategoryKey) {
    if (uploading) return;
    resetSelection();
    setActiveCategory(category);
  }

  function closeCategory() {
    if (uploading) return;
    resetSelection();
    setActiveCategory(null);
  }

  function selectFiles(selectedFiles: File[]) {
    setError("");
    setMessage("");

    const oversized = selectedFiles.find(
      (file) => file.size > MAX_UPLOAD_BYTES,
    );
    if (oversized) {
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      setError(`${oversized.name} supera el límite de 40 MB.`);
      return;
    }

    if (selectedFiles.length > 20) {
      setFiles(selectedFiles.slice(0, 20));
      setError(
        "Podés publicar hasta 20 fotos por vez. Seleccionamos las primeras 20.",
      );
      return;
    }

    setFiles(selectedFiles.slice(0, 20));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    selectFiles(Array.from(event.target.files ?? []));
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    if (uploading || storageMode === "unavailable") return;
    selectFiles(Array.from(event.dataTransfer.files));
  }

  async function uploadToHosting(file: File, category: CategoryKey) {
    const formData = new FormData();
    formData.set("category", category);
    formData.set("file", file);

    return readApiResult(
      await fetch("/api/panel/images", {
        body: formData,
        headers: { "x-csrf-token": csrfToken },
        method: "POST",
      }),
    );
  }

  async function handleUpload() {
    if (
      !activeCategory ||
      !files.length ||
      uploading ||
      storageMode === "unavailable"
    ) {
      return;
    }

    const uploadCategory = activeCategory;
    setUploading(true);
    setError("");
    setMessage("");
    const uploaded: ManagedGalleryItem[] = [];

    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        setProgress(`Subiendo ${index + 1} de ${files.length}`);
        const item = await uploadToHosting(file, uploadCategory);
        uploaded.push(item);
      }

      setItems((current) => [...uploaded.reverse(), ...current]);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      setMessage(
        uploaded.length === 1
          ? "Foto publicada."
          : `${uploaded.length} fotos publicadas.`,
      );
      router.refresh();
    } catch (requestError) {
      if (uploaded.length) {
        setItems((current) => [...uploaded.reverse(), ...current]);
        setFiles((current) => current.slice(uploaded.length));
      }
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo completar la carga.",
      );
    } finally {
      setProgress("");
      setUploading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting) return;

    setDeleting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/panel/images",
        {
          body: JSON.stringify({
            category: deleteTarget.category,
            id: deleteTarget.id,
            source: deleteTarget.source,
          }),
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
          },
          method: "DELETE",
        },
      );
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(body.error || "No se pudo eliminar la foto.");
      }

      setItems((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
      setMessage("Foto eliminada.");
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo eliminar la foto.",
      );
    } finally {
      setDeleting(false);
    }
  }

  async function logout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");
    try {
      const response = await fetch("/api/panel/session", {
        headers: { "x-csrf-token": csrfToken },
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("No se pudo cerrar la sesión.");
      }
      router.replace("/panel/login");
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo cerrar la sesión.",
      );
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#070708] text-white">
      <header className="sticky top-0 z-30 border-b border-white/[0.09] bg-[#070708]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-7">
          <button
            type="button"
            onClick={closeCategory}
            className="flex items-center gap-3 text-left"
            aria-label="Ir a las galerías"
          >
            <Image
              src="/logodeton.png"
              alt=""
              width={42}
              height={42}
              className="h-10 w-10 object-cover object-top"
            />
            <span className="hidden font-[family-name:var(--font-display)] text-xl font-semibold leading-none min-[360px]:inline">
              Deton Arte
            </span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-action min-h-10 px-3 py-2 text-[10px] sm:px-4 sm:text-[11px]"
            >
              Ver sitio
            </Link>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="min-h-10 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/50 transition-colors hover:text-white disabled:cursor-wait disabled:opacity-50 sm:text-[11px]"
            >
              {loggingOut ? "Saliendo…" : "Salir"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-7 sm:py-12">
        {!activeCategory ? (
          <>
            <div className="max-w-2xl">
              <div className="eyebrow">Panel privado</div>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.8rem,7vw,5.25rem)] font-semibold leading-[0.9] tracking-[-0.04em]">
                Galerías
              </h1>
              <p className="mt-4 text-base text-white/55">
                Elegí una galería para administrar sus fotos.
              </p>
            </div>

            {error && (
              <div
                className="mt-7 border-l-2 border-red-400 bg-red-500/[0.045] px-4 py-3 text-sm text-red-200/80"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.1] sm:mt-9 lg:grid-cols-3">
              {categoryKeys.map((key, index) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => openCategory(key)}
                  className={[
                    "group relative flex min-h-40 flex-col items-start justify-between bg-[#0b0b0d] p-4 text-left transition-colors hover:bg-[#161012] focus-visible:bg-[#161012] sm:min-h-52 sm:p-6 lg:min-h-56 lg:p-7",
                    index === categoryKeys.length - 1
                      ? "col-span-2 lg:col-span-1"
                      : "",
                  ].join(" ")}
                >
                  <span className="text-[10px] font-semibold tracking-[0.16em] text-red-300/65">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-[family-name:var(--font-display)] text-[clamp(1.55rem,6vw,3rem)] font-semibold leading-[0.92] tracking-[-0.03em]">
                      {categoryLabels[key]}
                    </span>
                    <span className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.09em] text-white/45 transition-colors group-hover:text-white sm:mt-5 sm:gap-3 sm:text-xs">
                      {counts[key]} {counts[key] === 1 ? "foto" : "fotos"}
                      <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={closeCategory}
              className="flex min-h-10 items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/50 transition hover:text-white"
            >
              <span aria-hidden="true">←</span>
              Galerías
            </button>

            <div className="mt-5 flex flex-col gap-5 border-b border-white/[0.1] pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="eyebrow">Galería</div>
                <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.8rem,7vw,5rem)] font-semibold leading-[0.9] tracking-[-0.04em]">
                  {categoryLabels[activeCategory]}
                </h1>
              </div>
              <div className="text-sm text-white/45">
                {categoryItems.length}{" "}
                {categoryItems.length === 1 ? "foto" : "fotos"}
              </div>
            </div>

            <section className="mt-7 grid items-start gap-7 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-9">
              <div className="rounded-2xl border border-white/[0.12] bg-white/[0.025] p-5">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
                  Agregar fotos
                </h2>

                <input
                  ref={inputRef}
                  id="admin-images"
                  type="file"
                  accept="image/*,.heic,.heif,.tif,.tiff,.avif,.bmp,.svg"
                  multiple
                  disabled={uploading || storageMode === "unavailable"}
                  className="peer sr-only"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="admin-images"
                  onDragEnter={() => setDragging(true)}
                  onDragLeave={() => setDragging(false)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  aria-disabled={uploading || storageMode === "unavailable"}
                  className={[
                    "mt-5 flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed px-5 text-center transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-amber-200 sm:min-h-40",
                    storageMode === "unavailable"
                      ? "cursor-not-allowed border-white/[0.1] bg-black/20 opacity-45"
                      : dragging
                      ? "border-red-300/70 bg-red-500/[0.08]"
                      : "cursor-pointer border-white/[0.18] bg-black/20 hover:border-red-300/40",
                  ].join(" ")}
                >
                  <span className="font-[family-name:var(--font-display)] text-xl font-semibold">
                    Elegir fotos
                  </span>
                  <span className="mt-2 text-xs text-white/40">
                    Seleccioná una o varias
                  </span>
                </label>

                {files.length > 0 && (
                  <div className="mt-4 max-h-40 space-y-2 overflow-y-auto pr-1">
                    {files.map((file) => (
                      <div
                        key={`${file.name}-${file.lastModified}-${file.size}`}
                        className="flex items-center justify-between gap-3 text-xs"
                      >
                        <span className="min-w-0 truncate text-white/70">
                          {file.name}
                        </span>
                        <span className="shrink-0 text-white/35">
                          {formatBytes(file.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={
                    !files.length ||
                    uploading ||
                    storageMode === "unavailable"
                  }
                  className="primary-action mt-5 w-full disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {uploading
                    ? "Publicando…"
                    : files.length > 1
                      ? `Publicar ${files.length} fotos`
                      : "Publicar foto"}
                </button>

                {storageMode === "unavailable" && (
                  <p className="mt-3 text-xs text-red-300/80" role="alert">
                    La administración de fotos no está disponible.
                  </p>
                )}

                {progress && (
                  <p
                    className="mt-3 text-xs text-white/50"
                    role="status"
                    aria-live="polite"
                  >
                    {progress}
                  </p>
                )}
              </div>

              <div className="min-w-0">
                {(message || error) && (
                  <div
                    className={[
                      "mb-5 border-l-2 px-4 py-3 text-sm",
                      error
                        ? "border-red-400 bg-red-500/[0.045] text-red-200/80"
                        : "border-emerald-300/70 bg-emerald-300/[0.04] text-emerald-100/75",
                    ].join(" ")}
                    role={error ? "alert" : "status"}
                    aria-live="polite"
                  >
                    {error || message}
                  </div>
                )}

                {categoryItems.length ? (
                  <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 xl:columns-4">
                    {categoryItems.map((item) => (
                      <article
                        key={item.id}
                        className="group mb-5 break-inside-avoid"
                      >
                        <div
                          className="relative w-full overflow-hidden bg-white/[0.025]"
                          style={{
                            aspectRatio: `${item.width} / ${item.height}`,
                          }}
                        >
                          <Image
                            src={item.src}
                            alt=""
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        </div>
                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            disabled={storageMode === "unavailable"}
                            onClick={(event) => {
                              deleteTriggerRef.current = event.currentTarget;
                              setDeleteTarget(item);
                            }}
                            className="min-h-11 px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/45 transition-colors hover:text-red-200 focus-visible:text-red-200 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            Eliminar
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-white/[0.12] px-5 text-center sm:min-h-64">
                    <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white/50">
                      No hay fotos publicadas
                    </p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-image-title"
          onMouseDown={(event) => {
            if (
              event.currentTarget === event.target &&
              !deletingRef.current
            ) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            ref={deleteDialogRef}
            className="surface-card w-full max-w-md p-6 sm:p-7"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-300">
              Eliminar foto
            </div>
            <h2
              id="delete-image-title"
              className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold"
            >
              ¿Querés eliminarla?
            </h2>
            <div
              className="relative mt-5 max-h-64 w-full overflow-hidden bg-black/30"
              style={{
                aspectRatio: `${deleteTarget.width} / ${deleteTarget.height}`,
              }}
            >
              <Image
                src={deleteTarget.src}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 640px) 90vw, 28rem"
              />
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                ref={cancelDeleteRef}
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="secondary-action flex-1"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="danger-action flex-1"
              >
                {deleting ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
