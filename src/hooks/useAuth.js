import { useState } from 'react'

const STORAGE_KEY = 'lumina_auth'

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  })

  function login() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsAuthenticated(true)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    login,
    logout,
  }
}

export default useAuth


