"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/gallery-types";
import { Container } from "./Container";

type ImageStatus = "loading" | "loaded" | "error";

export function Gallery({
  title,
  items,
}: {
  title: string;
  items: GalleryItem[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [imageStatus, setImageStatus] = useState<ImageStatus>("loading");
  const [retryVersion, setRetryVersion] = useState(0);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const dialogTitleId = useId();

  const closeImage = useCallback(() => {
    setActiveIndex(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const showNext = useCallback(() => {
    setImageStatus("loading");
    setRetryVersion(0);
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % items.length,
    );
  }, [items.length]);

  const showPrevious = useCallback(() => {
    setImageStatus("loading");
    setRetryVersion(0);
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + items.length) % items.length,
    );
  }, [items.length]);

  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.galleryOpen = "true";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeImage();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrevious();

      if (event.key === "Tab") {
        const focusableElements =
          dialogRef.current?.querySelectorAll<HTMLButtonElement>("button");
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
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      delete document.body.dataset.galleryOpen;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeImage, isOpen, showNext, showPrevious]);

  const activeItem = activeIndex === null ? null : items[activeIndex];

  const dialog =
    activeItem && activeIndex !== null && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] bg-[#030304]/[0.98] backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) closeImage();
            }}
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              if (touchStartX.current === null) return;
              const endX =
                event.changedTouches[0]?.clientX ?? touchStartX.current;
              const distance = endX - touchStartX.current;
              touchStartX.current = null;

              if (Math.abs(distance) < 55) return;
              if (distance < 0) showNext();
              else showPrevious();
            }}
          >
            <div
              ref={dialogRef}
              className="mx-auto flex h-[100dvh] w-full max-w-[1800px] flex-col"
            >
              <div className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-white/[0.08] px-4 sm:min-h-20 sm:px-7">
                <div
                  className="font-[family-name:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60"
                  aria-live="polite"
                >
                  <h2 id={dialogTitleId} className="sr-only">
                    Vista ampliada de la galería
                  </h2>
                  {activeIndex + 1} / {items.length}
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeImage}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.055] text-2xl text-white transition-colors hover:bg-white hover:text-black"
                  aria-label="Cerrar imagen"
                >
                  ×
                </button>
              </div>

              <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 pb-20 pt-3 sm:p-8 lg:px-24">
                {imageStatus === "loading" && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    role="status"
                    aria-label="Cargando imagen"
                  >
                    <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-red-400" />
                  </div>
                )}

                {imageStatus === "error" ? (
                  <div className="max-w-sm text-center">
                    <p className="text-sm font-semibold text-white/70">
                      La imagen no pudo cargarse.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setRetryVersion((current) => current + 1);
                        setImageStatus("loading");
                      }}
                      className="secondary-action mt-5"
                    >
                      Volver a intentar
                    </button>
                  </div>
                ) : (
                  <Image
                    key={`${activeItem.id}-${retryVersion}`}
                    src={activeItem.src}
                    alt="Obra ampliada de Deton Arte"
                    width={activeItem.width}
                    height={activeItem.height}
                    onLoad={() => setImageStatus("loaded")}
                    onError={() => setImageStatus("error")}
                    className={[
                      "h-auto max-h-full w-auto max-w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.72)] transition-opacity duration-200",
                      imageStatus === "loaded" ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                    sizes="100vw"
                  />
                )}

                {items.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPrevious}
                      className="absolute bottom-4 left-4 flex h-11 min-w-11 items-center justify-center rounded-full border border-white/[0.13] bg-black/70 px-4 text-xl text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black sm:bottom-auto sm:left-7 sm:top-1/2 sm:h-14 sm:-translate-y-1/2"
                      aria-label="Imagen anterior"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      className="absolute bottom-4 right-4 flex h-11 min-w-11 items-center justify-center rounded-full border border-white/[0.13] bg-black/70 px-4 text-xl text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black sm:bottom-auto sm:right-7 sm:top-1/2 sm:h-14 sm:-translate-y-1/2"
                      aria-label="Imagen siguiente"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        <div className="absolute -right-48 top-24 h-80 w-80 rounded-full bg-red-800/[0.045] blur-[120px]" />

        <Container>
          <header className="flex items-end justify-between gap-6">
            <h2 className="section-title">{title}</h2>
            <div className="mb-1 shrink-0 font-[family-name:var(--font-body)] text-[11px] font-medium uppercase tracking-[0.13em] text-white/60">
              {items.length} obras
            </div>
          </header>

          <div className="mt-8 columns-2 gap-2.5 sm:mt-10 sm:gap-4 lg:columns-3 xl:columns-4">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setRetryVersion(0);
                  setImageStatus("loading");
                  setActiveIndex(index);
                }}
                aria-haspopup="dialog"
                aria-label={`Ampliar obra ${index + 1} de ${items.length}`}
                className="group relative mb-2.5 block w-full break-inside-avoid cursor-zoom-in overflow-hidden text-left transition-[filter,transform] duration-300 hover:-translate-y-0.5 hover:brightness-[1.04] focus-visible:z-10 sm:mb-4"
                style={{ aspectRatio: `${item.width} / ${item.height}` }}
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  aria-hidden="true"
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.008]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1280px) 34vw, 25vw"
                />
                <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.08]" />
                <span className="pointer-events-none absolute bottom-3 right-3 translate-y-1 text-xl font-light text-white opacity-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-90 group-focus-visible:translate-y-0 group-focus-visible:opacity-90">
                  +
                </span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {dialog}
    </>
  );
}
