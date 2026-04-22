import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authAPI.getMe()
        .then(res => setUser(res.data))
        .catch(() => { localStorage.removeItem('token'); localStorage.removeItem('user') })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  // Save the URL the user was trying to visit before being redirected to login
  const saveRedirectPath = (path) => {
    if (path && path !== '/login' && path !== '/register') {
      sessionStorage.setItem('redirectAfterLogin', path)
    }
  }

  // Get and clear the saved redirect path
  const getAndClearRedirectPath = () => {
    const path = sessionStorage.getItem('redirectAfterLogin')
    sessionStorage.removeItem('redirectAfterLogin')
    return path
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, saveRedirectPath, getAndClearRedirectPath }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
