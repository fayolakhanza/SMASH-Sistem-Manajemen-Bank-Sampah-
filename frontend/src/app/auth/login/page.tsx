"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Recycle, User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form.username, form.password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Username atau password salah.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
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

        <div className="auth-title">Selamat Datang</div>
        <div className="auth-subtitle" style={{ marginBottom: 24 }}>
          Masuk ke portal Bank Sampah SMASH
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="form-input-icon">
              <User className="icon-left" />
              <input
                type="text"
                className="form-input"
                placeholder="Masukkan username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-icon">
              <Lock className="icon-left" />
              <input
                type={showPw ? "text" : "password"}
                className="form-input"
                placeholder="Masukkan password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={{ paddingLeft: 38, paddingRight: 38 }}
              />
              <button
                type="button"
                className="icon-right"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? (
              <>
                <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Masuk...
              </>
            ) : "Masuk"}
          </button>
        </form>

        <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid #f1f5f9", textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <span style={{ fontSize: 13, color: "#64748b" }}>Belum punya akun? </span>
            <Link href="/auth/register" style={{ fontSize: 13, color: "#1a4731", fontWeight: 700 }}>
              Daftar Nasabah
            </Link>
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            Pengelola Bank Sampah baru?{" "}
            <Link href="/auth/admin/register" style={{ color: "#0d9488", fontWeight: 700 }}>
              Daftar Admin Unit
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
}