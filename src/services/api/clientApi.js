import { apiClient } from './apiClient'

function unwrapResponse(response) {
  if (response?.data) {
    return response.data
  }

  return response
}

export async function getClients() {
  const response = await apiClient.get('/clients')
  return unwrapResponse(response)
}

export async function createClient(clientData) {
  const response = await apiClient.post('/clients', clientData)
  return unwrapResponse(response)
}

export async function updateClient(clientId, clientData) {
  const response = await apiClient.put(
    `/clients/${clientId}`,
    clientData,
  )

  return unwrapResponse(response)
}

export async function deleteClient(clientId) {
  const response = await apiClient.delete(
    `/clients/${clientId}`,
  )

  return unwrapResponse(response)
}

