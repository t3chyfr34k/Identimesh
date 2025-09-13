import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { apiFetch } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  token: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      } catch (error) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Invalid email or password')
        return false
      }
      const userData: User = { id: data.user._id || data.user.id, name: data.user.name, email: data.user.email }
      setUser(userData)
      setToken(data.token)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', data.token)
      toast.success('Logged in successfully')
      navigate('/dashboard')
      return true
    } catch (error) {
      toast.error('Failed to login')
      return false
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const res = await apiFetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Failed to create account')
        return false
      }
      const userData: User = { id: data.user._id || data.user.id, name: data.user.name, email: data.user.email }
      setUser(userData)
      setToken(data.token)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', data.token)
      toast.success('Account created successfully')
      navigate('/dashboard')
      return true
    } catch (error) {
      toast.error('Failed to create account')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
