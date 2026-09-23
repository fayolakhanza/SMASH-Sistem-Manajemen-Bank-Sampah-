"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import AppShell from "@/components/AppShell";
import { nasabahApi } from "@/lib/api";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  User,
  AlertCircle,
  Coins,
  Phone,
  MapPin,
  Sparkles,
  Users,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Camera,
  CheckCircle2,
} from "lucide-react";
import Modal from "@/components/admin/modal";

interface Nasabah {
  id: string;
  username: string;
  namaNasabah: string;
  alamat?: string;
  telp?: string;
  saldoPoin: number;
  foto?: string;
}

const emptyForm = { username: "", password: "", namaNasabah: "", alamat: "", telp: "" };
type FormState = typeof emptyForm;

export default function AdminNasabahPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Nasabah[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Nasabah | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function load() {
    setLoading(true);
    nasabahApi.getAll().then((res: unknown) => {
      const r = res as { data: Nasabah[] };
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
    setFoto(null);
    setFotoPreview(null);
    setShowPassword(false);
    setError(null);
    setModalOpen(true);
  }

  function openEdit(n: Nasabah) {
    setEditing(n);
    setForm({
      username: n.username ?? "",
      password: "",
      namaNasabah: n.namaNasabah ?? "",
      alamat: n.alamat ?? "",
      telp: n.telp ?? "",
    });
    setFoto(null);
    setFotoPreview(n.foto ?? null);
    setShowPassword(false);
    setError(null);
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "password" && !v) return;
        fd.append(k, v);
      });
      if (foto) fd.append("foto", foto);

      if (editing) {
        await nasabahApi.update(editing.id, fd);
      } else {
        await nasabahApi.create(fd);
      }
      setModalOpen(false);
      load();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Gagal menyimpan data nasabah.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(n: Nasabah) {
    if (!confirm(`Hapus nasabah "${n.namaNasabah}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    await nasabahApi.delete(n.id);
    load();
  }

  const filtered = data.filter((n) =>
    (n.namaNasabah + " " + n.username + " " + (n.telp || "")).toLowerCase().includes(query.toLowerCase())
  );

  const totalPoinBeredar = data.reduce((acc, n) => acc + (n.saldoPoin || 0), 0);

  return (
    <AppShell title="Kelola Nasabah">
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
            <Users size={14} color="#86efac" />
            <span
              style={{
                color: "#dcfce7",
                fontSize: 11.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Manajemen Nasabah
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", marginBottom: 6 }}>
            {data.length} Nasabah Terdaftar
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", maxWidth: 520, lineHeight: 1.5 }}>
            Kelola data nasabah, pantau akumulasi saldo poin, dan tambahkan anggota baru Bank Sampah secara realtime.
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
          <Plus size={16} /> Tambah Nasabah Baru
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
            Daftar Anggota
          </span>
          <span className="badge badge-green" style={{ fontSize: 12 }}>
            {filtered.length} Nasabah
          </span>
          <span className="badge badge-yellow" style={{ fontSize: 12 }}>
            <Coins size={12} /> {totalPoinBeredar.toLocaleString("id-ID")} Poin Beredar
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
            placeholder="Cari nama, username, telp..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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

      {/* Modern Table Card with Deep Shadow */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#64748b" }}>
            <div className="spin" style={{ width: 36, height: 36, border: "3px solid #2d7a55", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 12px" }} />
            Memuat data nasabah...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 20px", color: "#64748b" }}>
            <User size={48} color="#cbd5e1" style={{ margin: "0 auto 12px" }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Tidak ada data nasabah ditemukan
            </div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              Coba gunakan kata kunci pencarian yang berbeda.
            </div>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: "none" }}>
            <table>
              <thead>
                <tr>
                  <th>Nasabah</th>
                  <th>Username</th>
                  <th>Kontak / Telp</th>
                  <th>Alamat</th>
                  <th style={{ textAlign: "right" }}>Saldo Poin</th>
                  <th style={{ textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((n) => (
                  <tr key={n.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            color: "#166534",
                            fontSize: 13,
                            overflow: "hidden",
                            flexShrink: 0,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                          }}
                        >
                          {n.foto ? (
                            <img src={n.foto} alt={n.namaNasabah} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            n.namaNasabah.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>
                            {n.namaNasabah}
                          </div>
                          <div style={{ fontSize: 11.5, color: "#94a3b8" }}>ID: {n.id.substring(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "#475569", fontWeight: 600 }}>@{n.username}</td>
                    <td>
                      {n.telp ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#475569", fontSize: 13 }}>
                          <Phone size={12} color="#64748b" />
                          {n.telp}
                        </div>
                      ) : (
                        <span style={{ color: "#cbd5e1" }}>-</span>
                      )}
                    </td>
                    <td>
                      {n.alamat ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#64748b", fontSize: 12.5, maxWidth: 220 }}>
                          <MapPin size={12} color="#94a3b8" style={{ flexShrink: 0 }} />
                          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {n.alamat}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: "#cbd5e1" }}>-</span>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        className="badge badge-green"
                        style={{ fontSize: 13, padding: "5px 12px", boxShadow: "0 2px 6px rgba(22, 163, 74, 0.1)" }}
                      >
                        <Coins size={13} /> {n.saldoPoin.toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                        <button
                          onClick={() => openEdit(n)}
                          style={{
                            padding: "8px",
                            background: "#f0fdf4",
                            color: "#166534",
                            border: "1px solid #bbf7d0",
                            borderRadius: 8,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                          title="Edit Nasabah"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(n)}
                          style={{
                            padding: "8px",
                            background: "#fef2f2",
                            color: "#dc2626",
                            border: "1px solid #fecaca",
                            borderRadius: 8,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                          title="Hapus Nasabah"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modern Modal Form (Tambah / Edit Nasabah) */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Data Nasabah" : "Tambah Nasabah Baru"}
        subtitle={editing ? "Perbarui informasi profil dan kredensial nasabah" : "Daftarkan akun nasabah baru ke unit bank sampah"}
        maxWidth="max-w-2xl"
      >
        <form
          key={editing ? `edit-${editing.id}` : "create"}
          onSubmit={handleSave}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
            {/* Foto Upload Dropzone & Live Avatar */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  border: "2.5px dashed #cbd5e1",
                  background: fotoPreview ? "transparent" : "#f8fafc",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                {fotoPreview ? (
                  <img
                    src={fotoPreview}
                    alt="Preview Foto"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ textAlign: "center", color: "#64748b", padding: 10 }}>
                    <Camera size={30} color="#94a3b8" style={{ margin: "0 auto 6px" }} />
                    <div style={{ fontSize: 11, fontWeight: 700 }}>Upload Foto</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>JPG / PNG</div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFoto(f);
                    setFotoPreview(URL.createObjectURL(f));
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#166534",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  padding: "6px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                {fotoPreview ? "Ganti Foto" : "Pilih Foto"}
              </button>
            </div>

            {/* Input Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="form-label">Username</label>
                <div className="form-input-icon">
                  <User className="icon-left" />
                  <input
                    required
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="form-input"
                    placeholder="contoh: nasabah_budi"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">
                  {editing ? "Password (kosongkan jika tidak diubah)" : "Password"}
                </label>
                <div className="form-input-icon">
                  <Lock className="icon-left" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required={!editing}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="form-input"
                    placeholder="Minimal 6 karakter"
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="icon-right"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">Nama Lengkap</label>
                <input
                  required
                  value={form.namaNasabah}
                  onChange={(e) => setForm({ ...form, namaNasabah: e.target.value })}
                  className="form-input"
                  placeholder="Nama lengkap nasabah"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">No. Telepon / WA</label>
                  <div className="form-input-icon">
                    <Phone className="icon-left" />
                    <input
                      value={form.telp}
                      onChange={(e) => setForm({ ...form, telp: e.target.value })}
                      className="form-input"
                      placeholder="08123456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Alamat Domisili</label>
                  <div className="form-input-icon">
                    <MapPin className="icon-left" />
                    <input
                      value={form.alamat}
                      onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                      className="form-input"
                      placeholder="Jl. Danau No. 12"
                    />
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
              {saving ? "Menyimpan Data..." : editing ? "Perbarui Nasabah" : "Simpan Nasabah Baru"}
            </button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}