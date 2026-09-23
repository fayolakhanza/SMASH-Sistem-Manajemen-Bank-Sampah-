"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { hadiahApi, penukaranApi } from "@/lib/api";
import AppShell from "@/components/AppShell";
import Link from "next/link";
import {
  Coins,
  Package,
  AlertCircle,
  CheckCircle,
  Gift,
  Sparkles,
  Ticket,
  ArrowRight,
  Plus,
} from "lucide-react";

interface Hadiah {
  id: string;
  namaHadiah: string;
  deskripsi?: string;
  poinDibutuhkan: number;
  stok: number;
  foto?: string;
}

export default function HadiahPage() {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [hadiah, setHadiah] = useState<Hadiah[]>([]);
  const [loading, setLoading] = useState(true);
  const [tukarId, setTukarId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/auth/login");
    if (user) {
      hadiahApi
        .getAll()
        .then((res: unknown) => {
          const r = res as { data: Hadiah[] };
          setHadiah(r.data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, isLoading, router]);

  async function handleTukar(h: Hadiah) {
    setError(null);
    setTukarId(h.id);
    try {
      await penukaranApi.tukar({ hadiahId: h.id });
      setSuccessId(h.id);
      await refreshUser();
      setTimeout(() => setSuccessId(null), 3500);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Penukaran poin gagal.");
    } finally {
      setTukarId(null);
    }
  }

  const saldo = user?.nasabah?.saldoPoin ?? 0;

  return (
    <AppShell title="Tukar Poin Reward">
      {/* Saldo Poin Hero Banner */}
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
            <Coins size={14} color="#86efac" />
            <span
              style={{
                color: "#dcfce7",
                fontSize: 11.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Saldo Anda
            </span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#ffffff" }}>
            {saldo.toLocaleString("id-ID")}{" "}
            <span style={{ fontSize: 18, fontWeight: 600, color: "#86efac" }}>
              Poin Tersedia
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.85)",
              marginTop: 6,
              maxWidth: 480,
            }}
          >
            Gunakan poin hasil setor sampahmu untuk ditukar dengan voucher langganan dan hadiah eksklusif.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/nasabah/setor"
            className="btn-primary"
            style={{
              background: "white",
              color: "#1a4731",
              padding: "12px 20px",
              fontSize: 13.5,
              fontWeight: 800,
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Plus size={16} /> Kumpulkan Poin Lagi
          </Link>
          <Link
            href="/nasabah/penukaran"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 20px",
              borderRadius: 10,
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(4px)",
              color: "white",
              fontWeight: 700,
              fontSize: 13.5,
              textDecoration: "none",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Ticket size={16} /> Riwayat Penukaran
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#64748b" }}>
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
          Memuat katalog hadiah...
        </div>
      ) : hadiah.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: "center", padding: "64px 20px", color: "#64748b" }}
        >
          <Gift size={48} color="#cbd5e1" style={{ margin: "0 auto 12px" }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
            Belum ada hadiah tersedia saat ini.
          </div>
        </div>
      ) : (
        /* Hadiah Multi-Dimensional Card Grid */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {hadiah.map((h) => {
            const cukup = saldo >= h.poinDibutuhkan;
            const habis = h.stok === 0;
            const isDone = successId === h.id;

            return (
              <div
                key={h.id}
                className="card card-interactive"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  opacity: habis ? 0.65 : 1,
                  border: isDone ? "2px solid #22c55e" : undefined,
                }}
              >
                {/* Visual Header */}
                <div
                  style={{
                    height: 150,
                    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {h.foto ? (
                    <img
                      src={h.foto}
                      alt={h.namaHadiah}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 6px 16px rgba(22, 163, 74, 0.15)",
                      }}
                    >
                      <Gift size={32} color="#16a34a" />
                    </div>
                  )}

                  {/* Stock Badge Overlay */}
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: habis ? "rgba(239, 68, 68, 0.9)" : "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(4px)",
                      color: habis ? "white" : "#1e293b",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 999,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    }}
                  >
                    {habis ? "Stok Habis" : `Stok: ${h.stok}`}
                  </span>
                </div>

                {/* Card Content Body */}
                <div style={{ padding: "20px 22px 24px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3
                      style={{
                        fontWeight: 800,
                        fontSize: 16,
                        color: "#0f172a",
                        marginBottom: 6,
                        lineHeight: 1.3,
                      }}
                    >
                      {h.namaHadiah}
                    </h3>
                    <p
                      style={{
                        fontSize: 12.5,
                        color: "#64748b",
                        marginBottom: 16,
                        lineHeight: 1.5,
                        minHeight: 38,
                      }}
                    >
                      {h.deskripsi || "Voucher digital resmi yang bisa langsung digunakan setelah penukaran disetujui."}
                    </p>
                  </div>

                  {/* Points & Action Area */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 14,
                        padding: "10px 14px",
                        background: "#fffbeb",
                        borderRadius: 12,
                        border: "1px solid #fef3c7",
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#92400e" }}>
                        Poin Diperlukan
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontWeight: 800,
                          color: "#d97706",
                          fontSize: 16,
                        }}
                      >
                        <Coins size={16} />
                        {h.poinDibutuhkan.toLocaleString("id-ID")}
                      </span>
                    </div>

                    {isDone ? (
                      <div
                        style={{
                          padding: "12px",
                          background: "#dcfce7",
                          borderRadius: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          fontSize: 13,
                          color: "#15803d",
                          fontWeight: 700,
                          boxShadow: "0 2px 8px rgba(34, 197, 94, 0.2)",
                        }}
                      >
                        <CheckCircle size={16} /> Penukaran Berhasil!
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTukar(h)}
                        disabled={!cukup || habis || tukarId === h.id}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: 12,
                          border: "none",
                          cursor: cukup && !habis ? "pointer" : "not-allowed",
                          background:
                            cukup && !habis
                              ? "var(--sidebar-bg)"
                              : "#f1f5f9",
                          color: cukup && !habis ? "white" : "#94a3b8",
                          fontWeight: 700,
                          fontSize: 13.5,
                          fontFamily: "inherit",
                          transition: "all 0.15s ease",
                          boxShadow:
                            cukup && !habis
                              ? "0 4px 14px rgba(26, 71, 49, 0.25)"
                              : "none",
                        }}
                      >
                        {tukarId === h.id
                          ? "Memproses Penukaran..."
                          : habis
                          ? "Stok Habis"
                          : !cukup
                          ? `Kurang ${h.poinDibutuhkan - saldo} Poin`
                          : "Tukar Poin Sekarang"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}