"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidth?: string;
  children: ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  maxWidth = "max-w-xl",
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.55)",
          backdropFilter: "blur(6px)",
          animation: "fadeIn 0.2s ease forwards",
        }}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className="fade-in"
        style={{
          position: "relative",
          background: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)",
          width: "100%",
          maxWidth: maxWidth === "max-w-2xl" ? "740px" : maxWidth === "max-w-lg" ? "520px" : "640px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 10,
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 26px 18px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#ffffff",
          }}
        >
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
              {title}
            </h3>
            {subtitle && (
              <p style={{ fontSize: 12.5, color: "#64748b", marginTop: 2 }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#fee2e2";
              e.currentTarget.style.color = "#dc2626";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.color = "#64748b";
            }}
            aria-label="Tutup"
          >
            <X size={17} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: "24px 26px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}