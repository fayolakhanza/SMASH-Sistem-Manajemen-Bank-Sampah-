"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function TopBar() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="flex items-center justify-end px-5 py-3 border-b border-smash-100">
      {!isAdmin && (
        <button
          onClick={() => router.push("/nasabah/setor")}
          className="flex items-center gap-1.5 bg-smash-600 hover:bg-smash-800 text-white text-xs font-medium rounded-lg px-3.5 py-2 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Setor Baru
        </button>
      )}
    </div>
  );
}