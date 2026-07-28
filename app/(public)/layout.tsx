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

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#070708]" />
        <div className="absolute -left-48 -top-52 h-[38rem] w-[38rem] rounded-full bg-red-700/[0.085] blur-[130px]" />
        <div className="absolute -right-64 top-[30%] h-[34rem] w-[34rem] rounded-full bg-[#f3b5a6]/[0.035] blur-[140px]" />
        <div className="grain-overlay absolute inset-0 opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="flex min-h-dvh flex-col">
        <Nav />
        <main id="main-content" className="page-enter flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <ContactDock />
    </>
  );
}
