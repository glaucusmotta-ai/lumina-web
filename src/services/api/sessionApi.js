import { apiClient } from './apiClient'

export function getSessions() {
  return apiClient.get('/sessions')
}

export function createSession(sessionData) {
  return apiClient.post('/sessions', sessionData)
}

