import {
  apiClient,
  removeToken,
  saveToken,
} from './apiClient'

export async function registerAccount(data) {
  return apiClient.post('/auth/register', {
    nome: data.nome,
    email: data.email,
    documento: data.documento,
    telefone: data.telefone,
    password: data.senha,
  })
}

export async function loginAccount(credentials) {
  const formData = new URLSearchParams()

  formData.append('username', credentials.email)
  formData.append('password', credentials.senha)

  const response = await fetch(
    '/api/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    },
  )

  if (!response.ok) {
    throw new Error('E-mail ou senha inválidos.')
  }

  const data = await response.json()

  if (data?.access_token) {
    saveToken(data.access_token)
  }

  return data
}

export async function getCurrentAccount() {
  return apiClient.get('/auth/me')
}

export function logoutAccount() {
  removeToken()
}


