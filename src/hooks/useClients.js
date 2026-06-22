import { useEffect, useMemo, useState } from 'react'

import {
  createClient,
  getClients,
  updateClient as updateClientApi,
} from '../services/api/clientApi'

import { createSession, getSessions } from '../services/api/sessionApi'

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
    origem_cliente: client.origemCliente || null,
    regiao: client.regiao || null,
    local_atendimento: client.localAtendimento || null,
    proxima_sessao: client.proximaSessao || null,
    horario_proxima_sessao: client.horarioProximaSessao || null,
  }
}

function normalizeClient(client) {
  return {
    ...client,
    origemCliente: client.origem_cliente || '',
    regiao: client.regiao || '',
    localAtendimento: client.local_atendimento || '',
    proximaSessao: client.proxima_sessao || '',
    horarioProximaSessao: client.horario_proxima_sessao || '',
  }
}

async function createSessionFromClient(client) {
  if (!clientHasSchedule(client)) {
    return
  }

  await createSession(createSessionPayloadFromClient(client))
}

async function clientHasScheduleConflict(client) {
  if (!clientHasSchedule(client)) {
    return false
  }

  const sessions = await getSessions()

  return sessions.some((session) => {
    const sameDate = session.data === client.proximaSessao
    const sameHour = session.horario === client.horarioProximaSessao
    const sameClient = session.cliente_nome === client.nome

    return sameDate && sameHour && !sameClient
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
    try {
      const hasConflict = await clientHasScheduleConflict(client)

      if (hasConflict) {
        alert('Já existe um agendamento para este dia e horário.')
        return false
      }

      const createdClient = await createClient(createClientPayload(client))
      const normalizedClient = normalizeClient(createdClient)

      await createSessionFromClient(client)

      setClients((currentClients) => [
        normalizedClient,
        ...currentClients,
      ])

      return true
    } catch (error) {
      alert(error.message)
      return false
    }
  }

  async function updateClient(client) {
    try {
      const hasConflict = await clientHasScheduleConflict(client)

      const currentClient = clients.find(
        (item) => item.id === client.id,
      )

      const sameSchedule =
        currentClient &&
        currentClient.proximaSessao === client.proximaSessao &&
        currentClient.horarioProximaSessao === client.horarioProximaSessao

      if (hasConflict && !sameSchedule) {
        alert('Já existe um agendamento para este dia e horário.')
        return false
      }

      const payload = createClientPayload(client)

      const updatedClient = await updateClientApi(
        client.id,
        payload,
      )

      const normalizedClient = normalizeClient(updatedClient)

      setClients((currentClients) =>
        currentClients.map((item) =>
          item.id === normalizedClient.id
            ? normalizedClient
            : item,
        ),
      )

      return true
    } catch (error) {
      alert(error.message)
      return false
    }
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


