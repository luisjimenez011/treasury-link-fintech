import React from 'react';
import { QueryProvider } from '../src/lib/providers/QueryProvider';

export const metadata = {
  title: 'TreasuryLink',
  description: 'FinTech demo con Next.js, Supabase y TanStack Query',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}


