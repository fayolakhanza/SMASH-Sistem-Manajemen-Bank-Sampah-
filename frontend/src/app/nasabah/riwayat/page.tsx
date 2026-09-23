"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { setorApi } from "@/lib/api";
import AppShell from "@/components/AppShell";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  History,
  Coins,
  Scale,
  Calendar,
  Layers,
  ArrowRight,
  FileDown,
  Printer,
} from "lucide-react";
import Link from "next/link";
import { generateStrukSetorPDF, StrukSetorData } from "@/lib/pdf-generator";

interface SetorItem {
  id: string;
  kodeSetor: string;
  tanggal: string;
  status: string;
  totalBeratKg?: number;
  totalPoin?: number;
  estimasiTotalPoin?: number;
  catatan?: string;
  catatanAdmin?: string;
  fotoBukti?: string;
  nasabah?: {
    namaNasabah: string;
    alamat?: string;
    telp?: string;
  };
  detailSetors?: {
    namaKategori?: string;
    kategori?: string;
    kategoriSampahId?: string;
    beratKg?: number;
    berat?: number;
    poinPerKg?: number;
    subtotalPoin?: number;
    kategoriSampah?: { namaKategori: string; poinPerKg: number };
  }[];
}

function getSetorStatus(statusStr?: string) {
  const s = (statusStr || "").toUpperCase();
  if (s.includes("VERIFIKASI") || s.includes("SELESAI") || s.includes("SUKSES") || s.includes("APPROVED")) {
    return { label: "Terverifikasi", cls: "badge badge-green", icon: CheckCircle2 };
  }
  if (s.includes("TOLAK") || s.includes("REJECT") || s.includes("BATAL")) {
    return { label: "Ditolak", cls: "badge badge-red", icon: XCircle };
  }
  return { label: "Menunggu Konfirmasi", cls: "badge badge-yellow", icon: Clock };
}

