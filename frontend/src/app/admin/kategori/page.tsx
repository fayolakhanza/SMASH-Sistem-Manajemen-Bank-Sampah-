"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import AppShell from "@/components/AppShell";
import { kategoriApi } from "@/lib/api";
import {
  Plus,
  Pencil,
  Trash2,
  Recycle,
  AlertCircle,
  Scale,
  Coins,
  Sparkles,
  Layers,
  Box,
  Wine,
  Search,
  ImagePlus,
  X,
  Tag,
} from "lucide-react";
import Modal from "@/components/admin/modal";

interface Kategori {
  id: string;
  namaKategori: string;
  hargaPerKg: number;
  poinPerKg: number;
  jenis?: string;
  foto?: string | null;
}

const emptyForm = {
  namaKategori: "",
  hargaPerKg: "",
  poinPerKg: "",
  jenis: "",
};

function getCategoryDesign(name: string) {
  const n = (name || "").toLowerCase();
  if (n.includes("plastik") || n.includes("pet") || n.includes("botol")) {
    return {
      icon: Recycle,
      bg: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
      color: "#16a34a",
      tag: "Plastik & Botol",
      badge: "badge-green",
    };
  }
  if (n.includes("kardus") || n.includes("kertas") || n.includes("karton")) {
    return {
      icon: Layers,
      bg: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
      color: "#2563eb",
      tag: "Kertas & Kardus",
      badge: "badge-blue",
    };
  }
  if (
    n.includes("logam") ||
    n.includes("kaleng") ||
    n.includes("aluminium") ||
    n.includes("tembaga")
  ) {
    return {
      icon: Box,
      bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
      color: "#d97706",
      tag: "Logam & Kaleng",
      badge: "badge-yellow",
    };
  }
  if (n.includes("kaca") || n.includes("beling")) {
    return {
      icon: Wine,
      bg: "linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)",
      color: "#0d9488",
      tag: "Kaca & Beling",
      badge: "badge-green",
    };
  }
  return {
    icon: Sparkles,
    bg: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
    color: "#9333ea",
    tag: "Organik & Lainnya",
    badge: "badge-green",
  };
}

