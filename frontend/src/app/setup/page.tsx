"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { makerApi } from "@/lib/api";
import { Clover, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";

type Mode = "existing" | "new";

interface MakerRegisterResponse {
  data: {
    appKey: string;
    namaSiswa: string;
    namaApp: string;
  };
}

export default function SetupPage() {
  const { setAppKey } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("existing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mode: pakai App Key yang sudah ada
  const [existingKey, setExistingKey] = useState("");

  // Mode: daftar App Maker baru
  const [form, setForm] = useState({
    email: "",
    password: "",
    namaSiswa: "",
    kelas: "",
    namaApp: "",
  });

  function handleUseExisting(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!existingKey.trim()) {
      setError("App Key tidak boleh kosong.");
      return;
    }
    setAppKey(existingKey.trim());
    setSuccess("App Key tersimpan. Mengalihkan ke halaman login...");
    setTimeout(() => router.push("/auth/login"), 1200);
  }

  async function handleRegisterNew(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = (await makerApi.register(form)) as MakerRegisterResponse;
      setAppKey(res.data.appKey);
      setSuccess(
        `App Key berhasil dibuat untuk "${res.data.namaApp}". Simpan key ini baik-baik: ${res.data.appKey}`
      );
      setTimeout(() => router.push("/auth/login"), 2500);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Registrasi App Maker gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-smash-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-eco rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-smash-900">Setup App Key</h1>
          <p className="text-sm text-text-muted mt-1 max-w-sm mx-auto">
            App Key menandai data aplikasimu terpisah dari siswa lain. Wajib
            diisi sebelum bisa register / login.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-smash-200 p-8">
          <div className="flex gap-1.5 mb-6 bg-smash-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => { setMode("existing"); setError(null); setSuccess(null); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                mode === "existing" ? "bg-smash-600 text-white" : "text-smash-800"
              }`}
            >
              Sudah Punya Key
            </button>
            <button
              type="button"
              onClick={() => { setMode("new"); setError(null); setSuccess(null); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                mode === "new" ? "bg-smash-600 text-white" : "text-smash-800"
              }`}
            >
              Daftar Baru
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 p-3 bg-smash-50 border border-smash-200 rounded-xl flex items-start gap-2 text-sm text-smash-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {mode === "existing" ? (
            <form onSubmit={handleUseExisting} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-smash-900 mb-1.5">
                  App Key
                </label>
                <input
                  type="text"
                  placeholder="contoh: 97945213-34a7-48cf-baac-8740c1d18765"
                  value={existingKey}
                  onChange={(e) => setExistingKey(e.target.value)}
                  className="w-full px-4 py-3 border border-smash-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-smash-400 focus:border-transparent"
                />
                <p className="text-xs text-neutral-400 mt-1.5">
                  Lupa App Key? Cek lewat{" "}
                  <code className="bg-smash-50 px-1 py-0.5 rounded">
                    GET /api/v1/maker/check-key
                  </code>{" "}
                  pakai email pendaftaranmu.
                </p>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-smash-600 text-white font-bold rounded-xl hover:bg-smash-800 transition"
              >
                Simpan & Lanjut ke Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterNew} className="space-y-4">
              <Field label="Email">
                <input
                  type="email"
                  required
                  placeholder="siswa1@smk.sch.id"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Nama lengkap">
                <input
                  type="text"
                  required
                  placeholder="Budi Santoso"
                  value={form.namaSiswa}
                  onChange={(e) => setForm({ ...form, namaSiswa: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Kelas">
                <input
                  type="text"
                  required
                  placeholder="XII RPL 1"
                  value={form.kelas}
                  onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Nama aplikasi">
                <input
                  type="text"
                  required
                  placeholder="SMASH - Bank Sampah Digital"
                  value={form.namaApp}
                  onChange={(e) => setForm({ ...form, namaApp: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-smash-600 text-white font-bold rounded-xl hover:bg-smash-800 disabled:opacity-60 transition"
              >
                {loading ? "Mendaftar..." : "Daftar & Dapatkan App Key"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-text-muted mt-6 pt-5 border-t border-smash-100">
            <Clover className="w-3.5 h-3.5 inline mr-1 text-smash-600" />
            Sudah setup App Key?{" "}
            <Link href="/auth/login" className="text-smash-600 font-semibold hover:underline">
              Ke halaman login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-smash-900 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full px-4 py-2.5 border border-smash-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-smash-400 focus:border-transparent";