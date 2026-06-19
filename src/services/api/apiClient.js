const API_BASE_URL = 'https://api-lumina.3g-brasil.com'

const TOKEN_KEY = 'lumina_token'

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request(endpoint, options = {}) {
  const token = getToken()
  const customHeaders = options.headers || {}

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    },
  })

  if (!response.ok) {
    let errorMessage = 'Erro na comunicação com a API.'

    try {
      const errorData = await response.json()

      if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail
      } else if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail
          .map((item) => item.msg || JSON.stringify(item))
          .join('\n')
      } else if (errorData.message) {
        errorMessage = errorData.message
      }
    } catch {
      //
    }

    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const apiClient = {
  get(endpoint) {
    return request(endpoint)
  },

  post(endpoint, body) {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  put(endpoint, body) {
    return request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  },

  delete(endpoint) {
    return request(endpoint, {
      method: 'DELETE',
    })
  },
}


