import { useEffect, useMemo, useState } from 'react'

import { initialClients } from '../data/initialClients'
import {
  createScheduleSession,
  hasScheduleConflict,
} from '../services/scheduleService'

const CLIENTS_STORAGE_KEY = 'lumina_clients'

function createSessionFromClient(client) {
  if (!client.proximaSessao || !client.horarioProximaSessao) {
    return
  }

  createScheduleSession({
    date: client.proximaSessao,
    cliente: client.nome,
    horario: client.horarioProximaSessao,
    servico: 'Atendimento',
    telefone: client.whatsapp || client.telefone,
    email: client.email,
  })
}

function clientHasScheduleConflict(client) {
  return hasScheduleConflict({
    date: client.proximaSessao,
    horario: client.horarioProximaSessao,
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
    if (clientHasScheduleConflict(updatedClient)) {
      alert('Já existe um agendamento para este dia e horário.')
      return false
    }

    setClients((currentClients) =>
      currentClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client,
      ),
    )

    createSessionFromClient(updatedClient)

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


