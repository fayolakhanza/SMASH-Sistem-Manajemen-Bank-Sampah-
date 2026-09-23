"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  LayoutDashboard,
  List,
  Truck,
  History,
  Gift,
  Users,
  BarChart3,
  CheckSquare,
  FileText,
  LogOut,
  Plus,
  Recycle,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const nasabahMenus = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/nasabah/kategori", icon: List, label: "Katalog Sampah" },
  { href: "/nasabah/setor", icon: Truck, label: "Setor Sampah" },
  { href: "/nasabah/riwayat", icon: History, label: "Riwayat" },
  { href: "/nasabah/hadiah", icon: Gift, label: "Tukar Poin" },
];

const adminMenus = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/nasabah", icon: Users, label: "Kelola Nasabah" },
  { href: "/admin/kategori", icon: List, label: "Kategori Sampah" },
  { href: "/admin/setor", icon: CheckSquare, label: "Verifikasi Setor" },
  { href: "/admin/hadiah", icon: Gift, label: "Kelola Hadiah" },
  { href: "/admin/penukaran", icon: Recycle, label: "Penukaran Poin" },
  { href: "/admin/rekapitulasi", icon: BarChart3, label: "Rekapitulasi" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getLevelLabel(poin: number) {
  if (poin >= 5000) return "Level Platinum";
  if (poin >= 2000) return "Level Gold";
  if (poin >= 500) return "Level Kolektor";
  return "Level Pemula";
}

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  showSetor?: boolean;
  actionLabel?: string;
}

export default function AppShell({
  children,
  title,
  showSetor = true,
  actionLabel,
}: AppShellProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Sidebar toggle state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";
  const menus = isAdmin ? adminMenus : nasabahMenus;
  const displayName = isAdmin
    ? user.adminBank?.namaUnit || user.username
    : user.nasabah?.namaNasabah || user.username;
  const saldoPoin = user.nasabah?.saldoPoin ?? 0;

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  return (
    <div className={`app-layout ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* Logo & Toggle */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-content">
            <div className="sidebar-logo-icon">
              <Recycle size={20} color="white" />
            </div>
            {!isCollapsed && <span className="sidebar-logo-text">SMASH</span>}
          </div>

          {/* Desktop Toggle Button */}
          <button
            type="button"
            className="sidebar-toggle-btn desktop-only"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            className="sidebar-toggle-btn mobile-only"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Tutup Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menus.map((menu) => {
            const active =
              pathname === menu.href || pathname.startsWith(menu.href + "/");
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`sidebar-item ${active ? "active" : ""}`}
                title={isCollapsed ? menu.label : undefined}
              >
                <menu.icon size={19} className="sidebar-item-icon" />
                {!isCollapsed && <span>{menu.label}</span>}
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="sidebar-item sidebar-logout-btn"
            title={isCollapsed ? "Keluar" : undefined}
          >
            <LogOut size={19} className="sidebar-item-icon" />
            {!isCollapsed && <span>Keluar</span>}
          </button>
        </nav>

        {/* User info */}
        <div className="sidebar-user">
          <div className="sidebar-user-card">
            <div className="sidebar-avatar">
              {user.nasabah?.foto ? (
                <img
                  src={user.nasabah.foto}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                getInitials(displayName)
              )}
            </div>
            {!isCollapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sidebar-user-name">{displayName}</div>
                <div className="sidebar-user-badge">
                  <FileText size={10} />
                  {isAdmin ? "Admin Bank Sampah" : getLevelLabel(saldoPoin)}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="app-content">
        {/* Header (Search bar removed per request) */}
        <header className="app-header">
          {/* Mobile hamburger menu button */}
          <button
            type="button"
            className="header-mobile-toggle"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Buka Menu"
          >
            <Menu size={22} />
          </button>

          {/* Desktop quick toggle if sidebar is collapsed */}
          {isCollapsed && (
            <button
              type="button"
              className="header-collapse-toggle desktop-only"
              onClick={() => setIsCollapsed(false)}
              title="Buka Sidebar"
            >
              <PanelLeftOpen size={20} />
            </button>
          )}

          {/* Title or Brand on Header */}
          <div className="app-header-brand">
            <span className="app-header-title">
              {isAdmin ? "Portal Pengelola Bank Sampah" : "Bank Sampah Digital"}
            </span>
          </div>

          <div className="app-header-actions">
            {!isAdmin && showSetor && (
              <Link href="/nasabah/setor" className="btn-primary">
                <Plus size={15} />
                <span className="btn-text-desktop">Setor Baru</span>
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="main-area fade-in">
          {title && (
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                {title}
              </h1>
            </div>
          )}
          {children}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="app-footer-content">
            <div className="app-footer-brand">
              <div className="app-footer-logo-icon">
                <Recycle size={15} color="white" />
              </div>
              <span className="app-footer-brand-text">
                <strong>SMASH</strong> — Bank Sampah Digital & Daur Ulang
              </span>
            </div>
            <div className="app-footer-copyright">
              © {new Date().getFullYear()} SMASH. Wujudkan lingkungan hijau, bersih, dan berkelanjutan.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}