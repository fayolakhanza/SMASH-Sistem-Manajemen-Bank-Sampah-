"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import AppShell from "@/components/AppShell";
import { hadiahApi } from "@/lib/api";
import {
  Plus,
  Pencil,
  Trash2,
  Gift,
  AlertCircle,
  Coins,
  Sparkles,
  Search,
  ImagePlus,
  X,
} from "lucide-react";
import Modal from "@/components/admin/modal";

interface Hadiah {
  id: string;
  namaHadiah: string;
  deskripsi?: string;
  poinDibutuhkan: number;
  stok: number;
  foto?: string;
}

const emptyForm = { namaHadiah: "", deskripsi: "", poinDibutuhkan: "", stok: "" };

export default function AdminHadiahPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Hadiah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Hadiah | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [foto, setFoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function load() {
    setLoading(true);
    hadiahApi.getAll().then((res: unknown) => {
      const r = res as { data: Hadiah[] };
      setData(r.data || []);
      setLoading(false);
    });
  }

  useEffect(() => {
    if (user) load();
  }, [user]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFoto(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setModalOpen(true);
  }

  function openEdit(h: Hadiah) {
    setEditing(h);
    setForm({
      namaHadiah: h.namaHadiah,
      deskripsi: h.deskripsi || "",
      poinDibutuhkan: String(h.poinDibutuhkan),
      stok: String(h.stok),
    });
    setFoto(null);
    setPreviewUrl(h.foto || null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setModalOpen(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setFoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(editing?.foto || null);
    }
  }

  function removeFoto() {
    setFoto(null);
    setPreviewUrl(editing?.foto || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("namaHadiah", form.namaHadiah);
      fd.append("deskripsi", form.deskripsi);
      fd.append("poinDibutuhkan", form.poinDibutuhkan);
      fd.append("stok", form.stok);
      if (foto) fd.append("foto", foto);

      if (editing) {
        await hadiahApi.update(editing.id, fd);
      } else {
        await hadiahApi.create(fd);
      }
      setModalOpen(false);
      load();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Gagal menyimpan hadiah.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(h: Hadiah) {
    if (!confirm(`Hapus hadiah "${h.namaHadiah}"?`)) return;
    await hadiahApi.delete(h.id);
    load();
  }

  const filtered = data.filter((h) =>
    (h.namaHadiah + " " + (h.deskripsi || "")).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell title="Kelola Hadiah & Reward">
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
              Katalog Reward
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", marginBottom: 6 }}>
            {data.length} Hadiah Siap Ditukar
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", maxWidth: 520, lineHeight: 1.5 }}>
            Kelola inventaris voucher reward, atur tarif poin penukaran, dan perbarui ketersediaan stok hadiah nasabah.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="btn-primary"
          style={{
            background: "white",
            color: "#1a4731",
            padding: "12px 22px",
            fontSize: 14,
            fontWeight: 800,
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Plus size={16} /> Tambah Hadiah Baru
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
            Daftar Hadiah
          </span>
          <span className="badge badge-green" style={{ fontSize: 12 }}>
            {filtered.length} Item
          </span>
        </div>

        <div style={{ position: "relative", minWidth: 280 }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            placeholder="Cari nama hadiah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 16px 10px 40px",
              background: "white",
              border: "1.5px solid #e2e8f0",
              borderRadius: 12,
              fontSize: 13.5,
              outline: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#64748b" }}>
          <div className="spin" style={{ width: 36, height: 36, border: "3px solid #2d7a55", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 12px" }} />
          Memuat hadiah...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 20px", color: "#64748b" }}>
          <Gift size={48} color="#cbd5e1" style={{ margin: "0 auto 12px" }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
            Belum ada hadiah terdaftar
          </div>
        </div>
      ) : (
        /* Modern Cards Grid */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {filtered.map((h) => {
            const habis = h.stok === 0;

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
                  opacity: habis ? 0.7 : 1,
                }}
              >
                {/* Visual Header */}
                <div
                  style={{
                    height: 140,
                    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {h.foto ? (
                    <img src={h.foto} alt={h.namaHadiah} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      }}
                    >
                      <Gift size={28} color="#16a34a" />
                    </div>
                  )}

                  {/* Stock Badge Overlay */}
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
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
                <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                      <h3 style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", lineHeight: 1.3, flex: 1 }}>
                        {h.namaHadiah}
                      </h3>
                      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        <button
                          onClick={() => openEdit(h)}
                          style={{
                            padding: "6px",
                            background: "#f0fdf4",
                            color: "#166534",
                            border: "1px solid #bbf7d0",
                            borderRadius: 6,
                            cursor: "pointer",
                          }}
                          title="Edit Hadiah"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(h)}
                          style={{
                            padding: "6px",
                            background: "#fef2f2",
                            color: "#dc2626",
                            border: "1px solid #fecaca",
                            borderRadius: 6,
                            cursor: "pointer",
                          }}
                          title="Hapus Hadiah"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.5, marginBottom: 14, minHeight: 36 }}>
                      {h.deskripsi || "Reward resmi yang dapat diklaim nasabah dengan menukarkan saldo poin."}
                    </p>
                  </div>

                  {/* Points Box */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      background: "#fffbeb",
                      borderRadius: 12,
                      border: "1px solid #fef3c7",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#92400e" }}>
                      Biaya Poin
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
                      <Coins size={15} />
                      {h.poinDibutuhkan.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modern 2-Column Modal Form */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Hadiah & Reward" : "Tambah Hadiah Baru"}
        subtitle="Lengkapi informasi hadiah dan atur jumlah poin yang diperlukan nasabah untuk menukar."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
            {/* Form Inputs Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="form-label">Nama Hadiah / Voucher</label>
                <input
                  required
                  value={form.namaHadiah}
                  onChange={(e) => setForm({ ...form, namaHadiah: e.target.value })}
                  className="form-input"
                  placeholder="contoh: Voucher Belanja Rp 50.000"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Poin Dibutuhkan</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.poinDibutuhkan}
                    onChange={(e) => setForm({ ...form, poinDibutuhkan: e.target.value })}
                    className="form-input"
                    placeholder="contoh: 250"
                  />
                </div>
                <div>
                  <label className="form-label">Stok Hadiah</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stok}
                    onChange={(e) => setForm({ ...form, stok: e.target.value })}
                    className="form-input"
                    placeholder="contoh: 15"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Deskripsi Hadiah</label>
                <textarea
                  rows={2}
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  className="form-input"
                  placeholder="Keterangan masa berlaku, syarat klaim, atau detail produk..."
                  style={{ resize: "none" }}
                />
              </div>

              <div>
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <ImagePlus size={14} /> Foto Produk / Voucher
                  <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}>(opsional)</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="upload-hadiah"
                />

                {previewUrl ? (
                  <div
                    style={{
                      position: "relative",
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "1.5px solid #bbf7d0",
                      cursor: "pointer",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <img
                      src={previewUrl}
                      alt="Preview foto hadiah"
                      style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                    >
                      <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>Klik untuk ganti foto</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFoto(); }}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "rgba(220,38,38,0.9)",
                        border: "none",
                        borderRadius: 999,
                        width: 26,
                        height: 26,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      title="Hapus foto"
                    >
                      <X size={14} color="white" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="upload-hadiah"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "20px 16px",
                      border: "2px dashed #e2e8f0",
                      borderRadius: 12,
                      cursor: "pointer",
                      background: "#f8fafc",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLLabelElement).style.borderColor = "#4ade80";
                      (e.currentTarget as HTMLLabelElement).style.background = "#f0fdf4";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLLabelElement).style.borderColor = "#e2e8f0";
                      (e.currentTarget as HTMLLabelElement).style.background = "#f8fafc";
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ImagePlus size={22} color="#16a34a" />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                        Klik untuk upload foto
                      </div>
                      <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>
                        JPG, PNG, WEBP — Maks. 5 MB
                      </div>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Live Interactive Preview Card */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                <Sparkles size={13} color="#2d7a55" /> Live Preview Katalog
              </div>
              <div
                className="card"
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e2e8f0",
                  padding: 0,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                }}
              >
                {/* Image Banner */}
                <div
                  style={{
                    height: 110,
                    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        background: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                      }}
                    >
                      <Gift size={24} color="#16a34a" />
                    </div>
                  )}

                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "rgba(255, 255, 255, 0.92)",
                      backdropFilter: "blur(4px)",
                      color: "#1e293b",
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 999,
                    }}
                  >
                    Stok: {form.stok || "0"}
                  </span>
                </div>

                {/* Body */}
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a", marginBottom: 3 }}>
                    {form.namaHadiah || "Nama Hadiah"}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#64748b", lineHeight: 1.4, marginBottom: 12, minHeight: 32 }}>
                    {form.deskripsi || "Keterangan hadiah reward untuk nasabah..."}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: "#fffbeb",
                      borderRadius: 10,
                      border: "1px solid #fef3c7",
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#92400e" }}>
                      Biaya Poin
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontWeight: 800,
                        color: "#d97706",
                        fontSize: 14,
                      }}
                    >
                      <Coins size={14} />
                      {Number(form.poinDibutuhkan || 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              style={{
                padding: "11px 20px",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                color: "#64748b",
                fontWeight: 700,
                fontSize: 13.5,
                cursor: "pointer",
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ padding: "11px 24px", fontSize: 13.5 }}
            >
              {saving ? "Menyimpan..." : editing ? "Perbarui Hadiah" : "Simpan Hadiah Baru"}
            </button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}