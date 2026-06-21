import { apiClient } from './apiClient'

export function getClients() {
  return apiClient.get('/clients')
}

export function createClient(clientData) {
  return apiClient.post('/clients', clientData)
}

