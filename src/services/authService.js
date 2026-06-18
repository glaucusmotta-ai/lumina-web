const USERS_KEY = 'lumina_users'
const SESSION_KEY = 'lumina_auth_session'

function getUsers() {
  const data = localStorage.getItem(USERS_KEY)

  if (!data) {
    return []
  }

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result.toISOString()
}

function createSession(user) {
  const session = {
    id: user.id,
    email: user.email,
    nome: user.nome,
    documento: user.documento,
    documentType: user.documentType,
    plan: user.plan,
    createdAt: new Date().toISOString(),
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))

  return session
}

export function getSession() {
  const data = localStorage.getItem(SESSION_KEY)

  if (!data) {
    return null
  }

  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export function registerUser(data) {
  const users = getUsers()

  const normalizedEmail = data.email.trim().toLowerCase()
  const cleanDocument = data.documento.replace(/\D/g, '')

  const alreadyExists = users.some((user) => {
    return user.email === normalizedEmail || user.documento === cleanDocument
  })

  if (alreadyExists) {
    throw new Error('Já existe uma conta com este e-mail, CPF ou CNPJ.')
  }

  const trialStartedAt = new Date().toISOString()
  const trialEndsAt = addDays(trialStartedAt, 30)

  const newUser = {
    id: crypto.randomUUID(),
    documento: cleanDocument,
    documentType: data.documentType,
    nome: data.nome.trim(),
    email: normalizedEmail,
    telefone: data.telefone,
    senha: data.senha,
    plan: {
      name: data.plan?.name || 'Lumina Essencial',
      status: 'trial_active',
      trialDays: 30,
      monthlyPrice: 120,
      currency: 'BRL',
      paymentMethod: 'credit_card_pending',
      trialStartedAt,
      trialEndsAt,
    },
    billing: {
      status: 'pending',
      method: 'credit_card',
      amount: 120,
      currency: 'BRL',
    },
    createdAt: new Date().toISOString(),
  }

  saveUsers([...users, newUser])

  return createSession(newUser)
}

export function loginUser({ email, senha }) {
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()

  const user = users.find(
    (item) => item.email === normalizedEmail && item.senha === senha
  )

  if (!user) {
    throw new Error('E-mail ou senha inválidos.')
  }

  return createSession(user)
}

export function recoverPassword(email) {
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()

  const user = users.find((item) => item.email === normalizedEmail)

  if (!user) {
    throw new Error('Nenhuma conta encontrada com este e-mail.')
  }

  return user.senha
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
}


