import { useEffect, useMemo, useState } from 'react'

import { initialClients } from '../data/initialClients'
import { createSession } from '../services/api/sessionApi'
import { hasScheduleConflict } from '../services/scheduleService'

const CLIENTS_STORAGE_KEY = 'lumina_clients'

function clientHasSchedule(client) {
  return Boolean(client.proximaSessao && client.horarioProximaSessao)
}

function clientScheduleChanged(originalClient, updatedClient) {
  return (
    originalClient?.proximaSessao !== updatedClient.proximaSessao ||
    originalClient?.horarioProximaSessao !== updatedClient.horarioProximaSessao
  )
}

function createSessionPayloadFromClient(client) {
  return {
    cliente_nome: client.nome,
    cliente_whatsapp: client.whatsapp || client.telefone || null,
    cliente_email: client.email || null,
    servico: 'Atendimento',
    data: client.proximaSessao,
    horario: client.horarioProximaSessao,
    status: 'Confirmada',
  }
}

async function createSessionFromClient(client) {
  if (!clientHasSchedule(client)) {
    return
  }

  try {
    await createSession(createSessionPayloadFromClient(client))
  } catch {
    //
  }
}

function clientHasScheduleConflict(client) {
  if (!clientHasSchedule(client)) {
    return false
  }

  return hasScheduleConflict({
    date: client.proximaSessao,
    horario: client.horarioProximaSessao,
    ignoreSessionId: `cliente-${client.id}-${client.proximaSessao}-${client.horarioProximaSessao}`,
  })
}

function useClients() {
  const [clients, setClients] = useState(() => {
    const storedClients = localStorage.getItem(CLIENTS_STORAGE_KEY)

    if (storedClients) {
      return JSON.parse(storedClients)
    }

    return initialClients
  })

  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients))
  }, [clients])

  const filteredClients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      return clients
    }

    return clients.filter((client) =>
      client.nome.toLowerCase().includes(term),
    )
  }, [clients, searchTerm])

  function addClient(client) {
    if (clientHasScheduleConflict(client)) {
      alert('Já existe um agendamento para este dia e horário.')
      return false
    }

    const newClient = {
      ...client,
      id: crypto.randomUUID(),
    }

    setClients((currentClients) => [newClient, ...currentClients])
    createSessionFromClient(newClient)

    return true
  }

  function updateClient(updatedClient) {
    const originalClient = clients.find(
      (client) => client.id === updatedClient.id,
    )

    if (
      clientScheduleChanged(originalClient, updatedClient) &&
      clientHasScheduleConflict(updatedClient)
    ) {
      alert('Já existe um agendamento para este dia e horário.')
      return false
    }

    setClients((currentClients) =>
      currentClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client,
      ),
    )

    if (clientScheduleChanged(originalClient, updatedClient)) {
      createSessionFromClient(updatedClient)
    }

    return true
  }

  function deleteClient(clientId) {
    setClients((currentClients) =>
      currentClients.filter((client) => client.id !== clientId),
    )
  }

  return {
    clients,
    filteredClients,
    searchTerm,
    setSearchTerm,
    totalClients: clients.length,
    addClient,
    updateClient,
    deleteClient,
  }
}

export default useClients

