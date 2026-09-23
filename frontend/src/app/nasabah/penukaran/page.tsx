"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { penukaranApi } from "@/lib/api";
import AppShell from "@/components/AppShell";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Tag,
  AlertCircle,
  Gift,
  Coins,
  Calendar,
  ArrowRight,
  FileDown,
} from "lucide-react";
import Link from "next/link";
import { generateStrukPenukaranPDF, StrukPenukaranData } from "@/lib/pdf-generator";

interface Penukaran {
  id: string;
  kodePenukaran: string;
  tanggal: string;
  poinTerpakai: number;
  status: string;
  kodeVoucher?: string;
  nasabah?: {
    namaNasabah: string;
    telp?: string;
  };
  hadiah?: {
    namaHadiah: string;
    poinDibutuhkan?: number;
    deskripsi?: string;
  };
}

function getPenukaranStatus(statusStr?: string) {
  const s = (statusStr || "").toUpperCase();
  if (s.includes("SELESAI") || s.includes("SUKSES") || s.includes("APPROVED")) {
    return { label: "Selesai", cls: "badge badge-green", icon: CheckCircle2 };
  }
  if (s.includes("TOLAK") || s.includes("REJECT") || s.includes("BATAL")) {
    return { label: "Ditolak", cls: "badge badge-red", icon: XCircle };
  }
  if (s.includes("PROSES")) {
    return { label: "Diproses", cls: "badge badge-blue", icon: Clock };
  }
  return { label: "Menunggu", cls: "badge badge-yellow", icon: Clock };
}

export default function PenukaranPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Penukaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/auth/login");
    if (user) {
      penukaranApi
        .getMyPenukaran()
        .then((res: unknown) => {
          const r = res as { data: Penukaran[] };
          setData(r.data || []);
          setLoading(false);
        })
        .catch(() => {
          setError("Gagal memuat riwayat penukaran.");
          setLoading(false);
        });
    }
  }, [user, isLoading, router]);

  async function handleDownloadPDF(p: Penukaran) {
    setDownloadingId(p.id);
    try {
      const res: unknown = await penukaranApi.getNota(p.id);
      const r = res as { data: StrukPenukaranData };
      if (r.data) {
        generateStrukPenukaranPDF(r.data);
      } else {
        generateStrukPenukaranPDF({
          kodePenukaran: p.kodePenukaran,
          tanggal: p.tanggal,
          nasabah: p.nasabah || { namaNasabah: user?.username || "Nasabah" },
          hadiah: p.hadiah || { namaHadiah: "Voucher Hadiah" },
          poinTerpakai: p.poinTerpakai,
          status: p.status,
          kodeVoucher: p.kodeVoucher,
        });
      }
    } catch {
      generateStrukPenukaranPDF({
        kodePenukaran: p.kodePenukaran,
        tanggal: p.tanggal,
        nasabah: p.nasabah || { namaNasabah: user?.username || "Nasabah" },
        hadiah: p.hadiah || { namaHadiah: "Voucher Hadiah" },
        poinTerpakai: p.poinTerpakai,
        status: p.status,
        kodeVoucher: p.kodeVoucher,
      });
    } finally {
      setDownloadingId(null);
    }
  }

  const totalPoinTerklaim = data.reduce((acc, curr) => acc + (curr.poinTerpakai || 0), 0);

  return (
    <AppShell title="Riwayat Penukaran Poin">
      {/* Top Banner Hero */}
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
            <Gift size={14} color="#86efac" />
            <span
              style={{
                color: "#dcfce7",
                fontSize: 11.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Klaim & Voucher
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", marginBottom: 6 }}>
            {data.length} Hadiah Ditukarkan
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", maxWidth: 520, lineHeight: 1.5 }}>
            Pantau kode voucher dan unduh struk klaim resmi reward (PDF) dari penukaran poin saldo sampahmu.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "14px 20px",
            borderRadius: 16,
            minWidth: 140,
          }}
        >
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.8)", fontWeight: 600, marginBottom: 4 }}>
            Poin Ditukarkan
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fef08a", display: "flex", alignItems: "center", gap: 6 }}>
            <Coins size={18} color="#fde047" /> {totalPoinTerklaim.toLocaleString("id-ID")}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#64748b" }}>
          <div className="spin" style={{ width: 36, height: 36, border: "3px solid #2d7a55", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 12px" }} />
          Memuat data penukaran...
        </div>
      ) : error ? (
        <div className="alert alert-error"><AlertCircle size={15} />{error}</div>
      ) : data.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 20px", color: "#64748b" }}>
          <Gift size={48} color="#cbd5e1" style={{ margin: "0 auto 14px" }} />
          <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
            Belum ada penukaran hadiah
          </div>
          <p style={{ fontSize: 13, color: "#64748b", maxWidth: 420, margin: "0 auto 20px" }}>
            Tukarkan saldo poin hasil penyetoran sampahmu dengan voucher menarik di katalog hadiah!
          </p>
          <Link href="/nasabah/hadiah" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            Buka Katalog Hadiah <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {data.map((p) => {
            const st = getPenukaranStatus(p.status);
            const Icon = st.icon;
            const isDownloading = downloadingId === p.id;

            return (
              <div
                key={p.id}
                className="card card-interactive"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                  padding: "18px 22px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#1a4731", fontSize: 13 }}>
                      {p.kodePenukaran}
                    </span>
                    <span style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                      <Calendar size={13} />
                      {new Date(p.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", marginBottom: 6 }}>
                    {p.hadiah?.namaHadiah || "Hadiah / Voucher Reward"}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 13, color: "#d97706", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                      <Coins size={14} /> {p.poinTerpakai.toLocaleString("id-ID")} Poin
                    </div>

                    {p.kodeVoucher && (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 12px",
                          background: "#f0fdf4",
                          border: "1px dashed #86efac",
                          borderRadius: 8,
                        }}
                      >
                        <Tag size={13} color="#16a34a" />
                        <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#15803d", fontSize: 13 }}>
                          {p.kodeVoucher}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span className={st.cls} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", fontSize: 12.5 }}>
                    <Icon size={13} />
                    {st.label}
                  </span>

                  {!p.status.toUpperCase().includes("TOLAK") && (
                    <button
                      onClick={() => handleDownloadPDF(p)}
                      disabled={isDownloading}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 14px",
                        background: "#f0fdf4",
                        color: "#166534",
                        border: "1px solid #86efac",
                        borderRadius: 10,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                      title="Unduh Struk Voucher PDF"
                    >
                      <FileDown size={14} color="#16a34a" />
                      {isDownloading ? "Mengunduh..." : "Struk PDF"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}


