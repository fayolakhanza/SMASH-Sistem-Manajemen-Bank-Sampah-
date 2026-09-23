"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import AppShell from "@/components/AppShell";
import { dashboardApi } from "@/lib/api";
import {
  BarChart3,
  Recycle,
  Coins,
  TrendingUp,
  Calendar,
  Sparkles,
  Scale,
  Award,
  Wallet,
  Layers,
  FileSpreadsheet,
} from "lucide-react";

interface RekapResponse {
  periode: string;
  rekapitulasiTonase: {
    totalKg: number;
    totalTon: number;
    totalEstimasiPembayaranRupiah: number;
    totalPoinDiterbitkan: number;
  };
  breakdownJenisSampah: Record<
    string,
    {
      tonaseKg: number;
      rupiah: number;
      poin: number;
    }
  >;
  rekapitulasiPenukaranPoin: {
    totalTransaksiPenukaran: number;
    totalPoinTerpakai: number;
  };
}

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const CATEGORY_META: Record<
  string,
  { label: string; icon: string; color: string; bg: string; border: string }
> = {
  plastik: {
    label: "Sampah Plastik",
    icon: "🧃",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
  },
  kertas: {
    label: "Sampah Kertas & Karton",
    icon: "📦",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  logam: {
    label: "Sampah Logam & Kaleng",
    icon: "🥫",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  kaca: {
    label: "Sampah Kaca & Botol",
    icon: "🍾",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  organik: {
    label: "Sampah Organik",
    icon: "🍂",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
};

export default function AdminRekapitulasiPage() {
  const { user } = useAuth();
  const [bulan, setBulan] = useState(currentMonth());
  const [data, setData] = useState<RekapResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      dashboardApi
        .getRekapitulasi(`bulan=${bulan}`)
        .then((res: unknown) => {
          const r = res as { data: RekapResponse };
          setData(r.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, bulan]);

  const totalKg = data?.rekapitulasiTonase?.totalKg ?? 0;
  const totalTon = data?.rekapitulasiTonase?.totalTon ?? 0;
  const totalRupiah = data?.rekapitulasiTonase?.totalEstimasiPembayaranRupiah ?? 0;
  const totalPoinDiterbitkan = data?.rekapitulasiTonase?.totalPoinDiterbitkan ?? 0;
  const totalPoinDitukar = data?.rekapitulasiPenukaranPoin?.totalPoinTerpakai ?? 0;
  const totalTransaksiPenukaran = data?.rekapitulasiPenukaranPoin?.totalTransaksiPenukaran ?? 0;

  const stats = [
    {
      label: "Total Berat Terkumpul",
      value: `${totalKg.toFixed(1)} kg`,
      sub: totalTon > 0 ? `(${totalTon} Ton)` : "0.0 Ton",
      icon: TrendingUp,
      bg: "#dcfce7",
      color: "#16a34a",
    },
    {
      label: "Estimasi Nilai Sampah",
      value: `Rp ${Number(totalRupiah).toLocaleString("id-ID")}`,
      sub: "Valuasi sirkulasi ekonomi",
      icon: Wallet,
      bg: "#ecfdf5",
      color: "#059669",
    },
    {
      label: "Poin Diterbitkan",
      value: `+${Number(totalPoinDiterbitkan).toLocaleString("id-ID")}`,
      sub: "Reward setoran nasabah",
      icon: Coins,
      bg: "#fef9c3",
      color: "#ca8a04",
    },
    {
      label: "Poin Ditebus Nasabah",
      value: Number(totalPoinDitukar).toLocaleString("id-ID"),
      sub: "Poin ditukar voucher/hadiah",
      icon: Award,
      bg: "#ccfbf1",
      color: "#0d9488",
    },
    {
      label: "Klaim Penukaran Hadiah",
      value: `${totalTransaksiPenukaran} kali`,
      sub: "Total voucher dicairkan",
      icon: Recycle,
      bg: "#f3e8ff",
      color: "#9333ea",
    },
  ];

  const breakdownEntries = data?.breakdownJenisSampah
    ? Object.entries(data.breakdownJenisSampah)
    : [];

  const maxCategoryKg = Math.max(
    ...breakdownEntries.map(([, v]) => v.tonaseKg),
    1
  );

  const activeCategoriesCount = breakdownEntries.filter(
    ([, v]) => v.tonaseKg > 0
  ).length;

  return (
    <AppShell title="Rekapitulasi Bulanan">
      {/* Top Hero Banner */}
      <div
        className="card-hero-lime mb-8"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255, 255, 255, 0.16)",
              backdropFilter: "blur(4px)",
              padding: "5px 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.25)",
              marginBottom: 12,
            }}
          >
            <BarChart3 size={14} color="#86efac" />
            <span
              style={{
                color: "#dcfce7",
                fontSize: 11.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Laporan Kinerja Bulanan
            </span>
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: 6,
            }}
          >
            Rekapitulasi Periode {bulan}
          </div>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.85)",
              maxWidth: 540,
              lineHeight: 1.5,
            }}
          >
            Pantau ringkasan performa operasional bank sampah, volume tonase sampah per kategori, valuasi rupiah, dan sirkulasi perolehan poin bulanan.
          </p>
        </div>

        {/* Month Selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(4px)",
            padding: "8px 16px",
            borderRadius: 14,
            border: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <Calendar size={18} color="white" />
          <input
            type="month"
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontWeight: 700,
              fontSize: 14,
              outline: "none",
              cursor: "pointer",
            }}
          />
        </div>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "64px 0",
            color: "#64748b",
          }}
        >
          <div
            className="spin"
            style={{
              width: 36,
              height: 36,
              border: "3px solid #2d7a55",
              borderTopColor: "transparent",
              borderRadius: "50%",
              margin: "0 auto 12px",
            }}
          />
          Memuat data rekapitulasi...
        </div>
      ) : !data ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "64px 20px",
            color: "#64748b",
          }}
        >
          <BarChart3
            size={48}
            color="#cbd5e1"
            style={{ margin: "0 auto 12px" }}
          />
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
            Belum ada data transaksi untuk bulan ini
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards Grid with Modern Shadows */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 18,
              marginBottom: 28,
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="stat-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      className="stat-card-icon"
                      style={{ background: s.bg }}
                    >
                      <s.icon size={20} color={s.color} />
                    </div>
                  </div>
                  <div
                    className="stat-card-value"
                    style={{ fontSize: 22, fontWeight: 800 }}
                  >
                    {s.value}
                  </div>
                  <div className="stat-card-label" style={{ marginTop: 2 }}>
                    {s.label}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: "#64748b",
                    marginTop: 10,
                    paddingTop: 8,
                    borderTop: "1px dashed #f1f5f9",
                  }}
                >
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Breakdown per Kategori Sampah */}
          <div className="card mb-8">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 22,
                paddingBottom: 14,
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <Layers size={18} color="#2d7a55" />
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    Volume & Perolehan per Kategori Sampah
                  </h3>
                </div>
                <p style={{ fontSize: 12.5, color: "#64748b", margin: 0 }}>
                  Distribusi tonase aktual, nilai rupiah, dan perolehan poin yang telah disetor pada periode ini
                </p>
              </div>
              <span className="badge badge-green" style={{ fontSize: 12 }}>
                {activeCategoriesCount} Kategori Aktif
              </span>
            </div>

            {totalKg === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 20px",
                  color: "#64748b",
                }}
              >
                <Scale
                  size={42}
                  color="#cbd5e1"
                  style={{ margin: "0 auto 10px" }}
                />
                <div
                  style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}
                >
                  Belum ada setoran sampah pada periode bulan {bulan}
                </div>
                <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                  Transaksi setoran yang telah dicatat dan diverifikasi akan otomatis terakumulasi di sini.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 18,
                }}
              >
                {breakdownEntries.map(([key, item]) => {
                  const meta = CATEGORY_META[key] || {
                    label: `Sampah ${key.charAt(0).toUpperCase() + key.slice(1)}`,
                    icon: "♻️",
                    color: "#0f766e",
                    bg: "#f0fdfa",
                    border: "#99f6e4",
                  };
                  const pct =
                    maxCategoryKg > 0
                      ? Math.min(
                          100,
                          Math.round((item.tonaseKg / maxCategoryKg) * 100)
                        )
                      : 0;

                  return (
                    <div
                      key={key}
                      style={{
                        padding: 18,
                        borderRadius: 16,
                        border: `1px solid ${item.tonaseKg > 0 ? meta.border : "#f1f5f9"}`,
                        background: item.tonaseKg > 0 ? meta.bg : "#fafafa",
                        boxShadow:
                          item.tonaseKg > 0
                            ? "0 4px 14px rgba(0, 0, 0, 0.03)"
                            : "none",
                        opacity: item.tonaseKg > 0 ? 1 : 0.65,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 22,
                              lineHeight: 1,
                            }}
                          >
                            {meta.icon}
                          </span>
                          <div>
                            <div
                              style={{
                                fontWeight: 800,
                                fontSize: 14.5,
                                color: "#0f172a",
                                textTransform: "capitalize",
                              }}
                            >
                              {meta.label}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "#64748b",
                                marginTop: 1,
                              }}
                            >
                              {item.tonaseKg > 0
                                ? `${item.tonaseKg.toFixed(1)} kg (${(item.tonaseKg / 1000).toFixed(4)} Ton)`
                                : "Belum ada setoran"}
                            </div>
                          </div>
                        </div>

                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: 16,
                            color: meta.color,
                          }}
                        >
                          {item.tonaseKg.toFixed(1)} kg
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div
                        className="progress-bar"
                        style={{
                          height: 8,
                          background: "rgba(0,0,0,0.06)",
                          marginBottom: 14,
                        }}
                      >
                        <div
                          className="progress-fill"
                          style={{
                            width: `${pct}%`,
                            background: meta.color,
                          }}
                        />
                      </div>

                      {/* Financial & Point Details */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 10,
                          paddingTop: 10,
                          borderTop: "1px dashed rgba(0,0,0,0.08)",
                          fontSize: 12,
                        }}
                      >
                        <div>
                          <div style={{ color: "#64748b", fontSize: 11 }}>
                            Nilai Rupiah
                          </div>
                          <div
                            style={{
                              fontWeight: 700,
                              color: "#0f172a",
                              marginTop: 2,
                            }}
                          >
                            Rp {Math.round(item.rupiah).toLocaleString("id-ID")}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: "#64748b", fontSize: 11 }}>
                            Poin Diterbitkan
                          </div>
                          <div
                            style={{
                              fontWeight: 700,
                              color: meta.color,
                              marginTop: 2,
                            }}
                          >
                            +{Math.round(item.poin).toLocaleString("id-ID")} Pts
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </AppShell>
  );
}