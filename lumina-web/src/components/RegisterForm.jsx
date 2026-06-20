import { useState } from 'react'

import { styles } from '../styles/loginStyles'

function onlyNumbers(value) {
  return value.replace(/\D/g, '')
}

function RegisterForm({ onRegister, onBack }) {
  const [documento, setDocumento] = useState('')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const eyeOpen = '◡'
  const eyeClosed = '👁'

  function handleRegister() {
    const cleanDocument = onlyNumbers(documento)

    if (!cleanDocument || !nome || !email || !telefone || !senha || !confirmarSenha) {
      alert('Preencha todos os campos.')
      return
    }

    if (cleanDocument.length !== 11 && cleanDocument.length !== 14) {
      alert('Informe um CPF ou CNPJ válido.')
      return
    }

    if (senha.length < 6) {
      alert('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não conferem.')
      return
    }

    onRegister({
      documento: cleanDocument,
      documentType: cleanDocument.length === 11 ? 'CPF' : 'CNPJ',
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      telefone: onlyNumbers(telefone),
      senha,
      plan: {
        name: 'Lumina Essencial',
        status: 'trial_active',
        trialDays: 30,
        monthlyPrice: 120,
        currency: 'BRL',
        paymentMethod: 'credit_card_pending',
      },
    })
  }

  return (
    <>
      <p style={styles.helperText}>
        Comece com 30 dias grátis. Consulte nossos planos premium após o período de avaliação.
      </p>

      <input
        type="text"
        placeholder="CPF ou CNPJ"
        value={documento}
        onChange={(event) => {
            const onlyNumbers = event.target.value.replace(/\D/g, '')
            setDocumento(onlyNumbers)
        }}
        style={styles.input}
      />
      
      <input
        type="text"
        placeholder="Nome ou razão social"
        value={nome}
        onChange={(event) => setNome(event.target.value)}
        style={styles.input}
      />

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        style={styles.input}
      />

      <input
        type="tel"
        placeholder="Telefone / WhatsApp"
        value={telefone}
        onChange={(event) => setTelefone(event.target.value)}
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

      <div style={styles.passwordWrapper}>
        <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChange={(event) => setConfirmarSenha(event.target.value)}
            style={styles.passwordInput}
        />

        <button
            type="button"
            style={styles.passwordToggle}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
            {showConfirmPassword ? eyeClosed : eyeOpen}
        </button>
      </div>

      <button style={styles.button} onClick={handleRegister}>
        Criar conta grátis
      </button>

      <button style={styles.secondaryButton} onClick={onBack}>
        Voltar ao login
      </button>
    </>
  )
}

export default RegisterForm

