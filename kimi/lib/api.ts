// import { User, Thing, LoginInput, SignupInput, CreateThingInput, UpdateThingInput, UpdatePasswordInput } from "@/types";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// async function request<T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const url = `${API_BASE}${endpoint}`;

//   const response = await fetch(url, {
//     ...options,
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       ...options.headers,
//     },
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ message: "An error occurred" }));
//     throw new Error(error.message || `HTTP ${response.status}`);
//   }

//   return response.json();
// }

// // Auth endpoints
// export const signup = (data: SignupInput) =>
//   request<User>("/api/auth", { method: "POST", body: JSON.stringify(data) });

// export const checkEmailAvailability = (email: string) =>
//   request<{ message: string; taken: boolean }>(`/api/auth/check-email/${encodeURIComponent(email)}`);

// export const login = (data: LoginInput) =>
//   request<User>("/api/auth/login", { method: "POST", body: JSON.stringify(data) });

// export const logout = () =>
//   request<{ message: string }>("/api/auth/logout", { method: "POST" });

// export const updateAccountPassword = (data: UpdatePasswordInput) =>
//   request<{ message: string }>("/api/auth/password", {
//     method: "PUT",
//     body: JSON.stringify(data),
//   });

// export const deleteAccount = () =>
//   request<{ message: string }>("/api/auth", { method: "DELETE" });

// export const fetchUserAccount = () =>
//   request<User>("/api/auth");

// // Thing endpoints
// export const createThing = (data: CreateThingInput) =>
//   request<Thing>("/api/things", { method: "POST", body: JSON.stringify(data) });

// export const getAllThings = () =>
//   request<Thing[]>("/api/things");

// export const getThing = (id: string) =>
//   request<Thing>(`/api/things/${id}`);

// export const updateThing = (id: string, data: UpdateThingInput) =>
//   request<Thing>(`/api/things/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(data),
//   });

// export const deleteThing = (id: string) =>
//   request<{ message: string }>(`/api/things/${id}`, { method: "DELETE" });

// export const deleteAllThings = () =>
//   request<{ message: string }>("/api/things", { method: "DELETE" });

// export const exportThings = async (format: "json" | "txt") => {
//   const response = await fetch(`${API_BASE}/api/things/export?format=${format}`, {
//     credentials: "include",
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ message: "Export failed" }));
//     throw new Error(error.message);
//   }

//   const blob = await response.blob();
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `things.${format}`;
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
//   window.URL.revokeObjectURL(url);
// };

// lib/api.ts
import { User, Thing, LoginInput, SignupInput, CreateThingInput, UpdateThingInput, UpdatePasswordInput } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth endpoints
export const signup = (data: SignupInput) =>
  request<User>("/api/auth", { method: "POST", body: JSON.stringify(data) });

export const checkEmailAvailability = (email: string) =>
  request<{ message: string; taken: boolean }>(`/api/auth/check-email/${encodeURIComponent(email)}`);

export const login = (data: LoginInput) =>
  request<User>("/api/auth/login", { method: "POST", body: JSON.stringify(data) });

export const logout = () =>
  request<{ message: string }>("/api/auth/logout", { method: "POST" });

export const updateAccountPassword = (data: UpdatePasswordInput) =>
  request<{ message: string }>("/api/auth/password", {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteAccount = () =>
  request<{ message: string }>("/api/auth", { method: "DELETE" });

export const fetchUserAccount = () =>
  request<User>("/api/auth");

// Thing endpoints
export const createThing = (data: CreateThingInput) =>
  request<Thing>("/api/things", { method: "POST", body: JSON.stringify(data) });

export const getAllThings = () =>
  request<Thing[]>("/api/things");

export const getThing = (id: string) =>
  request<Thing>(`/api/things/${id}`);

export const updateThing = (id: string, data: UpdateThingInput) =>
  request<Thing>(`/api/things/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteThing = (id: string) =>
  request<{ message: string }>(`/api/things/${id}`, { method: "DELETE" });

export const deleteAllThings = () =>
  request<{ message: string }>("/api/things", { method: "DELETE" });

export const exportThings = async (format: "json" | "txt") => {
  const response = await fetch(`${API_BASE}/api/things/export?format=${format}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Export failed" }));
    throw new Error(error.message);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `things.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};