import Link from "next/link";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & {
  variant?: "primary" | "ghost";
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

  const styles =
    variant === "primary"
      ? // Botón principal (blanco)
        "bg-white text-ink-950 hover:bg-white/90 active:bg-white/80"
      : // Botón ghost (ROJO, sin rosa)
        "bg-transparent text-white border border-white/20 " +
        "hover:bg-red-600/15 hover:text-red-500 active:bg-red-600/25";

  return <Link className={`${base} ${styles} ${className}`} {...props} />;
}
