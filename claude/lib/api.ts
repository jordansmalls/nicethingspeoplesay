import { User, Thing } from '@/stores/useAppStore'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`

  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP ${response.status}: ${response.statusText}`,
    }))
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
}

/* ================= AUTH API ================= */

export const signup = (data: { email: string; password: string }) =>
  request<User>('/api/auth', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const checkEmailAvailability = (email: string) =>
  request<{ message: string; taken: boolean }>(
    `/api/auth/check-email/${encodeURIComponent(email)}`,
    { method: 'GET' }
  )

export const login = (data: { email: string; password: string }) =>
  request<User>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const logout = () =>
  request<{ message: string }>('/api/auth/logout', {
    method: 'POST',
  })

export const updatePassword = (data: {
  currentPassword: string
  newPassword: string
}) =>
  request<{ message: string }>('/api/auth/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  })

export const deleteAccount = () =>
  request<{ message: string }>('/api/auth', {
    method: 'DELETE',
  })

export const fetchUserAccount = () =>
  request<User>('/api/auth', {
    method: 'GET',
  })

/* ================= THINGS API ================= */

export const createThing = (data: {
  thing: string
  who: string
  why?: string
}) =>
  request<Thing>('/api/things', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getAllThings = () =>
  request<Thing[]>('/api/things', {
    method: 'GET',
  })

export const getThing = (id: string) =>
  request<Thing>(`/api/things/${id}`, {
    method: 'GET',
  })

export const updateThing = (
  id: string,
  data: { thing: string; who: string; why?: string }
) =>
  request<Thing>(`/api/things/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

export const deleteThing = (id: string) =>
  request<{ message: string }>(`/api/things/${id}`, {
    method: 'DELETE',
  })

export const deleteAllThings = () =>
  request<{ message: string }>('/api/things', {
    method: 'DELETE',
  })

export const exportThings = async (format: 'json' | 'txt') => {
  const url = `${API_BASE}/api/things/export?format=${format}`

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP ${response.status}: ${response.statusText}`,
    }))
    throw new Error(error.message || 'Export failed')
  }

  const blob = await response.blob()
  const downloadUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = `things-export-${Date.now()}.${format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(downloadUrl)
}