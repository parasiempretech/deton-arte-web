import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Panel privado",
};

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
