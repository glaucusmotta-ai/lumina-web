import { useState } from 'react'

import ForgotPasswordForm from '../components/ForgotPasswordForm'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import useAuth from '../hooks/useAuth'
import { styles } from '../styles/loginStyles'

function LoginScreen() {
  const { login, register, recover } = useAuth()
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)

  async function handleLogin(credentials) {
    try {
      setLoading(true)
      await login(credentials)
      window.location.reload()
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(data) {
    try {
      setLoading(true)
      await register(data)
      alert('Conta criada com sucesso. Bem-vindo ao Lumina.')
      window.location.reload()
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleRecover(email) {
    try {
      recover(email)
    } catch (error) {
      alert(error.message)
      setMode('login')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          Lumina
        </div>

        <div style={styles.subtitle}>
          serenidade para sua rotina
        </div>

        {loading && (
          <p style={styles.helperText}>
            Processando...
          </p>
        )}

        {mode === 'login' && !loading && (
          <LoginForm
            onLogin={handleLogin}
            onRegister={() => setMode('register')}
            onForgotPassword={() => setMode('forgot')}
          />
        )}

        {mode === 'forgot' && !loading && (
          <ForgotPasswordForm
            onRecover={handleRecover}
            onBack={() => setMode('login')}
          />
        )}

        {mode === 'register' && !loading && (
          <RegisterForm
            onRegister={handleRegister}
            onBack={() => setMode('login')}
          />
        )}
      </div>
    </div>
  )
}

export default LoginScreen


