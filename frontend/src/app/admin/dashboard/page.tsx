"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import AppShell from "@/components/AppShell";
import { dashboardApi } from "@/lib/api";
import {
  Users,
  Recycle,
  Coins,
  TrendingUp,
  BarChart3,
  Truck,
  Gift,
} from "lucide-react";

interface Summary {
  totalNasabah: number;
  totalSetorVerifikasi: number;
  totalBeratSampah: number;
  totalPoinBeredar: number;
  totalNilaiSampah: number;
}

const quickActions = [
  { href: "/admin/setor", label: "Verifikasi Setor", icon: Truck },
  { href: "/admin/nasabah", label: "Kelola Nasabah", icon: Users },
  { href: "/admin/hadiah", label: "Kelola Hadiah", icon: Gift },
  { href: "/admin/rekapitulasi", label: "Rekapitulasi", icon: BarChart3 },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (user) {
      dashboardApi
        .getSummary()
        .then((res: unknown) => {
          if (!isMounted) return;
          const r = res as { data: Summary };
          setSummary(r.data);
        })
        .catch((err) => {
          if (!isMounted) return;
          console.error("Gagal mengambil data summary:", err);
          setError("Gagal memuat data ringkasan.");
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const stats = summary
    ? [
        {
          label: "Total Nasabah",
          value: (summary.totalNasabah ?? 0).toLocaleString("id-ID"),
          icon: Users,
        },
        {
          label: "Setoran Terverifikasi",
          value: (summary.totalSetorVerifikasi ?? 0).toLocaleString("id-ID"),
          icon: Recycle,
        },
        {
          label: "Total Berat",
          value: `${Number(summary.totalBeratSampah || 0).toFixed(1)} kg`,
          icon: TrendingUp,
        },
        {
          label: "Poin Beredar",
          value: (summary.totalPoinBeredar ?? 0).toLocaleString("id-ID"),
          icon: Coins,
        },
        {
          label: "Nilai Sampah",
          value: `Rp ${Number(summary.totalNilaiSampah || 0).toLocaleString("id-ID")}`,
          icon: BarChart3,
        },
      ]
    : [];

  return (
    <AppShell actionLabel="">
      <div className="mb-5">
        <h1 className="font-bold text-smash-900 text-lg">Dashboard Admin</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Statistik & ringkasan bank sampah
        </p>
      </div>

      {/* Banner unit bank sampah */}
      <div className="gradient-eco rounded-2xl p-6 text-white mb-6 shadow-md">
        <p className="text-smash-200 text-sm mb-1">Unit Bank Sampah</p>
        <h2 className="text-2xl font-extrabold">
          {user?.adminBank?.namaUnit || "Bank Sampah"}
        </h2>
        <p className="text-smash-300 text-sm mt-1">
          Pengelola: {user?.adminBank?.namaPengelola || "-"}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-smash-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 mb-8 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center border border-red-100">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-smash-100 shadow-sm card-hover animate-fade-in"
            >
              <div className="w-10 h-10 rounded-xl gradient-eco flex items-center justify-center mb-3 shadow-sm">
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-text-muted font-medium mb-1">
                {s.label}
              </p>
              <p className="text-xl font-extrabold text-smash-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Aksi cepat */}
      <div className="bg-white rounded-2xl p-5 border border-smash-100 shadow-sm">
        <h3 className="font-bold text-smash-900 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex flex-col items-center gap-2 text-center py-4 rounded-xl bg-smash-50 border border-smash-100 hover:bg-smash-100 transition"
            >
              <a.icon className="w-5 h-5 text-smash-600" />
              <span className="text-xs font-semibold text-smash-900">
                {a.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}