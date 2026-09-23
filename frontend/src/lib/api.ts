const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getAppKey(): string {
  const defaultKey =
    process.env.NEXT_PUBLIC_APP_KEY || "c51b4cce-6037-4bba-b28d-673c1effd7be";
  if (typeof window === "undefined") return defaultKey;
  const stored = localStorage.getItem("app_key");
  if (stored && stored.trim() !== "") {
    return stored.trim();
  }
  if (defaultKey) {
    try {
      localStorage.setItem("app_key", defaultKey);
    } catch {
    }
    return defaultKey;
  }
  return "";
}

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

interface ApiOptions {
  method?: string;
  body?: unknown;
  formData?: FormData;
  noAuth?: boolean;
}

async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {};

  const appKey = getAppKey();
  if (appKey) headers["x-app-key"] = appKey;

  const token = getToken();
  if (token && !options.noAuth) headers["Authorization"] = `Bearer ${token}`;

  if (options.body && !options.formData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.formData
      ? options.formData
      : options.body
      ? JSON.stringify(options.body)
      : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data?.message || "Terjadi kesalahan pada server.",
      errors: data?.errors,
    };
  }

  return data;
}

// Auth
export const authApi = {
  registerNasabah: (formData: FormData) =>
    apiFetch("/api/v1/auth/nasabah/register", { method: "POST", formData }),
  registerAdmin: (body: unknown) =>
    apiFetch("/api/v1/auth/admin/register", { method: "POST", body }),
  login: (body: unknown) =>
    apiFetch("/api/v1/auth/login", { method: "POST", body }),
  getMe: () => apiFetch("/api/v1/auth/me"),
};

// App Maker
export const makerApi = {
  register: (body: unknown) =>
    apiFetch("/api/v1/maker/register", { method: "POST", body }),
  login: (body: unknown) =>
    apiFetch("/api/v1/maker/login", { method: "POST", body }),
  getProfile: () => apiFetch("/api/v1/maker/profile"),
  checkKey: (email: string) =>
    apiFetch(`/api/v1/maker/check-key?email=${encodeURIComponent(email)}`),
};

// Nasabah (Admin CRUD)
export const nasabahApi = {
  getAll: () => apiFetch("/api/v1/admin/nasabah"),
  getById: (id: string) => apiFetch(`/api/v1/admin/nasabah/${id}`),
  create: (formData: FormData) =>
    apiFetch("/api/v1/admin/nasabah", { method: "POST", formData }),
  update: (id: string, formData: FormData) =>
    apiFetch(`/api/v1/admin/nasabah/${id}`, { method: "PUT", formData }),
  delete: (id: string) =>
    apiFetch(`/api/v1/admin/nasabah/${id}`, { method: "DELETE" }),
};

// Kategori Sampah
export const kategoriApi = {
  getAll: () => apiFetch("/api/v1/kategori-sampah"),
  getById: (id: string) => apiFetch(`/api/v1/kategori-sampah/${id}`),
  create: (formData: FormData) =>
    apiFetch("/api/v1/kategori-sampah", { method: "POST", formData }),
  update: (id: string, formData: FormData) =>
    apiFetch(`/api/v1/kategori-sampah/${id}`, { method: "PUT", formData }),
  delete: (id: string) =>
    apiFetch(`/api/v1/kategori-sampah/${id}`, { method: "DELETE" }),
};

// Setor Sampah
export const setorApi = {
  createPengajuan: (formData: FormData) =>
    apiFetch("/api/v1/setor-sampah/pengajuan", { method: "POST", formData }),
  getMySetor: () => apiFetch("/api/v1/setor-sampah/my-setor"),
  getAdminList: (params?: string) =>
    apiFetch(`/api/v1/setor-sampah/admin/list${params ? `?${params}` : ""}`),
  getById: (id: string) => apiFetch(`/api/v1/setor-sampah/${id}`),
  verify: (id: string, body: unknown) =>
    apiFetch(`/api/v1/setor-sampah/admin/verify/${id}`, {
      method: "PUT",
      body,
    }),
};

// Hadiah
export const hadiahApi = {
  getAll: () => apiFetch("/api/v1/hadiah"),
  getById: (id: string) => apiFetch(`/api/v1/hadiah/${id}`),
  create: (formData: FormData) =>
    apiFetch("/api/v1/hadiah", { method: "POST", formData }),
  update: (id: string, formData: FormData) =>
    apiFetch(`/api/v1/hadiah/${id}`, { method: "PUT", formData }),
  delete: (id: string) =>
    apiFetch(`/api/v1/hadiah/${id}`, { method: "DELETE" }),
};

// Penukaran Poin
export const penukaranApi = {
  tukar: (body: unknown) =>
    apiFetch("/api/v1/penukaran-poin/tukar", { method: "POST", body }),
  getMyPenukaran: () => apiFetch("/api/v1/penukaran-poin/my-penukaran"),
  getAdminList: () => apiFetch("/api/v1/penukaran-poin/admin/list"),
  updateStatus: (id: string, body: unknown) =>
    apiFetch(`/api/v1/penukaran-poin/admin/status/${id}`, {
      method: "PUT",
      body,
    }),
  getNota: (id: string) => apiFetch(`/api/v1/penukaran-poin/nota/${id}`),
};

// Dashboard & Rekapitulasi
export const dashboardApi = {
  getSummary: () => apiFetch("/api/v1/dashboard/summary"),
  getStats: () => apiFetch("/api/v1/dashboard/stats"),
  getRekapitulasi: (params: string) =>
    apiFetch(`/api/v1/rekapitulasi/bulanan?${params}`),
};
