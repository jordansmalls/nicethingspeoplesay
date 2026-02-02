// lib/api.ts
interface User {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface Thing {
  _id: string;
  thing: string;
  who: string;
  why?: string;
  createdAt: string;
  updatedAt: string;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const signup = (data: { email: string; password: string }) =>
  request<User>("/api/auth", { method: "POST", body: JSON.stringify(data) });

export const checkEmailAvailability = (email: string) =>
  request<{ message: string; taken: boolean }>(`/api/auth/check-email/${encodeURIComponent(email)}`);

export const login = (data: { email: string; password: string }) =>
  request<User>("/api/auth/login", { method: "POST", body: JSON.stringify(data) });

export const logout = () => request<{ message: string }>("/api/auth/logout", { method: "POST" });

export const updateAccountPassword = (data: { currentPassword: string; newPassword: string }) =>
  request<{ message: string }>("/api/auth/password", { method: "PUT", body: JSON.stringify(data) });

export const deleteAccount = () => request<{ message: string }>("/api/auth", { method: "DELETE" });

export const fetchUserAccount = () => request<User>("/api/auth");

export const createThing = (data: { thing: string; who: string; why?: string }) =>
  request<Thing>("/api/things", { method: "POST", body: JSON.stringify(data) });

export const getAllThings = () => request<Thing[]>("/api/things");

export const getThing = (id: string) => request<Thing>(`/api/things/${id}`);

export const updateThing = (id: string, data: { thing: string; who: string; why?: string }) =>
  request<Thing>(`/api/things/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteThing = (id: string) => request<{ message: string }>(`/api/things/${id}`, { method: "DELETE" });

export const deleteAllThings = () => request<{ message: string }>("/api/things", { method: "DELETE" });

export const exportThings = async (format: "json" | "txt") => {
  const res = await fetch(`/api/things/export?format=${format}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.blob();
};