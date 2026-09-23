"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import AppShell from "@/components/AppShell";
import { setorApi, kategoriApi } from "@/lib/api";
import {
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Scale,
  Sparkles,
  User,
  Image as ImageIcon,
  Check,
  X,
  Layers,
  Coins,
  FileText,
} from "lucide-react";
import Modal from "@/components/admin/modal";

interface Kategori {
  id: string;
  namaKategori: string;
  poinPerKg: number;
  hargaPerKg: number;
}

interface SetorItem {
  kategoriSampahId: string;
  namaKategori?: string;
  berat: number;
  beratKg?: number;
  poinPerKg?: number;
}

interface Pengajuan {
  id: string;
  kodeSetor: string;
  tanggal: string;
  status: string;
  catatan?: string;
  catatanAdmin?: string;
  fotoBukti?: string;
  totalBeratKg?: number;
  totalPoin?: number;
  estimasiTotalPoin?: number;
  nasabah?: { namaNasabah: string; username?: string; telp?: string };
  items?: SetorItem[];
  detailSetors?: {
    id?: string;
    kategoriSampahId: string;
    beratKg: number;
    berat?: number;
    poinPerKg?: number;
    namaKategori?: string;
    kategoriSampah?: { namaKategori: string; poinPerKg: number };
  }[];
}

function getStatusBadge(statusStr: string) {
  const s = (statusStr || "").toUpperCase();
  if (s.includes("VERIFIKASI") || s.includes("SELESAI") || s.includes("SUKSES")) {
    return { label: "Terverifikasi", cls: "badge badge-green", icon: CheckCircle2 };
  }
  if (s.includes("TOLAK")) {
    return { label: "Ditolak", cls: "badge badge-red", icon: XCircle };
  }
  return { label: "Menunggu Verifikasi", cls: "badge badge-yellow", icon: Clock };
}

