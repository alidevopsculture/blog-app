import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (response.ok) {
        const data = await response.json()
        const userWithAvatar = {
          ...data.user,
          avatar: data.user.avatar || `https://ui-avatars.com/api/?name=${data.user.name}&background=random`
        }
        setUser(userWithAvatar)
        localStorage.setItem('user', JSON.stringify(userWithAvatar))
        localStorage.setItem('token', data.token)
        return userWithAvatar
      } else {
        const error = await response.json()
        alert(error.message)
        return null
      }
    } catch (error) {
      alert('Login failed')
      return null
    }
  }

  const signup = async (email, password, name, otp) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, otp })
      })
      
      if (response.ok) {
        const data = await response.json()
        const userWithAvatar = {
          ...data.user,
          avatar: data.user.avatar || `https://ui-avatars.com/api/?name=${data.user.name}&background=random`
        }
        setUser(userWithAvatar)
        localStorage.setItem('user', JSON.stringify(userWithAvatar))
        localStorage.setItem('token', data.token)
        return userWithAvatar
      } else {
        const error = await response.json()
        alert(error.message)
        return null
      }
    } catch (error) {
      alert('Signup failed')
      return null
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}