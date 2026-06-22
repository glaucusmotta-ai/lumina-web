import { apiClient } from './apiClient'

function unwrapResponse(response) {
  if (response?.data) {
    return response.data
  }

  return response
}

export async function getSessions() {
  const response = await apiClient.get('/sessions')
  return unwrapResponse(response)
}

export async function createSession(sessionData) {
  const response = await apiClient.post('/sessions', sessionData)
  return unwrapResponse(response)
}

export async function updateSession(sessionId, sessionData) {
  const response = await apiClient.put(
    `/sessions/${sessionId}`,
    sessionData,
  )

  return unwrapResponse(response)
}

export async function deleteSession(sessionId) {
  const response = await apiClient.delete(
    `/sessions/${sessionId}`,
  )

  return unwrapResponse(response)
}


