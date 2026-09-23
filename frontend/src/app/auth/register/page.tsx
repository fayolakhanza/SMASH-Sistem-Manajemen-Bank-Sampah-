"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import {
  Recycle, User, Lock, Eye, EyeOff, AlertCircle,
  CheckCircle, MapPin, Phone, Camera,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    username: "", password: "", namaNasabah: "", alamat: "", telp: "",
  });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (fileRef.current?.files?.[0]) fd.append("foto", fileRef.current.files[0]);
      await authApi.registerNasabah(fd);
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Registrasi gagal. Periksa kembali data Anda.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card fade-in" style={{ textAlign: "center" }}>
          <div style={{ width: 72, height: 72, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <CheckCircle size={36} color="#16a34a" />
          </div>
          <div className="auth-title">Registrasi Berhasil!</div>
          <div className="auth-subtitle" style={{ marginTop: 8 }}>Mengalihkan ke halaman login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page" style={{ paddingTop: 40, paddingBottom: 40, alignItems: "flex-start" }}>
      <div className="auth-card fade-in" style={{ maxWidth: 460, margin: "0 auto" }}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Recycle size={24} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>SMASH</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Bank Sampah Digital</div>
          </div>
        </div>

        <div className="auth-title">Daftar Nasabah</div>
        <div className="auth-subtitle" style={{ marginBottom: 24 }}>
          Bergabunglah dengan komunitas bank sampah digital
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Foto */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                width: 80, height: 80, borderRadius: "50%",
                background: preview ? "transparent" : "#f1f5f9",
                border: "2px dashed #cbd5e1",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", overflow: "hidden", position: "relative",
                transition: "border-color 0.15s",
              }}
            >
              {preview ? (
                <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Camera size={24} color="#94a3b8" />
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" style={{ display: "none" }} onChange={handleFile} />
            <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>Foto profil (opsional)</span>
          </div>

          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="form-input-icon">
              <User className="icon-left" />
              <input type="text" className="form-input" placeholder="Contoh: budi_santoso" required
                value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                style={{ paddingLeft: 38 }} />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-icon">
              <Lock className="icon-left" />
              <input type={showPw ? "text" : "password"} className="form-input" placeholder="Min. 6 karakter" required
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ paddingLeft: 38, paddingRight: 38 }} />
              <button type="button" className="icon-right" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Nama */}
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <div className="form-input-icon">
              <User className="icon-left" />
              <input type="text" className="form-input" placeholder="Budi Santoso" required
                value={form.namaNasabah} onChange={e => setForm({ ...form, namaNasabah: e.target.value })}
                style={{ paddingLeft: 38 }} />
            </div>
          </div>

          {/* Alamat */}
          <div className="form-group">
            <label className="form-label">Alamat</label>
            <div className="form-input-icon">
              <MapPin className="icon-left" />
              <input type="text" className="form-input" placeholder="Jl. Kenanga No.5, RT 02/01" required
                value={form.alamat} onChange={e => setForm({ ...form, alamat: e.target.value })}
                style={{ paddingLeft: 38 }} />
            </div>
          </div>

          {/* Telepon */}
          <div className="form-group">
            <label className="form-label">No. Telepon / WhatsApp</label>
            <div className="form-input-icon">
              <Phone className="icon-left" />
              <input type="tel" className="form-input" placeholder="081234567890" required
                value={form.telp} onChange={e => setForm({ ...form, telp: e.target.value })}
                style={{ paddingLeft: 38 }} />
            </div>
          </div>

          <button type="submit" className="btn-full" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid #f1f5f9", textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <span style={{ fontSize: 13, color: "#64748b" }}>Sudah punya akun? </span>
            <Link href="/auth/login" style={{ fontSize: 13, color: "#1a4731", fontWeight: 700 }}>
              Masuk
            </Link>
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            Mendaftar sebagai pengelola unit?{" "}
            <Link href="/auth/admin/register" style={{ color: "#0d9488", fontWeight: 700 }}>
              Daftar Admin Unit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}