export default function AdminSetorPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Pengajuan[]>([]);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"MENUNGGU" | "SEMUA">("MENUNGGU");
  const [modalItem, setModalItem] = useState<Pengajuan | null>(null);
  const [beratReal, setBeratReal] = useState<Record<string, number>>({});
  const [catatanAdmin, setCatatanAdmin] = useState("Berat sampah telah diverifikasi sesuai hasil timbangan aktual.");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setorApi
      .getAdminList(tab === "MENUNGGU" ? "status=MENUNGGU" : undefined)
      .then((res: unknown) => {
        const r = res as { data: Pengajuan[] };
        setData(r.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    if (user) {
      load();
      kategoriApi.getAll().then((res: unknown) => {
        const r = res as { data: Kategori[] };
        setKategori(r.data || []);
      });
    }
  }, [user, tab]);

  function getNormalizedItems(p: Pengajuan): SetorItem[] {
    if (p.items && p.items.length > 0) return p.items;
    if (p.detailSetors && p.detailSetors.length > 0) {
      return p.detailSetors.map((d) => ({
        kategoriSampahId: d.kategoriSampahId,
        namaKategori: d.namaKategori || d.kategoriSampah?.namaKategori,
        berat: d.berat ?? d.beratKg ?? 0,
        poinPerKg: d.poinPerKg ?? d.kategoriSampah?.poinPerKg,
      }));
    }
    return [];
  }

  async function openVerify(p: Pengajuan) {
    setModalItem(p);
    setCatatanAdmin("Berat sampah telah diverifikasi sesuai hasil timbangan aktual.");
    setError(null);

    // Populate from current p first
    const initial: Record<string, number> = {};
    const items = getNormalizedItems(p);
    items.forEach((it) => (initial[it.kategoriSampahId] = it.berat || 0));
    setBeratReal(initial);

    // Fetch latest detail from backend to get fresh categories & details
    try {
      const res: unknown = await setorApi.getById(p.id);
      const r = res as { data: Pengajuan };
      if (r.data) {
        setModalItem(r.data);
        const detailedItems = getNormalizedItems(r.data);
        const updatedInitial: Record<string, number> = {};
        detailedItems.forEach((it) => (updatedInitial[it.kategoriSampahId] = it.berat || 0));
        setBeratReal(updatedInitial);
      }
    } catch {
      // ignore
    }
  }

  function estimasiPoin(items: SetorItem[], berat: Record<string, number>) {
    return items.reduce((acc, it) => {
      const kat = kategori.find((k) => k.id === it.kategoriSampahId);
      const rate = kat?.poinPerKg ?? it.poinPerKg ?? 10;
      const w = berat[it.kategoriSampahId] !== undefined ? berat[it.kategoriSampahId] : (it.berat || 0);
      return acc + Math.round(rate * w);
    }, 0);
  }

  async function handleVerify(status: "diverifikasi" | "ditolak") {
    if (!modalItem) return;
    setError(null);
    setSaving(true);
    try {
      const items = getNormalizedItems(modalItem);
      const itemsReal = items.map((it) => ({
        kategoriSampahId: it.kategoriSampahId,
        beratKgReal: Number(beratReal[it.kategoriSampahId] !== undefined ? beratReal[it.kategoriSampahId] : it.berat || 0),
      }));

      await setorApi.verify(modalItem.id, {
        status,
        catatanAdmin: catatanAdmin.trim() || (status === "ditolak" ? "Penyetoran ditolak." : "Berat sampah telah diverifikasi."),
        itemsReal: itemsReal.length > 0 ? itemsReal : undefined,
      });
      setModalItem(null);
      load();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Gagal memverifikasi setoran.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell title="Verifikasi Timbangan">
      {/* Top Banner Info */}
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
            <Truck size={14} color="#86efac" />
            <span
              style={{
                color: "#dcfce7",
                fontSize: 11.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Pos Penimbangan
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", marginBottom: 6 }}>
            Verifikasi Setoran Nasabah
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", maxWidth: 520, lineHeight: 1.5 }}>
            Timbang berat aktual fisik sampah yang dibawa nasabah, lalu konfirmasi untuk otomatis menyalurkan poin ke saldo nasabah.
          </p>
        </div>

        {/* Tab Buttons */}
        <div
          style={{
            display: "flex",
            gap: 8,
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(4px)",
            padding: "6px",
            borderRadius: 14,
            border: "1px solid rgba(255, 255, 255, 0.25)",
          }}
        >
          <button
            onClick={() => setTab("MENUNGGU")}
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              transition: "all 0.15s ease",
              background: tab === "MENUNGGU" ? "white" : "transparent",
              color: tab === "MENUNGGU" ? "#1a4731" : "white",
              boxShadow: tab === "MENUNGGU" ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
            }}
          >
            Menunggu Verifikasi
          </button>
          <button
            onClick={() => setTab("SEMUA")}
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              transition: "all 0.15s ease",
              background: tab === "SEMUA" ? "white" : "transparent",
              color: tab === "SEMUA" ? "#1a4731" : "white",
              boxShadow: tab === "SEMUA" ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
            }}
          >
            Semua Riwayat
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#64748b" }}>
          <div className="spin" style={{ width: 36, height: 36, border: "3px solid #2d7a55", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 12px" }} />
          Memuat data setoran...
        </div>
      ) : data.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 20px", color: "#64748b" }}>
          <Truck size={48} color="#cbd5e1" style={{ margin: "0 auto 12px" }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
            {tab === "MENUNGGU" ? "Tidak ada antrean menunggu verifikasi" : "Belum ada riwayat penyetoran"}
          </div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            {tab === "MENUNGGU" ? "Semua pengajuan setor sampah nasabah telah diverifikasi." : "Data penyetoran akan muncul saat nasabah mengajukan setoran."}
          </div>
        </div>
      ) : (
        /* Modern Cards for submissions */
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {data.map((p) => {
            const status = getStatusBadge(p.status);
            const StatusIcon = status.icon;
            const items = getNormalizedItems(p);
            const itemCount = items.length || p.detailSetors?.length || 1;
            const isMenunggu = p.status.toUpperCase().includes("MENUNGGU");

            return (
              <div
                key={p.id}
                className="card card-interactive"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 16,
                  padding: 22,
                }}
              >
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <Truck size={24} color="#166534" />
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 800, color: "#1a4731" }}>
                        {p.kodeSetor}
                      </span>
                      <span className={status.cls} style={{ fontSize: 11 }}>
                        <StatusIcon size={12} /> {status.label}
                      </span>
                    </div>

                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                      {p.nasabah?.namaNasabah || "Nasabah"}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {new Date(p.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} · {itemCount} item sampah
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {p.fotoBukti && (
                    <a
                      href={p.fotoBukti}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        color: "#2563eb",
                        fontWeight: 600,
                        textDecoration: "none",
                        background: "#eff6ff",
                        padding: "6px 12px",
                        borderRadius: 8,
                      }}
                    >
                      <ImageIcon size={14} /> Lihat Foto
                    </a>
                  )}

                  {isMenunggu ? (
                    <button
                      onClick={() => openVerify(p)}
                      className="btn-primary"
                      style={{ padding: "10px 18px", fontSize: 13 }}
                    >
                      <Scale size={15} /> Verifikasi Timbangan
                    </button>
                  ) : (
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Total Poin</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#166534", display: "flex", alignItems: "center", gap: 4 }}>
                        <Coins size={14} /> +{(p.totalPoin || 0).toLocaleString("id-ID")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Verification Modal */}
      <Modal
        open={!!modalItem}
        onClose={() => setModalItem(null)}
        title={`Verifikasi ${modalItem?.kodeSetor ?? ""}`}
        subtitle="Periksa bukti fisik dan timbang berat aktual sampah untuk menyalurkan poin ke saldo nasabah."
        maxWidth="max-w-2xl"
      >
        {modalItem && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {error && (
              <div className="alert alert-error">
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            {modalItem.fotoBukti && (
              <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                <img
                  src={modalItem.fotoBukti}
                  alt="Bukti Foto"
                  style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
                />
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, background: "#f8fafc", padding: "12px 14px", borderRadius: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Nama Nasabah</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>
                  {modalItem.nasabah?.namaNasabah || "Nasabah"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Tanggal Pengajuan</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>
                  {new Date(modalItem.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
            </div>

            {modalItem.catatan && (
              <div style={{ fontSize: 12.5, color: "#475569", background: "#f0fdf4", border: "1px solid #dcfce7", padding: "10px 14px", borderRadius: 10 }}>
                <strong style={{ color: "#166534" }}>Catatan Nasabah:</strong> {modalItem.catatan}
              </div>
            )}

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <Scale size={16} color="#2d7a55" /> Input Berat Real Hasil Timbangan Petugas (kg)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {getNormalizedItems(modalItem).map((it) => {
                  const kat = kategori.find((k) => k.id === it.kategoriSampahId);
                  const rate = kat?.poinPerKg ?? it.poinPerKg ?? 10;
                  const currentWeight = beratReal[it.kategoriSampahId] !== undefined ? beratReal[it.kategoriSampahId] : (it.berat || 0);
                  const subtotal = Math.round(currentWeight * rate);
                  const namaKategori = kat?.namaKategori || it.namaKategori || "Kategori Sampah";

                  return (
                    <div
                      key={it.kategoriSampahId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        background: "#f8fafc",
                        borderRadius: 12,
                        border: "1.5px solid #e2e8f0",
                        gap: 12,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>
                          {namaKategori}
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>
                          Estimasi nasabah: {it.berat || 0} kg · Nilai: {rate} poin/kg
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={currentWeight}
                            onChange={(e) =>
                              setBeratReal({
                                ...beratReal,
                                [it.kategoriSampahId]: parseFloat(e.target.value) || 0,
                              })
                            }
                            style={{
                              width: 80,
                              padding: "7px 10px",
                              border: "1.5px solid #2d7a55",
                              borderRadius: 8,
                              fontSize: 14,
                              fontWeight: 800,
                              textAlign: "center",
                              outline: "none",
                              background: "white",
                            }}
                          />
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>kg</span>
                        </div>

                        <div style={{ minWidth: 70, textAlign: "right" }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#16a34a" }}>
                            +{subtotal} Poin
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Catatan Admin */}
            <div>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={14} color="#64748b" /> Catatan Verifikasi Petugas (Opsional)
              </label>
              <textarea
                rows={2}
                value={catatanAdmin}
                onChange={(e) => setCatatanAdmin(e.target.value)}
                className="form-input"
                placeholder="Tuliskan catatan kondisi timbangan sampah..."
                style={{ resize: "none" }}
              />
            </div>

            {/* Total Poin Final Box */}
            <div
              className="card-hero-lime"
              style={{
                padding: "16px 20px",
                borderRadius: 14,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginBottom: 2 }}>
                Total Poin Final yang Akan Disalurkan
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "white" }}>
                +{estimasiPoin(getNormalizedItems(modalItem), beratReal).toLocaleString("id-ID")} Poin
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => handleVerify("ditolak")}
                disabled={saving}
                style={{
                  padding: "12px",
                  borderRadius: 12,
                  border: "1px solid #fecaca",
                  background: "#fef2f2",
                  color: "#dc2626",
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: "pointer",
                }}
              >
                Tolak Setoran
              </button>
              <button
                type="button"
                onClick={() => handleVerify("diverifikasi")}
                disabled={saving}
                className="btn-primary"
                style={{ justifyContent: "center", padding: "12px", fontSize: 13.5 }}
              >
                {saving ? "Menyimpan..." : "Konfirmasi & Salurkan Poin"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}