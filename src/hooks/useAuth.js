import { useEffect, useState } from 'react'

import {
  getCurrentAccount,
  loginAccount,
  logoutAccount,
  registerAccount,
} from '../services/api/authApi'

import { getToken } from '../services/api/apiClient'

function getTrialDaysLeft(trial_expires_at) {
  if (!trial_expires_at) return 0
  const expires = new Date(trial_expires_at)
  const now = new Date()
  const diff = Math.ceil((expires - now) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    async function loadSession() {
      if (!getToken()) {
        setLoading(false)
        return
      }
      try {
        const account = await getCurrentAccount()
        setSession(account)
      } catch {
        logoutAccount()
        setSession(null)
      } finally {
        setLoading(false)
      }
    }
    loadSession()
  }, [])

  async function login(credentials) {
    await loginAccount(credentials)
    const account = await getCurrentAccount()
    setSession(account)
    return account
  }

  async function register(data) {
    await registerAccount(data)
    await loginAccount({ email: data.email, senha: data.senha })
    const account = await getCurrentAccount()
    setSession(account)
    return account
  }

  function recover() {
    throw new Error('Recuperação de senha será integrada ao backend na próxima etapa.')
  }

  function logout() {
    logoutAccount()
    setSession(null)
  }

  const isTrialExpired = session?.trial_status === 'expired'
  const isTrial = session?.plano === 'trial' && session?.trial_status === 'active'
  const trialDaysLeft = isTrial ? getTrialDaysLeft(session?.trial_expires_at) : 0

  return {
    session,
    loading,
    isAuthenticated: Boolean(session),
    isTrialExpired,
    isTrial,
    trialDaysLeft,
    login,
    register,
    recover,
    logout,
  }
}

export default useAuth

