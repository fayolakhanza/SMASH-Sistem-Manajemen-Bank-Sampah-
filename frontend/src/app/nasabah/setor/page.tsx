"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { setorApi, kategoriApi } from "@/lib/api";
import AppShell from "@/components/AppShell";
import {
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Info,
  Scale,
  Recycle,
  CheckCircle2,
} from "lucide-react";

interface Kategori {
  id: string;
  namaKategori: string;
  poinPerKg: number;
  hargaPerKg: number;
}

interface Item {
  kategoriSampahId: string;
  berat: number;
  satuan: string;
}

export default function SetorPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/auth/login");
    if (user) {
      kategoriApi.getAll().then((res: unknown) => {
        const r = res as { data: Kategori[] };
        const list = r.data || [];
        setKategori(list);
        if (list.length > 0) {
          setItems((prev) =>
            prev.length === 0
              ? [{ kategoriSampahId: "", berat: 1, satuan: "kg" }]
              : prev
          );
        }
      });
    }
  }, [user, isLoading, router]);

  const totalEstPoin = items.reduce((acc, item) => {
    const kat = kategori.find((k) => k.id === item.kategoriSampahId);
    return acc + (kat ? kat.poinPerKg * item.berat : 0);
  }, 0);

  const totalBerat = items.reduce((acc, item) => acc + (item.berat || 0), 0);

  function addItem() {
    setItems([
      ...items,
      { kategoriSampahId: "", berat: 1, satuan: "kg" },
    ]);
  }

  function removeItem(i: number) {
    setItems(items.filter((_, idx) => idx !== i));
  }

  function updateItem(i: number, field: keyof Item, value: string | number) {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const hasEmptyCategory = items.some((it) => !it.kategoriSampahId);
      if (hasEmptyCategory) {
        throw new Error("Silakan pilih jenis kategori sampah untuk setiap item.");
      }

      const validItems = items.filter(
        (it) => it.kategoriSampahId && Number(it.berat) > 0
      );
      if (validItems.length === 0) {
        throw new Error("Pilih setidaknya 1 jenis sampah dengan berat lebih dari 0 kg.");
      }

      const formattedItems = validItems.map((it) => ({
        kategoriSampahId: it.kategoriSampahId,
        berat: Number(it.berat),
        beratKg: Number(it.berat),
        satuan: it.satuan || "kg",
      }));

      const fd = new FormData();
      fd.append("tanggal", new Date().toISOString());
      fd.append("catatan", catatan.trim() || "Penyetoran sampah daur ulang");
      fd.append("items", JSON.stringify(formattedItems));
      if (fileRef.current?.files?.[0]) {
        fd.append("fotoBukti", fileRef.current.files[0]);
      }
      await setorApi.createPengajuan(fd);
      setSuccess(true);
      setTimeout(() => router.push("/nasabah/riwayat"), 2000);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Gagal mengajukan penyetoran.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AppShell>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div
            style={{
              width: 80,
              height: 80,
              background: "#dcfce7",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 10px 25px rgba(22, 163, 74, 0.15)",
            }}
          >
            <CheckCircle size={42} color="#16a34a" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
            Pengajuan Setoran Berhasil!
          </div>
          <div style={{ color: "#64748b", fontSize: 14, maxWidth: 400, margin: "0 auto" }}>
            Data telah tersimpan. Silakan bawa sampah ke unit bank sampah untuk verifikasi timbangan final oleh admin.
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Setor Sampah" showSetor={false}>
      <form onSubmit={handleSubmit} className="w-full-desktop">
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="setor-grid-layout">
          {/* Kolom Kiri: Form Input Setoran */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Foto Bukti Fisik */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                  Foto Bukti Fisik Sampah
                </div>
                {preview && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    style={{
                      fontSize: 12,
                      color: "#dc2626",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Hapus Foto
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{
                  width: "100%",
                  minHeight: 180,
                  border: "2px dashed #cbd5e1",
                  borderRadius: 14,
                  background: preview ? "transparent" : "#f8fafc",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  transition: "all 0.15s ease",
                  padding: preview ? 0 : 20,
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 12 }}
                  />
                ) : (
                  <div style={{ textAlign: "center", color: "#64748b" }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "#e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 10px",
                      }}
                    >
                      <Upload size={22} color="#475569" />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
                      Klik untuk upload foto sampah
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
                      Format file JPG atau PNG (Maks 5MB)
                    </div>
                  </div>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setPreview(URL.createObjectURL(f));
                }}
              />
            </div>

            {/* Daftar Item Sampah */}
            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                    Daftar Item Sampah
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    Pilih jenis kategori sampah & berat estimasi (kg)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    background: "#f0fdf4",
                    color: "#1a4731",
                    border: "1.5px solid #86efac",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <Plus size={15} /> Tambah Item
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((item, i) => {
                  const currentKat = kategori.find((k) => k.id === item.kategoriSampahId);
                  const itemPoin = (currentKat?.poinPerKg || 0) * (item.berat || 0);

                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        padding: "12px 14px",
                        background: "#f8fafc",
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: "2 1 200px" }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>
                          Jenis Kategori
                        </label>
                        <select
                          value={item.kategoriSampahId}
                          onChange={(e) => updateItem(i, "kategoriSampahId", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            border: "1px solid #cbd5e1",
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 600,
                            fontFamily: "inherit",
                            outline: "none",
                            background: "white",
                          }}
                        >
                          <option value="">-- Pilih Jenis Kategori Sampah --</option>
                          {kategori.map((k) => (
                            <option key={k.id} value={k.id}>
                              {k.namaKategori} ({k.poinPerKg} poin/kg)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ flex: "1 1 110px" }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>
                          Estimasi (kg)
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={item.berat}
                            onChange={(e) => updateItem(i, "berat", parseFloat(e.target.value) || 0)}
                            style={{
                              width: "100%",
                              padding: "9px 10px",
                              border: "1px solid #cbd5e1",
                              borderRadius: 8,
                              fontSize: 13,
                              fontWeight: 700,
                              fontFamily: "inherit",
                              outline: "none",
                              textAlign: "center",
                              background: "white",
                            }}
                          />
                          <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>kg</span>
                        </div>
                      </div>

                      <div style={{ minWidth: 80, textAlign: "right" }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>
                          Poin
                        </label>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>
                          +{itemPoin.toFixed(0)}
                        </span>
                      </div>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(i)}
                          style={{
                            padding: "8px",
                            color: "#ef4444",
                            background: "#fee2e2",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 18,
                          }}
                          title="Hapus item"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Catatan */}
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 6 }}>
                Catatan Tambahan (Opsional)
              </div>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
                Berikan catatan kondisi sampah, waktu pengantaran, atau informasi penting lainnya.
              </p>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={3}
                placeholder="Contoh: Sampah kardus dan botol sudah dibersihkan dan diikat rapi..."
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-full"
              disabled={loading || items.length === 0}
              style={{ padding: 15, fontSize: 16 }}
            >
              {loading ? (
                <>
                  <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mengajukan Penyetoran...
                </>
              ) : (
                <>
                  <Recycle size={18} />
                  Ajukan Penyetoran Sampah
                </>
              )}
            </button>
          </div>

          {/* Panduan Penyetoran */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        

            {/* Panduan Penyetoran */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Info size={18} color="#2d7a55" />
                <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                  Panduan Penyetoran
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    1
                  </div>
                  <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.4 }}>
                    <strong style={{ color: "#0f172a" }}>Pilah Sampah:</strong> Pastikan sampah sudah dipisahkan sesuai jenis dan tidak tercampur sampah basah.
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    2
                  </div>
                  <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.4 }}>
                    <strong style={{ color: "#0f172a" }}>Bersih & Kering:</strong> Bilas dan keringkan botol atau wadah plastik sebelum disetor.
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    3
                  </div>
                  <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.4 }}>
                    <strong style={{ color: "#0f172a" }}>Verifikasi Timbangan:</strong> Bawa sampah ke unit bank sampah untuk penimbangan aktual oleh admin.
                  </div>
                </div>
              </div>
            </div>

            {/* Tarif Poin Kategori */}
            {kategori.length > 0 && (
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Scale size={18} color="#2d7a55" />
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                    Katalog Nilai Poin
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {kategori.map((k) => (
                    <div
                      key={k.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 10px",
                        background: "#f8fafc",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "#334155" }}>{k.namaKategori}</span>
                      <span style={{ fontWeight: 700, color: "#16a34a" }}>{k.poinPerKg} poin/kg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </AppShell>
  );
}