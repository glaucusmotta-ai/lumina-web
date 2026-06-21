import { useEffect, useMemo, useState } from 'react'

import { createClient, getClients } from '../services/api/clientApi'
import { createSession } from '../services/api/sessionApi'
import { hasScheduleConflict } from '../services/scheduleService'

function clientHasSchedule(client) {
  return Boolean(client.proximaSessao && client.horarioProximaSessao)
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

function createClientPayload(client) {
  return {
    nome: client.nome,
    telefone: client.telefone || null,
    whatsapp: client.whatsapp || null,
    email: client.email || null,
    observacoes: client.observacoes || null,
    proxima_sessao: client.proximaSessao || null,
    horario_proxima_sessao: client.horarioProximaSessao || null,
  }
}

function normalizeClient(client) {
  return {
    ...client,
    proximaSessao: client.proxima_sessao || '',
    horarioProximaSessao: client.horario_proxima_sessao || '',
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
  })
}

function useClients() {
  const [clients, setClients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await getClients()
        setClients(data.map(normalizeClient))
      } catch (error) {
        alert(error.message)
      }
    }

    loadClients()
  }, [])

  const filteredClients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      return clients
    }

    return clients.filter((client) =>
      client.nome.toLowerCase().includes(term),
    )
  }, [clients, searchTerm])

  async function addClient(client) {
    if (clientHasScheduleConflict(client)) {
      alert('Já existe um agendamento para este dia e horário.')
      return false
    }

    try {
      const createdClient = await createClient(createClientPayload(client))
      const normalizedClient = normalizeClient(createdClient)

      setClients((currentClients) => [normalizedClient, ...currentClients])
      await createSessionFromClient(client)

      return true
    } catch (error) {
      alert(error.message)
      return false
    }
  }

  function updateClient() {
    alert('Edição de clientes no backend será habilitada na próxima etapa.')
    return false
  }

  function deleteClient() {
    alert('Exclusão de clientes no backend será habilitada na próxima etapa.')
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

