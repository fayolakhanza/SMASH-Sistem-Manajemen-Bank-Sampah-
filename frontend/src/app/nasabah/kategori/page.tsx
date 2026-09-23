"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { kategoriApi } from "@/lib/api";
import AppShell from "@/components/AppShell";
import Link from "next/link";
import {
  Coins,
  Scale,
  AlertCircle,
  Recycle,
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  Layers,
  Box,
  Wine,
  FileText,
} from "lucide-react";

interface Kategori {
  id: string;
  namaKategori: string;
  hargaPerKg: number;
  poinPerKg: number;
  deskripsi?: string;
  foto?: string | null;
}

// Icon and color mapper based on category name
function getCategoryDesign(name: string) {
  const n = name.toLowerCase();
  if (n.includes("plastik") || n.includes("pet") || n.includes("botol")) {
    return {
      icon: Recycle,
      bg: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
      color: "#16a34a",
      badge: "badge-green",
      tag: "Plastik & Botol",
    };
  }
  if (n.includes("kardus") || n.includes("kertas") || n.includes("karton") || n.includes("buku")) {
    return {
      icon: Layers,
      bg: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
      color: "#2563eb",
      badge: "badge-blue",
      tag: "Kertas & Kardus",
    };
  }
  if (n.includes("logam") || n.includes("kaleng") || n.includes("aluminium") || n.includes("tembaga") || n.includes("besi")) {
    return {
      icon: Box,
      bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
      color: "#d97706",
      badge: "badge-yellow",
      tag: "Logam & Kaleng",
    };
  }
  if (n.includes("kaca") || n.includes("beling")) {
    return {
      icon: Wine,
      bg: "linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)",
      color: "#0d9488",
      badge: "badge-green",
      tag: "Kaca & Beling",
    };
  }
  return {
    icon: Sparkles,
    bg: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
    color: "#9333ea",
    badge: "badge-green",
    tag: "Organik & Lainnya",
  };
}

export default function KategoriPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Kategori[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/auth/login");
    if (user) {
      kategoriApi
        .getAll()
        .then((res: unknown) => {
          const r = res as { data: Kategori[] };
          setData(r.data || []);
          setLoading(false);
        })
        .catch(() => {
          setError("Gagal memuat data kategori.");
          setLoading(false);
        });
    }
  }, [user, isLoading, router]);

  const filtered = data.filter((k) =>
    (k.namaKategori + " " + (k.deskripsi || "")).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell title="Katalog Jenis Sampah">
      {/* Top Banner Info */}
      <div
        className="card-hero-lime mb-6"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255, 255, 255, 0.16)", backdropFilter: "blur(4px)", padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.25)", marginBottom: 12 }}>
            <Sparkles size={13} color="#86efac" />
            <span style={{ color: "#dcfce7", fontSize: 11.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Katalog Resmi
            </span>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#ffffff", marginBottom: 6 }}>
            Tarif Harga & Konversi Poin Sampah
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", maxWidth: 540, lineHeight: 1.5 }}>
            Pilah sampahmu dari rumah! Setiap kilogram sampah memiliki nilai rupiah dan poin reward yang bisa kamu tukarkan dengan berbagai hadiah menarik.
          </p>
        </div>

        <Link
          href="/nasabah/setor"
          className="btn-primary"
          style={{
            background: "white",
            color: "#1a4731",
            padding: "12px 22px",
            fontSize: 14,
            fontWeight: 800,
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Plus size={16} />
          Mulai Setor Sekarang
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
            Semua Kategori
          </span>
          <span className="badge badge-green" style={{ fontSize: 12 }}>
            {filtered.length} Jenis Sampah
          </span>
        </div>

        <div style={{ position: "relative", minWidth: 260 }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            placeholder="Cari jenis sampah..."
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

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#64748b" }}>
          <div className="spin" style={{ width: 36, height: 36, border: "3px solid #2d7a55", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 12px" }} />
          Memuat katalog sampah...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "64px 20px", color: "#64748b" }}>
          <Recycle size={48} color="#cbd5e1" style={{ margin: "0 auto 12px" }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
            Tidak ada jenis sampah ditemukan
          </div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            Coba gunakan kata kunci pencarian yang lain.
          </div>
        </div>
      ) : (
        /* Modern Cards Grid */
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
                  <div style={{ width: "100%", height: 140, overflow: "hidden", position: "relative" }}>
                    <img
                      src={k.foto}
                      alt={k.namaKategori}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.25) 100%)" }} />
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
                    <Icon size={42} color={design.color} style={{ opacity: 0.4 }} />
                  </div>
                )}

                <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    {/* Category Header with Icon & Tag */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 14,
                          background: design.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                          marginTop: k.foto ? -30 : 0,
                          border: k.foto ? "2px solid white" : "none",
                          position: "relative",
                        }}
                      >
                        <Icon size={24} color={design.color} />
                      </div>

                      <span className={`badge ${design.badge}`} style={{ fontSize: 11 }}>
                        {design.tag}
                      </span>
                    </div>

                  {/* Title & Description */}
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 8, lineHeight: 1.3 }}>
                      {k.namaKategori}
                    </h3>
                    <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.5, marginBottom: 16, minHeight: 36 }}>
                      {k.deskripsi || "Diterima dalam kondisi bersih dan kering untuk memudahkan proses daur ulang."}
                    </p>
                  </div>

                  {/* Price & Points Metric Chips */}
                  <div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                        background: "#f8fafc",
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: "1px solid #f1f5f9",
                        marginBottom: 16,
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 2 }}>
                          <Scale size={12} /> Harga / kg
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#1a4731" }}>
                          Rp {Number(k.hargaPerKg).toLocaleString("id-ID")}
                        </div>
                      </div>

                      <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 2 }}>
                          <Coins size={12} color="#d97706" /> Reward Poin
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#d97706" }}>
                          +{k.poinPerKg} <span style={{ fontSize: 11, fontWeight: 600 }}>poin/kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Direct Setor CTA */}
                    <Link
                      href="/nasabah/setor"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        width: "100%",
                        padding: "10px",
                        borderRadius: 10,
                        background: "#f0fdf4",
                        color: "#166534",
                        fontSize: 12.5,
                        fontWeight: 700,
                        textDecoration: "none",
                        border: "1px solid #bbf7d0",
                        transition: "all 0.15s ease",
                      }}
                    >
                      Setor Sampah Ini <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}