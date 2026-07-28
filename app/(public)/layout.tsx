import { ContactDock } from "@/components/ContactDock";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-lg bg-white px-4 py-2 text-sm font-bold text-black shadow-xl transition-transform focus:translate-y-0"
      >
        Saltar al contenido
      </a>

      <div className="flex min-h-dvh flex-col">
        <Nav />
        <main id="main-content" tabIndex={-1} className="page-enter flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <ContactDock />
    </>
  );
}
