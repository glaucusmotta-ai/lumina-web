import { useState } from 'react'

import { styles } from '../styles/loginStyles'

const eyeOpen = '◡'
const eyeClosed = '👁'

function LoginForm({ onLogin, onRegister, onForgotPassword }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function validateFields() {
    if (!email || !senha) {
      alert('Preencha e-mail e senha.')
      return false
    }

    return true
  }

  function handleLogin() {
    if (!validateFields()) return

    onLogin({ email, senha })
  }

  function handleRegister() {
    onRegister()
  }

  return (
    <>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        style={styles.input}
      />

      <div style={styles.passwordWrapper}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          style={styles.passwordInput}
        />

        <button
          type="button"
          style={styles.passwordToggle}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? eyeClosed : eyeOpen}
        </button>
      </div>

      <button style={styles.button} onClick={handleLogin}>
        Entrar
      </button>

      <button style={styles.secondaryButton} onClick={handleRegister}>
        Criar acesso
      </button>

      <button style={styles.linkButton} onClick={onForgotPassword}>
        Esqueci minha senha
      </button>
    </>
  )
}

export default LoginForm


