import { useState } from 'react'

import { styles } from '../styles/loginStyles'

function ForgotPasswordForm({ onRecover, onBack }) {
  const [email, setEmail] = useState('')

  function handleRecover() {
    if (!email) {
      alert('Preencha o e-mail.')
      return
    }

    onRecover(email)
  }

  return (
    <>
      <p style={styles.helperText}>
        Informe seu e-mail para recuperar o acesso local.
      </p>

      <input
        type="email"
        placeholder="E-mail cadastrado"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        style={styles.input}
      />

      <button style={styles.button} onClick={handleRecover}>
        Recuperar senha
      </button>

      <button style={styles.secondaryButton} onClick={onBack}>
        Voltar ao login
      </button>
    </>
  )
}

export default ForgotPasswordForm

