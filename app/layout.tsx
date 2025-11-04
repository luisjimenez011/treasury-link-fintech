import BottomNavbar from "../src/components/BottomNavbar";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}

        {/* ✅ NAVBAR FIJA INFERIOR */}
        <BottomNavbar />
      </body>
    </html>
  );
}
