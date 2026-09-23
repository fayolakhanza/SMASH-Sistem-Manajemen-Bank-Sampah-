"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import {
  Recycle,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Building2,
  Phone,
} from "lucide-react";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    namaUnit: "",
    namaPengelola: "",
    telp: "",
    username: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authApi.registerAdmin(form);
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: unknown) {
      const e = err as { message?: string; errors?: string[] };
      if (e.errors && Array.isArray(e.errors) && e.errors.length > 0) {
        setError(e.errors.join(", "));
      } else {
        setError(e.message || "Registrasi admin gagal. Silakan periksa kembali data Anda.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        className="auth-page"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "36px 16px",
        }}
      >
        <div className="auth-card fade-in" style={{ textAlign: "center", maxWidth: 440, width: "100%" }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: "#dcfce7",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <CheckCircle size={36} color="#16a34a" />
          </div>
          <div className="auth-title">Pendaftaran Berhasil!</div>
          <div className="auth-subtitle" style={{ marginTop: 8 }}>
            Akun pengelola unit bank sampah berhasil didaftarkan. Mengalihkan ke halaman login...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="auth-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 16px",
      }}
    >
      <div className="auth-card fade-in" style={{ maxWidth: 480, width: "100%", margin: "0 auto" }}>
        {/* Logo & Header */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Recycle size={24} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>SMASH</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Bank Sampah Digital</div>
          </div>
        </div>

        <div className="auth-title">Registrasi Admin Unit</div>
        <div className="auth-subtitle" style={{ marginBottom: 24 }}>
          Daftarkan unit dan akun pengelola bank sampah baru
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nama Unit Bank Sampah */}
          <div className="form-group">
            <label className="form-label">Nama Unit Bank Sampah</label>
            <div className="form-input-icon">
              <Building2 className="icon-left" />
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: Bank Sampah Melati Indah"
                required
                value={form.namaUnit}
                onChange={(e) => setForm({ ...form, namaUnit: e.target.value })}
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          {/* Nama Pengelola */}
          <div className="form-group">
            <label className="form-label">Nama Lengkap Pengelola / Penanggung Jawab</label>
            <div className="form-input-icon">
              <User className="icon-left" />
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: Ningsih Wulandari"
                required
                value={form.namaPengelola}
                onChange={(e) => setForm({ ...form, namaPengelola: e.target.value })}
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          {/* No. Telepon / WhatsApp */}
          <div className="form-group">
            <label className="form-label">No. Telepon / WhatsApp Unit</label>
            <div className="form-input-icon">
              <Phone className="icon-left" />
              <input
                type="tel"
                className="form-input"
                placeholder="Contoh: 081234567890"
                required
                value={form.telp}
                onChange={(e) => setForm({ ...form, telp: e.target.value })}
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          {/* Username Akun */}
          <div className="form-group">
            <label className="form-label">Username Akun Admin</label>
            <div className="form-input-icon">
              <User className="icon-left" />
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: admin_melati"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-icon">
              <Lock className="icon-left" />
              <input
                type={showPw ? "text" : "password"}
                className="form-input"
                placeholder="Min. 6 karakter"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ paddingLeft: 38, paddingRight: 38 }}
              />
              <button
                type="button"
                className="icon-right"
                onClick={() => setShowPw(!showPw)}
                aria-label="Toggle password visibility"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-full"
            disabled={loading}
            style={{ marginTop: 4 }}
          >
            {loading ? "Mendaftarkan Unit..." : "Daftar Sekarang"}
          </button>
        </form>

        {/* Link Navigasi Bawah */}
        <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid #f1f5f9", textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <span style={{ fontSize: 13, color: "#64748b" }}>Sudah memiliki akun pengelola? </span>
            <Link href="/auth/login" style={{ fontSize: 13, color: "#1a4731", fontWeight: 700 }}>
              Masuk
            </Link>
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            Ingin mendaftar sebagai penyetor sampah?{" "}
            <Link href="/auth/register" style={{ color: "#166534", fontWeight: 600 }}>
              Daftar Nasabah
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}