import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className = "" }: Props) {
  return (
    <div
      className={`mx-auto w-full min-w-0 max-w-7xl px-5 sm:px-7 lg:px-10 ${className}`}
    >
      {children}
    </div>
  );
}
