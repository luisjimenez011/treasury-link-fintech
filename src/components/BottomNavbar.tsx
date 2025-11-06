"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const icons = {
  home: (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  ),
  login: (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 3h4v18h-4" />
      <path d="M10 17l5-5-5-5" />
      <path d="M3 12h12" />
    </svg>
  ),
  dashboard: (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="4" />
      <rect x="14" y="10" width="7" height="11" />
      <rect x="3" y="12" width="7" height="9" />
    </svg>
  ),
};

const ACTIVE_COLOR = "#00E0A1";

function Icon({
  active,
  name,
}: {
  active: boolean;
  name: keyof typeof icons;
}) {
  return (
    <span
      className={`
        flex items-center justify-center transition-all 
        ${active ? "scale-110" : "scale-100 opacity-60"}
      `}
      style={{
        color: active ? ACTIVE_COLOR : "rgb(160,160,160)",
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
      className="
        fixed bottom-0 left-0 right-0 z-50 h-[78px]

        bg-[#0A1A2F]/80 backdrop-blur-2xl
        border-t border-white/10
        shadow-[0_-8px_35px_rgba(0,0,0,0.4)]

        flex justify-around items-center
        pb-1
      "
    >
      {navItems.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="w-1/3 flex flex-col items-center justify-center gap-1 text-[12px] font-medium"
          >
            <Icon active={active} name={item.icon} />

            <span
              className={`transition-all ${
                active ? "text-white font-semibold" : "text-white/70"
              }`}
            >
              {item.label}
            </span>

            <div
              className={`
                h-[3px] rounded-full transition-all
                ${active ? "opacity-100 w-6" : "opacity-0 w-0"}
              `}
              style={{ backgroundColor: ACTIVE_COLOR }}
            />
          </Link>
        );
      })}
    </nav>
  );
}
