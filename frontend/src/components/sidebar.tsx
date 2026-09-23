"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  Clover,
  Home,
  Recycle,
  Truck,
  History,
  Gift,
  Users,
  BarChart3,
  LogOut,
} from "lucide-react";

const nasabahMenu = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/nasabah/kategori", icon: Recycle, label: "Katalog Sampah" },
  { href: "/nasabah/setor", icon: Truck, label: "Setor Sampah" },
  { href: "/nasabah/riwayat", icon: History, label: "Riwayat" },
  { href: "/nasabah/hadiah", icon: Gift, label: "Tukar Poin" },
];

const adminMenu = [
  { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
  { href: "/admin/nasabah", icon: Users, label: "Data Nasabah" },
  { href: "/admin/kategori", icon: Recycle, label: "Kategori Sampah" },
  { href: "/admin/setor", icon: Truck, label: "Verifikasi Setor" },
  { href: "/admin/hadiah", icon: Gift, label: "Kelola Hadiah" },
  { href: "/admin/rekapitulasi", icon: BarChart3, label: "Rekapitulasi" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const menu = isAdmin ? adminMenu : nasabahMenu;

  const displayName = isAdmin
    ? user?.adminBank?.namaUnit ?? user?.username
    : user?.nasabah?.namaNasabah ?? user?.username;

  const initials = (displayName ?? "?").slice(0, 2).toUpperCase();

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  return (
    <aside className="w-[200px] shrink-0 bg-smash-800 p-4 flex flex-col relative overflow-hidden">
      <Clover
        className="absolute -top-3 -right-4 w-24 h-24 text-smash-600 opacity-30 rotate-12"
        strokeWidth={1.2}
      />

      <div className="flex items-center gap-2 px-1 pb-5 relative">
        <div className="w-8 h-8 rounded-lg bg-smash-400 flex items-center justify-center shrink-0">
          <Clover className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-white text-base">SMASH</span>
      </div>

      <nav className="flex flex-col gap-1 relative">
        {menu.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-smash-600 text-white font-medium"
                  : "text-smash-200 hover:bg-smash-600/40"
              }`}
            >
              <item.icon className="w-[17px] h-[17px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div className="bg-black/20 rounded-xl p-3 flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-smash-300 flex items-center justify-center text-xs font-semibold text-smash-900 shrink-0">
          {initials}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs text-white font-medium truncate">{displayName}</p>
          <p className="text-[10px] text-smash-300">
            {isAdmin ? "Admin Bank Sampah" : "Nasabah"}
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-300 hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="w-[17px] h-[17px]" />
        Keluar
      </button>
    </aside>
  );
}