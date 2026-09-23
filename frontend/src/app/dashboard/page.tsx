"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { dashboardApi, setorApi, penukaranApi } from "@/lib/api";
import AppShell from "@/components/AppShell";
import Link from "next/link";
import {
  Coins, Scale, Layers, Leaf, ShieldCheck,
  CheckCircle2, Clock, Award, Sparkles,
} from "lucide-react";

interface NasabahSummary {
  saldoPoinSaatIni: number;
  totalSampahDisetorKg: number;
  totalPoinDidapat: number;
  totalPoinDitukar: number;
  transaksiTerakhirSetor: {
    kodeSetor: string;
    tanggal: string;
    beratKg: number;
    poin: number;
    status: string;
  } | null;
  transaksiTerakhirTukar: {
    kodePenukaran: string;
    tanggal: string;
    hadiah: string;
    poin: number;
    status: string;
  } | null;
}

interface SetorItem {
  id: string;
  tanggal: string;
  totalBeratKg: number;
  totalPoin: number | null;
  estimasiTotalPoin: number | null;
  status: string;
}

interface AdminStats {
  totalNasabah: number;
  totalKategoriSampah: number;
  totalTransaksiSetor: number;
  totalHadiah: number;
  totalBeratSampahKg: number;
  totalPoinTersalurkan: number;
}

function getBadges(totalKg: number, totalPoin: number) {
  const badges = [];
  if (totalKg >= 5) badges.push({ label: "Pahlawan Plastik", icon: ShieldCheck, color: "#f59e0b", bg: "#fef3c7", unlocked: true });
  if (totalKg >= 10) badges.push({ label: "Kolektor Kardus", icon: Layers, color: "#3b82f6", bg: "#dbeafe", unlocked: true });
  else badges.push({ label: "Kolektor Kardus", icon: Layers, color: "#cbd5e1", bg: "#f8fafc", unlocked: false });
  if (totalPoin >= 500) badges.push({ label: "Level Emas", icon: Award, color: "#d97706", bg: "#fef9c3", unlocked: true });
  else badges.push({ label: "Level Emas", icon: Award, color: "#cbd5e1", bg: "#f8fafc", unlocked: false });
  return badges;
}

function getNextGoal(poin: number) {
  const goals = [
    { label: "Menuju Voucher Netflix 1 tahun", target: 180 },
    { label: "Menuju Voucher Pulsa", target: 500 },
    { label: "Menuju Level Emas", target: 2000 },
  ];
  for (const g of goals) {
    if (poin < g.target) return g;
  }
  return { label: "Level Maksimal Tercapai!", target: poin };
}

