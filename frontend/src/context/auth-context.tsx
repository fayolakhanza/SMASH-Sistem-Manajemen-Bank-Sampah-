"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authApi } from "@/lib/api";

interface NasabahProfile {
  namaNasabah: string;
  alamat?: string;
  telp?: string;
  saldoPoin: number;
  foto?: string;
}

interface AdminProfile {
  namaUnit: string;
  namaPengelola: string;
  telp?: string;
}

export interface AuthUser {
  id: string;
  username: string;
  role: "NASABAH" | "ADMIN";
  nasabah?: NasabahProfile;
  adminBank?: AdminProfile;
  token?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  appKey: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  setAppKey: (key: string) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [appKey, setAppKeyState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadMe() {
    const res = (await authApi.getMe()) as { data: AuthUser };
    setUser(res.data);
    return res.data;
  }

  // Muat sesi yang tersimpan (kalau ada) saat pertama kali app dibuka
  useEffect(() => {
    const defaultKey =
      process.env.NEXT_PUBLIC_APP_KEY || "c51b4cce-6037-4bba-b28d-673c1effd7be";
    let storedKey = localStorage.getItem("app_key");
    if (!storedKey && defaultKey) {
      localStorage.setItem("app_key", defaultKey);
      storedKey = defaultKey;
    }
    const storedToken = localStorage.getItem("token");
    setAppKeyState(storedKey);

    if (storedToken) {
      loadMe()
        .catch(() => {
          // token basi / tidak valid lagi
          localStorage.removeItem("token");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(username: string, password: string) {
    const res = (await authApi.login({ username, password })) as {
      data: AuthUser;
    };
    const data = res.data;
    localStorage.setItem("token", data.token ?? "");
    setUser(data);
    return data;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  function setAppKey(key: string) {
    localStorage.setItem("app_key", key);
    setAppKeyState(key);
  }

  // Ambil ulang data user terbaru dari /auth/me — dipakai setelah aksi
  // yang mengubah data user, misal saldoPoin berubah setelah tukar poin.
  async function refreshUser() {
    try {
      await loadMe();
    } catch {
      // diamkan; kalau token basi, biarkan halaman yang butuh auth
      // yang menangani redirect ke login
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, appKey, isLoading, login, logout, setAppKey, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  }
  return ctx;
}