export default function RiwayatPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<SetorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/auth/login");
    if (user) {
      setorApi
        .getMySetor()
        .then((res: unknown) => {
          const r = res as { data: SetorItem[] };
          setData(r.data || []);
          setLoading(false);
        })
        .catch(() => {
          setError("Gagal memuat riwayat.");
          setLoading(false);
        });
    }
  }, [user, isLoading, router]);

  async function handleDownloadPDF(s: SetorItem) {
    setDownloadingId(s.id);
    try {
      const res: unknown = await setorApi.getById(s.id);
      const r = res as { data: StrukSetorData };
      if (r.data) {
        generateStrukSetorPDF(r.data);
      } else {
        const fallbackBerat =
          s.totalBeratKg && s.totalBeratKg > 0
            ? s.totalBeratKg
            : s.detailSetors?.reduce((a, d) => a + (d.beratKg || d.berat || 0), 0) || 0;
        const fallbackPoin =
          s.totalPoin ||
          s.estimasiTotalPoin ||
          s.detailSetors?.reduce((a, d) => a + (d.subtotalPoin || 0), 0) ||
          0;
        generateStrukSetorPDF({
          kodeSetor: s.kodeSetor,
          tanggal: s.tanggal,
          nasabah: s.nasabah || { namaNasabah: user?.username || "Nasabah" },
          status: s.status,
          totalBeratKg: fallbackBerat,
          totalPoin: fallbackPoin,
          catatanAdmin: s.catatanAdmin || s.catatan,
          detailSetors: s.detailSetors,
        });
      }
    } catch {
      const fallbackBerat =
        s.totalBeratKg && s.totalBeratKg > 0
          ? s.totalBeratKg
          : s.detailSetors?.reduce((a, d) => a + (d.beratKg || d.berat || 0), 0) || 0;
      const fallbackPoin =
        s.totalPoin ||
        s.estimasiTotalPoin ||
        s.detailSetors?.reduce((a, d) => a + (d.subtotalPoin || 0), 0) ||
        0;
      generateStrukSetorPDF({
        kodeSetor: s.kodeSetor,
        tanggal: s.tanggal,
        nasabah: s.nasabah || { namaNasabah: user?.username || "Nasabah" },
        status: s.status,
        totalBeratKg: fallbackBerat,
        totalPoin: fallbackPoin,
        catatanAdmin: s.catatanAdmin || s.catatan,
        detailSetors: s.detailSetors,
      });
    } finally {
      setDownloadingId(null);
    }
  }

  const totalPoinDiterima = data
    .filter((d) => (d.status || "").toUpperCase().includes("VERIFIKASI"))
    .reduce((acc, curr) => acc + (curr.totalPoin || 0), 0);

  const totalKgDisetor = data.reduce((acc, curr) => {
    const w =
      curr.totalBeratKg && curr.totalBeratKg > 0
        ? curr.totalBeratKg
        : curr.detailSetors?.reduce((a, d) => a + (d.beratKg || d.berat || 0), 0) || 0;
    return acc + w;
  }, 0);

  return (
    <AppShell title="Riwayat Penyetoran">
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
            <History size={14} color="#86efac" />
            <span
              style={{
                color: "#dcfce7",
                fontSize: 11.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Aktivitas Bank Sampah
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", marginBottom: 6 }}>
            {data.length} Transaksi Penyetoran
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", maxWidth: 520, lineHeight: 1.5 }}>
            Pantau status verifikasi sampah yang kamu setorkan, estimasi poin, dan unduh struk resmi PDF setelah diverifikasi.
          </p>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
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
              Total Berat
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: 6 }}>
              <Scale size={18} color="#86efac" /> {totalKgDisetor.toFixed(1)} kg
            </div>
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
              Poin Diterima
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fef08a", display: "flex", alignItems: "center", gap: 6 }}>
              <Coins size={18} color="#fde047" /> +{totalPoinDiterima.toLocaleString("id-ID")}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#64748b" }}>
          <div className="spin" style={{ width: 36, height: 36, border: "3px solid #2d7a55", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 12px" }} />
          Memuat data riwayat...
        </div>
      ) : error ? (
        <div className="alert alert-error"><AlertCircle size={15} />{error}</div>
      ) : data.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 20px", color: "#64748b" }}>
          <History size={48} color="#cbd5e1" style={{ margin: "0 auto 14px" }} />
          <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
            Belum ada riwayat penyetoran
          </div>
          <p style={{ fontSize: 13, color: "#64748b", maxWidth: 420, margin: "0 auto 20px" }}>
            Kamu belum pernah mengajukan penyetoran sampah daur ulang. Mulai kumpulkan sampah dan tukarkan dengan poin!
          </p>
          <Link href="/nasabah/setor" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            Setor Sampah Sekarang <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Kode Setor</th>
                <th>Tanggal</th>
                <th>Total Berat</th>
                <th>Perolehan Poin</th>
                <th>Status</th>
                <th>Catatan Petugas</th>
                <th style={{ textAlign: "center" }}>Struk / Dokumen</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s) => {
                const st = getSetorStatus(s.status);
                const Icon = st.icon;
                const isVerified = (s.status || "").toUpperCase().includes("VERIFIKASI");
                const totalBerat =
                  s.totalBeratKg && s.totalBeratKg > 0
                    ? s.totalBeratKg
                    : s.detailSetors?.reduce((a, d) => a + (d.beratKg || d.berat || 0), 0) || 0;
                const poin =
                  s.totalPoin ||
                  s.estimasiTotalPoin ||
                  s.detailSetors?.reduce((a, d) => a + (d.subtotalPoin || 0), 0) ||
                  0;
                const isDownloading = downloadingId === s.id;

                return (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontFamily: "monospace", fontWeight: 800, color: "#1a4731", fontSize: 13.5 }}>
                        {s.kodeSetor}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#334155", fontSize: 13 }}>
                        <Calendar size={14} color="#94a3b8" />
                        {new Date(s.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 13.5 }}>
                        {totalBerat > 0 ? `${totalBerat.toFixed(1)} kg` : "-"}
                      </span>
                      {s.detailSetors && s.detailSetors.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                          {s.detailSetors.map((d, idx) => {
                            const nama =
                              d.namaKategori ||
                              d.kategori ||
                              d.kategoriSampah?.namaKategori ||
                              "Sampah";
                            const w = (d.beratKg || d.berat || 0).toFixed(1);
                            return (
                              <span
                                key={idx}
                                style={{
                                  fontSize: 11,
                                  background: "#f1f5f9",
                                  color: "#1e293b",
                                  padding: "2px 7px",
                                  borderRadius: 6,
                                  fontWeight: 600,
                                  border: "1px solid #e2e8f0",
                                }}
                              >
                                {nama} ({w} kg)
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontWeight: 800,
                          fontSize: 13.5,
                          color: isVerified ? "#16a34a" : "#d97706",
                        }}
                      >
                        <Coins size={14} />
                        {poin > 0 ? `+${poin.toLocaleString("id-ID")}` : "0"} Poin
                      </div>
                      {!isVerified && (
                        <div style={{ fontSize: 10.5, color: "#94a3b8", marginTop: 2 }}>
                          (Estimasi)
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={st.cls} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <Icon size={12} />
                        {st.label}
                      </span>
                    </td>
                    <td style={{ color: "#64748b", fontSize: 12.5, maxWidth: 180 }}>
                      {s.catatanAdmin || s.catatan || "-"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {isVerified ? (
                        <button
                          onClick={() => handleDownloadPDF(s)}
                          disabled={isDownloading}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "6px 12px",
                            background: "#f0fdf4",
                            color: "#166534",
                            border: "1px solid #86efac",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                          title="Unduh Struk Resmi PDF"
                        >
                          <FileDown size={14} color="#16a34a" />
                          {isDownloading ? "Mengunduh..." : "Struk PDF"}
                        </button>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}