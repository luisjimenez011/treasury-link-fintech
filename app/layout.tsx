// app/layout.tsx
import "./globals.css";
import BottomNavbar from "../src/components/BottomNavbar";

export const metadata = {
  title: "TreasuryLink PRO",
  description: "Fintech banking dashboard rebuilt in PRO mode",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="bg-[#0A1A2F]">
      <body
        className="
          font-sans 
          text-white 
          min-h-screen 
          antialiased 
          selection:bg-blue-500/40 
          selection:text-white
        "
      >
        {/* === CONTENIDO PRINCIPAL === */}
        <main
          className="
            w-full
            mx-auto
            px-5
            pb-28
            pt-6

            max-w-[480px]      /* Mobile */
            sm:max-w-[640px]   /* Small tablets */
            md:max-w-[768px]   /* Large tablets */
            lg:max-w-[1024px]  /* Desktop */
            xl:max-w-[1280px]  /* Large desktop */
          "
        >
          {children}
        </main>

        {/* === NAVBAR GLOBAL === */}
        <BottomNavbar />
      </body>
    </html>
  );
}
