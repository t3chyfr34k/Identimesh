export interface SearchMatchPoints {
  username: boolean
  bio: boolean
  location: boolean
  joinDate: boolean
  postingPattern: boolean
}

export interface SearchMatchStatus {
  type: 'pending' | 'confirmed' | 'flagged'
  default?: 'pending'
}

export interface SearchMatchItem {
  id: string
  username: string
  platform: string
  profilePic?: string
  bio?: string
  location?: string
  joinDate?: Date | string
  posts?: number
  followers?: number
  confidence?: number
  matchPoints?: SearchMatchPoints
  status?: SearchMatchStatus | SearchMatchStatus['type']
  confirmedDate?: Date | string
  notes?: string
}

export interface SearchSourceProfile {
  username: string
  platform: string
  profilePic?: string
  bio?: string
  location?: string
  joinDate?: Date | string
  posts?: number
  followers?: number
}

export interface SearchResultInput {
  userId?: string
  searchDate?: Date | string
  sourceProfile?: SearchSourceProfile
  matches?: SearchMatchItem[]
  searchTerm?: string
  totalMatches?: number
}

export interface SaveSearchResultResponse {
  success: boolean
  id?: string
  error?: string
}

export const initMongoDB = async () => ({ isConnected: true })

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

import { apiFetch } from './api'

export async function saveSearchResult(data: SearchResultInput): Promise<SaveSearchResultResponse> {
  const res = await apiFetch('/api/search-results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to save search result: ${res.status} ${text}`)
  }
  return res.json()
}
