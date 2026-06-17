import { useState } from 'react'

import useAuth from '../hooks/useAuth'
import { styles } from '../styles/loginStyles'

function LoginScreen() {
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function handleLogin() {
    if (!email || !senha) {
      alert('Preencha e-mail e senha.')
      return
    }

    login()

    window.location.reload()
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

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          style={styles.input}
        />

        <button
          style={styles.button}
          onClick={handleLogin}
        >
          Entrar
        </button>

        <button
          style={styles.secondaryButton}
          onClick={handleLogin}
        >
          Criar acesso
        </button>
      </div>
    </div>
  )
}

export default LoginScreen


