import { apiClient } from './apiClient'

export async function getSessions() {
  const response = await apiClient.get('/sessions')
  return response.data
}

export async function createSession(sessionData) {
  const response = await apiClient.post('/sessions', sessionData)
  return response.data
}

export async function updateSession(sessionId, sessionData) {
  const response = await apiClient.put(
    `/sessions/${sessionId}`,
    sessionData
  )

  return response.data
}

export async function deleteSession(sessionId) {
  const response = await apiClient.delete(
    `/sessions/${sessionId}`
  )

  return response.data
}