export default function AdminKategoriPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Kategori | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Photo upload state
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function load() {
    setLoading(true);
    kategoriApi.getAll().then((res: unknown) => {
      const r = res as { data: Kategori[] };
      setData(r.data || []);
      setLoading(false);
    });
  }

  useEffect(() => {
    if (user) load();
  }, [user]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFotoFile(null);
    setFotoPreview(null);
    setError(null);
    setModalOpen(true);
  }

  function openEdit(k: Kategori) {
    setEditing(k);
    setForm({
      namaKategori: k.namaKategori,
      hargaPerKg: String(k.hargaPerKg),
      poinPerKg: String(k.poinPerKg),
      jenis: k.jenis || "",
    });
    setFotoFile(null);
    // Show existing photo as preview
    setFotoPreview(k.foto || null);
    setError(null);
    setModalOpen(true);
  }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function removeFoto() {
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("namaKategori", form.namaKategori);
      fd.append("hargaPerKg", form.hargaPerKg);
      fd.append("poinPerKg", form.poinPerKg);
      fd.append("jenis", form.jenis || form.namaKategori);
      if (fotoFile) {
        fd.append("foto", fotoFile);
      }

      if (editing) {
        await kategoriApi.update(editing.id, fd);
      } else {
        await kategoriApi.create(fd);
      }
      setModalOpen(false);
      load();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Gagal menyimpan kategori.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(k: Kategori) {
    if (!confirm(`Hapus kategori "${k.namaKategori}"?`)) return;
    await kategoriApi.delete(k.id);
    load();
  }

  const filtered = data.filter((k) =>
    k.namaKategori.toLowerCase().includes(search.toLowerCase())
  );

  const previewDesign = getCategoryDesign(form.namaKategori || "Contoh Kategori");
  const PreviewIcon = previewDesign.icon;

  return (
    <AppShell title="Kategori Sampah">
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
            <Recycle size={14} color="#86efac" />
            <span
              style={{
                color: "#dcfce7",
                fontSize: 11.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Master Data Sampah
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", marginBottom: 6 }}>
            {data.length} Kategori Diterima
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", maxWidth: 520, lineHeight: 1.5 }}>
            Atur jenis sampah yang diterima, tetapkan harga per kg, dan sesuaikan tarif poin reward secara realtime.
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
          <Plus size={16} /> Tambah Kategori Baru
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
            Daftar Kategori
          </span>
          <span className="badge badge-green" style={{ fontSize: 12 }}>
            {filtered.length} Kategori Aktif
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
            placeholder="Cari kategori sampah..."
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
          Memuat kategori sampah...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 20px", color: "#64748b" }}>
          <Recycle size={48} color="#cbd5e1" style={{ margin: "0 auto 12px" }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
            Belum ada kategori sampah
          </div>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map((k) => {
            const design = getCategoryDesign(k.namaKategori);
            const Icon = design.icon;

            return (
              <div
                key={k.id}
                className="card card-interactive"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: 0,
                  overflow: "hidden",
                }}
              >
                {/* Category Photo or Gradient Header */}
                {k.foto ? (
                  <div
                    style={{
                      width: "100%",
                      height: 140,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={k.foto}
                      alt={k.namaKategori}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.3) 100%)",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 100,
                      background: design.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={40} color={design.color} style={{ opacity: 0.5 }} />
                  </div>
                )}

                <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: design.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                          marginTop: -32,
                          border: "2px solid white",
                          position: "relative",
                        }}
                      >
                        <Icon size={22} color={design.color} />
                      </div>

                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => openEdit(k)}
                          style={{
                            padding: "7px",
                            background: "#f0fdf4",
                            color: "#166534",
                            border: "1px solid #bbf7d0",
                            borderRadius: 8,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                          title="Edit Kategori"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(k)}
                          style={{
                            padding: "7px",
                            background: "#fef2f2",
                            color: "#dc2626",
                            border: "1px solid #fecaca",
                            borderRadius: 8,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                          title="Hapus Kategori"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
                      {k.namaKategori}
                    </h3>
                    <span className={`badge ${design.badge}`} style={{ fontSize: 10.5, marginBottom: 14, display: "inline-block" }}>
                      {design.tag}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                      background: "#f8fafc",
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 2 }}>
                        <Scale size={12} /> Harga / kg
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#1a4731" }}>
                        Rp {Number(k.hargaPerKg).toLocaleString("id-ID")}
                      </div>
                    </div>

                    <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 2 }}>
                        <Coins size={12} color="#d97706" /> Poin / kg
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#d97706" }}>
                        {k.poinPerKg} <span style={{ fontSize: 11, fontWeight: 600 }}>Poin</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form Tambah / Edit Kategori Sampah */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Kategori Sampah" : "Tambah Kategori Baru"}
        subtitle={editing ? "Perbarui tarif harga dan poin kategori sampah" : "Daftarkan jenis sampah baru yang diterima di unit bank sampah"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
            {/* Input Form Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="form-label">Nama Kategori Sampah</label>
                <input
                  required
                  value={form.namaKategori}
                  onChange={(e) => setForm({ ...form, namaKategori: e.target.value })}
                  className="form-input"
                  placeholder="contoh: Botol Plastik PET"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Harga / kg (Rp)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.hargaPerKg}
                    onChange={(e) => setForm({ ...form, hargaPerKg: e.target.value })}
                    className="form-input"
                    placeholder="contoh: 4000"
                  />
                </div>
                <div>
                  <label className="form-label">Poin / kg</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.poinPerKg}
                    onChange={(e) => setForm({ ...form, poinPerKg: e.target.value })}
                    className="form-input"
                    placeholder="contoh: 12"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Jenis Sampah</label>
                <input
                  value={form.jenis}
                  onChange={(e) => setForm({ ...form, jenis: e.target.value })}
                  className="form-input"
                  placeholder="contoh: plastik, logam, kertas"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <ImagePlus size={14} /> Foto Kategori
                  <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}>(opsional)</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFotoChange}
                  id="foto-upload-input"
                />

                {fotoPreview ? (
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
                      src={fotoPreview}
                      alt="Preview foto kategori"
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
                    htmlFor="foto-upload-input"
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

            {/* Live Preview Card Column */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Preview Kartu
              </div>
              <div
                className="card"
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #bbf7d0",
                  padding: 0,
                  overflow: "hidden",
                  boxShadow: "0 8px 20px rgba(34, 197, 94, 0.08)",
                }}
              >
                {/* Photo Preview in card */}
                {fotoPreview ? (
                  <div style={{ width: "100%", height: 100, overflow: "hidden" }}>
                    <img
                      src={fotoPreview}
                      alt="preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 70,
                      background: previewDesign.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PreviewIcon size={28} color={previewDesign.color} style={{ opacity: 0.4 }} />
                  </div>
                )}

                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: previewDesign.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: -28,
                        border: "2px solid white",
                        position: "relative",
                      }}
                    >
                      <PreviewIcon size={18} color={previewDesign.color} />
                    </div>
                    <span className={`badge ${previewDesign.badge}`} style={{ fontSize: 10 }}>
                      {previewDesign.tag}
                    </span>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a", marginBottom: 12 }}>
                    {form.namaKategori || "Nama Kategori"}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                      background: "#f8fafc",
                      padding: "8px 10px",
                      borderRadius: 10,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>Harga/kg</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#166534" }}>
                        Rp {Number(form.hargaPerKg || 0).toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>Poin/kg</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#d97706" }}>
                        {form.poinPerKg || 0} Poin
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
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
              {saving ? "Menyimpan..." : editing ? "Perbarui Kategori" : "Simpan Kategori Baru"}
            </button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}