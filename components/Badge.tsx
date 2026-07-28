import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className = "" }: Props) {
  return (
    <span
      className={[
        "inline-flex min-h-8 items-center rounded-full border border-red-300/30 bg-[#1b1012]/80 px-3.5 py-1 font-[family-name:var(--font-body)] text-[11px] font-semibold uppercase tracking-[0.14em] text-red-100 backdrop-blur-md",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
