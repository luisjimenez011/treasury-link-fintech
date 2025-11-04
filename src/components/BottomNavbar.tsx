"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// ——— ICONOS SVG minimalistas estilo BBVA ——— //
const icons = {
  home: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  ),
  login: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h4v18h-4" />
      <path d="M10 17l5-5-5-5" />
      <path d="M3 12h12" />
    </svg>
  ),
  dashboard: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="4" />
      <rect x="14" y="10" width="7" height="11" />
      <rect x="3" y="12" width="7" height="9" />
    </svg>
  ),
};

// 💙 Color corporativo solicitado
const PRIMARY = "#0A1A2F";

function Icon({ active, name }: { active: boolean; name: keyof typeof icons }) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active ? PRIMARY : "#666",
        opacity: active ? 1 : 0.55,
        transform: active ? "scale(1.18)" : "scale(1)",
        transition: "0.28s ease",
      }}
    >
      {icons[name]}
    </span>
  );
}

export default function BottomNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Inicio", icon: "home" as const },
    { href: "/login", label: "Login", icon: "login" as const },
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" as const },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 78,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(0,0,0,0.05)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 999,
        paddingBottom: 6,
        boxShadow: "0 -6px 18px rgba(0,0,0,0.05)",
      }}
    >
      {navItems.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              textAlign: "center",
              textDecoration: "none",
              width: "25%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: active ? 600 : 500,
              color: active ? PRIMARY : "#222",
            }}
          >
            <Icon active={active} name={item.icon} />

            {/* Etiqueta */}
            <span>{item.label}</span>

            {/* Indicador inferior estilo Revolut / BBVA */}
            <div
              style={{
                height: active ? 3 : 0,
                width: active ? 26 : 0,
                background: PRIMARY,
                borderRadius: 8,
                marginTop: 2,
                transition: "0.25s ease",
                opacity: active ? 1 : 0,
              }}
            />
          </Link>
        );
      })}
    </nav>
  );
}
