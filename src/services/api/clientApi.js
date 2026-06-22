import { apiClient } from './apiClient'

export function getClients() {
  return apiClient.get('/clients')
}

export function createClient(clientData) {
  return apiClient.post('/clients', clientData)
}

export function updateClient(clientId, clientData) {
  return apiClient.put(
    `/clients/${clientId}`,
    clientData,
  )
}

