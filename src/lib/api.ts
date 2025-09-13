const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export function apiUrl(path: string) {
  return `${API_BASE}${path}`
}

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders(),
    ...(init.headers || {}),
  } as Record<string, string>
  return fetch(apiUrl(path), { ...init, headers })
}

export type SearchListItem = {
  _id: string
  userId: string
  searchDate: string
  sourceProfile?: { username?: string; platform?: string }
  matches?: any[]
  searchTerm?: string
  totalMatches?: number
  createdAt?: string
}

export async function listSearchResults(): Promise<{ success: boolean; data: SearchListItem[] }> {
  const res = await apiFetch('/api/search-results', { method: 'GET' })
  if (!res.ok) throw new Error(`Failed to load history: ${res.status}`)
  return res.json()
}