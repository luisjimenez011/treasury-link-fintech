import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: '48px auto', padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>TreasuryLink</h1>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/login">Ir a Login</Link>
        <Link href="/dashboard">Ir a Dashboard</Link>
      </nav>
    </main>
  );
}