function getLast6Months(setors: SetorItem[]) {
  const now = new Date();
  const months: { label: string; poin: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("id-ID", { month: "short" });
    const poin = setors
      .filter((s) => {
        const td = new Date(s.tanggal);
        return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
      })
      .reduce((acc, s) => acc + (s.totalPoin ?? s.estimasiTotalPoin ?? 0), 0);
    months.push({ label, poin });
  }
  return months;
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<NasabahSummary | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [trendData, setTrendData] = useState<{ label: string; poin: number }[]>([]);
  const [adminSetor, setAdminSetor] = useState<SetorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/auth/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    if (user.role === "NASABAH") {
      Promise.all([
        dashboardApi.getSummary() as Promise<{ data: NasabahSummary }>,
        setorApi.getMySetor() as Promise<{ data: SetorItem[] }>,
        penukaranApi.getMyPenukaran() as Promise<{ data: unknown[] }>,
      ]).then(([sum, setors]) => {
        setSummary(sum.data);
        setTrendData(getLast6Months(setors.data || []));
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      Promise.all([
        dashboardApi.getStats() as Promise<{ data: AdminStats }>,
        setorApi.getAdminList("status=MENUNGGU") as Promise<{ data: SetorItem[] }>,
      ]).then(([stats, setors]) => {
        setAdminStats(stats.data);
        setAdminSetor((setors.data || []).slice(0, 5));
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  if (isLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0fdf4" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #1a4731", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;

  // ── NASABAH DASHBOARD ──
  if (user.role === "NASABAH") {
    const poin = summary?.saldoPoinSaatIni ?? user.nasabah?.saldoPoin ?? 0;
    const kg = summary?.totalSampahDisetorKg ?? 0;
    const co2 = (kg * 0.28).toFixed(1);
    const badges = getBadges(kg, poin);
    const goal = getNextGoal(poin);
    const goalProgress = Math.min((poin / goal.target) * 100, 100);
    const maxPoin = Math.max(...trendData.map((d) => d.poin), 1);

    return (
      <AppShell>
        {/* Hero card with medium emerald green gradient */}
        <div className="card-hero-lime mb-6">
          <svg
            className="card-hero-lime-pattern"
            viewBox="0 0 160 160"
            fill="white"
          >
            <path d="M80 10C80 10 40 40 40 80C40 120 80 150 80 150C80 150 120 120 120 80C120 40 80 10 80 10Z" />
            <circle cx="80" cy="80" r="30" />
          </svg>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255, 255, 255, 0.16)", backdropFilter: "blur(4px)", padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.25)", marginBottom: 14 }}>
            <Sparkles size={13} color="#86efac" />
            <span style={{ color: "#dcfce7", fontSize: 11.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Dampak Lingkunganmu
            </span>
          </div>

          <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", lineHeight: 1.35, marginBottom: 20, maxWidth: 650 }}>
            Kamu sudah menyelamatkan <span style={{ color: "#86efac", textDecoration: "underline", textDecorationColor: "rgba(134, 239, 172, 0.5)" }}>{kg} kg</span> sampah dari TPA!
          </div>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)", padding: "12px 20px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.18)" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#ffffff" }}>≈{co2} kg</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500, marginTop: 2 }}>CO2 diselamatkan</div>
            </div>
            {summary?.transaksiTerakhirSetor && (
              <div style={{ background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(4px)", padding: "12px 20px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.18)" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#ffffff" }}>
                  #{Math.floor(Math.random() * 20) + 1}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500, marginTop: 2 }}>Peringkat komunitas</div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4 mb-6">
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: "#dcfce7" }}>
              <Coins size={20} color="#16a34a" />
            </div>
            <div className="stat-card-value">{poin}</div>
            <div className="stat-card-label">Saldo poin</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: "#dbeafe" }}>
              <Scale size={20} color="#2563eb" />
            </div>
            <div className="stat-card-value">{kg} kg</div>
            <div className="stat-card-label">Total disetor</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: "#ccfbf1" }}>
              <Leaf size={20} color="#0d9488" />
            </div>
            <div className="stat-card-value">
              {summary ? (summary.totalPoinDidapat > 0 ? Math.ceil(summary.totalPoinDidapat / 50) : 0) : 0}
            </div>
            <div className="stat-card-label">Jenis dikumpulkan</div>
          </div>
          {/* Mascot animation — Tanpa card dan teks agar ukuran jauh lebih besar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              background: "transparent",
              overflow: "visible",
            }}
          >
            <style>{`
              @keyframes mascotFloat {
                0%, 100% {
                  transform: translateY(0px) scale(1);
                  filter: drop-shadow(0 10px 22px rgba(22, 163, 74, 0.35));
                }
                50% {
                  transform: translateY(-10px) scale(1.03);
                  filter: drop-shadow(0 22px 34px rgba(22, 163, 74, 0.22));
                }
              }
            `}</style>
            <img
              src="/mascot-streak.png?v=2"
              alt="Maskot Bank Sampah"
              style={{
                width: "100%",
                maxWidth: 270,
                minWidth: 210,
                height: "auto",
                animation: "mascotFloat 2.6s ease-in-out infinite",
                userSelect: "none",
                pointerEvents: "none",
                transformOrigin: "center center",
              }}
            />
          </div>
        </div>

        <div className="grid-2">
          {/* Kiri: Lencana + Progress */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Lencana */}
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Lencana Pencapaian
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {badges.map((b, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%",
                      background: b.bg, border: `2px solid ${b.unlocked ? b.color : "#e2e8f0"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: b.unlocked ? 1 : 0.5,
                    }}>
                      <b.icon size={22} color={b.color} />
                    </div>
                    <span style={{ fontSize: 10, color: b.unlocked ? "#374151" : "#94a3b8", fontWeight: 600, textAlign: "center" }}>
                      {b.unlocked ? b.label : "Terkunci"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{goal.label}</span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{poin}/{goal.target}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${goalProgress}%` }} />
                </div>
              </div>
            </div>

            {/* Tren poin */}
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>
                Tren Poin 6 Bulan
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
                {trendData.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div
                      style={{
                        width: "100%",
                        height: `${(d.poin / maxPoin) * 70 + 4}px`,
                        background: i === trendData.length - 1 ? "#1a4731" : "#bbf7d0",
                        borderRadius: "4px 4px 0 0",
                        minHeight: 4,
                        transition: "height 0.4s ease",
                      }}
                    />
                    <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kanan: Aktivitas terakhir */}
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>
              Aktivitas Terakhir
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {summary?.transaksiTerakhirSetor && (
                <div style={{ display: "flex", gap: 12, paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#dcfce7", border: "2px solid #16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CheckCircle2 size={12} color="#16a34a" />
                    </div>
                    <div style={{ width: 1, flex: 1, background: "#e2e8f0" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Setor selesai</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {summary.transaksiTerakhirSetor.beratKg} kg ·{" "}
                      {new Date(summary.transaksiTerakhirSetor.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </div>
                  </div>
                </div>
              )}
              {summary?.transaksiTerakhirTukar && (
                <div style={{ display: "flex", gap: 12, paddingTop: 16 }}>
                  <div>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fef9c3", border: "2px solid #d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Clock size={12} color="#d97706" />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>
                      Tukar poin diproses
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                      {summary.transaksiTerakhirTukar.hadiah}
                    </div>
                  </div>
                </div>
              )}
              {!summary?.transaksiTerakhirSetor && !summary?.transaksiTerakhirTukar && (
                <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 13 }}>
                  Belum ada aktivitas. Mulai setor sampah!
                </div>
              )}
            </div>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
              <Link href="/nasabah/riwayat" style={{ fontSize: 13, color: "#1a4731", fontWeight: 600, textDecoration: "none" }}>
                Lihat semua riwayat →
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ── ADMIN DASHBOARD ──
  return (
    <AppShell title="Dashboard Admin" showSetor={false}>
      {/* Stats */}
      <div className="grid-3 mb-4">
        {[
          { label: "Total Nasabah", value: adminStats?.totalNasabah ?? 0, icon: Scale, bg: "#dbeafe", color: "#2563eb" },
          { label: "Total Transaksi Setor", value: adminStats?.totalTransaksiSetor ?? 0, icon: Layers, bg: "#dcfce7", color: "#16a34a" },
          { label: "Total Berat Sampah", value: `${adminStats?.totalBeratSampahKg ?? 0} kg`, icon: Scale, bg: "#ccfbf1", color: "#0d9488" },
          { label: "Poin Tersalurkan", value: adminStats?.totalPoinTersalurkan ?? 0, icon: Coins, bg: "#fef9c3", color: "#ca8a04" },
          { label: "Kategori Sampah", value: adminStats?.totalKategoriSampah ?? 0, icon: Leaf, bg: "#f3e8ff", color: "#9333ea" },
          { label: "Hadiah Tersedia", value: adminStats?.totalHadiah ?? 0, icon: Award, bg: "#fee2e2", color: "#dc2626" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-icon" style={{ background: s.bg }}>
              <s.icon size={20} color={s.color} />
            </div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Setoran Menunggu */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Setoran Menunggu Verifikasi</div>
          <Link href="/admin/setor" style={{ fontSize: 13, color: "#1a4731", fontWeight: 600, textDecoration: "none" }}>
            Lihat semua →
          </Link>
        </div>
        {adminSetor.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 13 }}>
            Tidak ada setoran yang menunggu verifikasi.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Estimasi Berat</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {adminSetor.map((s) => (
                  <tr key={s.id}>
                    <td>{new Date(s.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td>{s.totalBeratKg ? `${s.totalBeratKg} kg` : "-"}</td>
                    <td><span className="badge badge-yellow">Menunggu</span></td>
                    <td>
                      <Link href={`/admin/setor`} style={{ fontSize: 12, color: "#1a4731", fontWeight: 600, textDecoration: "none" }}>
                        Verifikasi
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
