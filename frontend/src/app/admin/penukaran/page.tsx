"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import AppShell from "@/components/AppShell";
import { penukaranApi } from "@/lib/api";
import {
  Coins,
  Clock,
  CheckCircle2,
  XCircle,
  PackageCheck,
  Gift,
  Sparkles,
  Ticket,
  User,
  Search,
} from "lucide-react";

interface Penukaran {
  id: string;
  kodePenukaran: string;
  kodeVoucher?: string;
  tanggal: string;
  status: string;
  nasabah?: { namaNasabah: string; username?: string };
  hadiah?: { namaHadiah: string };
  poinDigunakan?: number;
  poinTerpakai?: number;
}

function getPenukaranStatus(statusStr?: string) {
  const s = (statusStr || "").toUpperCase();
  if (s.includes("SELESAI")) {
    return { label: "Selesai", cls: "badge badge-green", icon: CheckCircle2, next: null };
  }
  if (s.includes("TOLAK")) {
    return { label: "Ditolak", cls: "badge badge-red", icon: XCircle, next: null };
  }
  if (s.includes("PROSES")) {
    return { label: "Diproses", cls: "badge badge-blue", icon: PackageCheck, next: "selesai" };
  }
  return { label: "Menunggu", cls: "badge badge-yellow", icon: Clock, next: "diproses" };
}

export default function AdminPenukaranPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Penukaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    penukaranApi
      .getAdminList()
      .then((res: unknown) => {
        const r = res as { data: Penukaran[] };
        setData(r.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    if (user) load();
  }, [user]);

  async function handleUpdate(p: Penukaran, status: string) {
    setUpdatingId(p.id);
    try {
      await penukaranApi.updateStatus(p.id, { status });
      load();
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = data.filter((p) =>
    (
      p.kodePenukaran +
      " " +
      (p.nasabah?.namaNasabah || "") +
      " " +
      (p.hadiah?.namaHadiah || "") +
      " " +
      (p.kodeVoucher || "")
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPoinDitukar = data.reduce(
    (acc, p) => acc + (p.poinDigunakan ?? p.poinTerpakai ?? 0),
    0
  );

  return (
    <AppShell title="Klaim Penukaran Poin">
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
            <Ticket size={14} color="#86efac" />
            <span
              style={{
                color: "#dcfce7",
                fontSize: 11.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Klaim Voucher & Hadiah
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", marginBottom: 6 }}>
            {data.length} Permintaan Penukaran
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", maxWidth: 520, lineHeight: 1.5 }}>
            Validasi klaim reward nasabah, ubah status pemrosesan voucher, dan pastikan hadiah terkirim dengan tepat.
          </p>
        </div>

        <div style={{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(4px)", padding: "14px 22px", borderRadius: 16, border: "1px solid rgba(255, 255, 255, 0.25)" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Total Poin Diklaim</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "white" }}>
            {totalPoinDitukar.toLocaleString("id-ID")} Poin
          </div>
        </div>
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
            Daftar Klaim
          </span>
          <span className="badge badge-green" style={{ fontSize: 12 }}>
            {filtered.length} Transaksi
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
            placeholder="Cari kode, nasabah, hadiah..."
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

      {/* Modern Table Card with Deep Shadow */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#64748b" }}>
            <div className="spin" style={{ width: 36, height: 36, border: "3px solid #2d7a55", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 12px" }} />
            Memuat data penukaran...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 20px", color: "#64748b" }}>
            <Coins size={48} color="#cbd5e1" style={{ margin: "0 auto 12px" }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Belum ada riwayat penukaran poin
            </div>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: "none" }}>
            <table>
              <thead>
                <tr>
                  <th>Kode Klaim</th>
                  <th>Nasabah</th>
                  <th>Item Hadiah</th>
                  <th>Tanggal</th>
                  <th style={{ textAlign: "right" }}>Poin</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Aksi Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const status = getPenukaranStatus(p.status);
                  const StatusIcon = status.icon;
                  const poin = p.poinDigunakan ?? p.poinTerpakai ?? 0;
                  const isMenunggu = p.status.toUpperCase().includes("MENUNGGU") || p.status.toUpperCase().includes("PROSES");

                  return (
                    <tr key={p.id}>
                      <td>
                        <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: "#1a4731" }}>
                          {p.kodePenukaran}
                        </span>
                        {p.kodeVoucher && (
                          <div style={{ fontSize: 11, color: "#2563eb", fontFamily: "monospace" }}>
                            Voucher: {p.kodeVoucher}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 13.5 }}>
                          {p.nasabah?.namaNasabah || "Nasabah"}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "#1e293b" }}>
                          <Gift size={14} color="#16a34a" />
                          {p.hadiah?.namaHadiah || "Hadiah Reward"}
                        </div>
                      </td>
                      <td style={{ color: "#64748b", fontSize: 12.5 }}>
                        {new Date(p.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span className="badge badge-yellow" style={{ fontSize: 12.5 }}>
                          <Coins size={12} /> {poin.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td>
                        <span className={status.cls} style={{ fontSize: 11.5 }}>
                          <StatusIcon size={12} /> {status.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                          {status.next && (
                            <button
                              onClick={() => handleUpdate(p, status.next!)}
                              disabled={updatingId === p.id}
                              className="btn-primary"
                              style={{
                                padding: "6px 14px",
                                fontSize: 12,
                                background: status.next === "selesai" ? "#16a34a" : "var(--primary)",
                              }}
                            >
                              {updatingId === p.id
                                ? "..."
                                : status.next === "selesai"
                                ? "Tandai Selesai"
                                : "Proses Klaim"}
                            </button>
                          )}
                          {isMenunggu && (
                            <button
                              onClick={() => handleUpdate(p, "ditolak")}
                              disabled={updatingId === p.id}
                              style={{
                                padding: "6px 12px",
                                background: "#fef2f2",
                                color: "#dc2626",
                                border: "1px solid #fecaca",
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Tolak
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}