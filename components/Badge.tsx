import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className = "" }: Props) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
