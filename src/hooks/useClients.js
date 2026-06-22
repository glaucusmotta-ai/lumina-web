import { useEffect, useMemo, useState } from 'react'

import {
  createClient,
  deleteClient as deleteClientApi,
  getClients,
  updateClient as updateClientApi,
} from '../services/api/clientApi'

import { createSession, getSessions } from '../services/api/sessionApi'

function clientHasSchedule(client) {
  return Boolean(
    client.proximaSessao &&
    client.horarioProximaSessao,
  )
}

function createSessionPayloadFromClient(client) {
  return {
    cliente_nome: client.nome,
    cliente_whatsapp:
      client.whatsapp || client.telefone || null,
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
    local_atendimento:
      client.localAtendimento || null,
    proxima_sessao: client.proximaSessao || null,
    horario_proxima_sessao:
      client.horarioProximaSessao || null,
  }
}

function normalizeClient(client) {
  return {
    ...client,
    origemCliente: client.origem_cliente || '',
    regiao: client.regiao || '',
    localAtendimento:
      client.local_atendimento || '',
    proximaSessao: client.proxima_sessao || '',
    horarioProximaSessao:
      client.horario_proxima_sessao || '',
  }
}

function normalizeClientList(clients) {
  const safeClients = Array.isArray(clients)
    ? clients
    : []

  return Array.from(
    new Map(
      safeClients
        .filter((client) => client && client.id)
        .map((client) => [
          client.id,
          normalizeClient(client),
        ]),
    ).values(),
  )
}

function normalizeApiList(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  return []
}

function isNotFoundError(error) {
  return (
    error.message === 'Not Found' ||
    error?.response?.status === 404
  )
}

async function createSessionFromClient(client) {
  if (!clientHasSchedule(client)) {
    return
  }

  await createSession(
    createSessionPayloadFromClient(client),
  )
}

async function clientHasScheduleConflict(client) {
  if (!clientHasSchedule(client)) {
    return false
  }

  const sessionsPayload = await getSessions()
  const safeSessions = normalizeApiList(sessionsPayload)

  return safeSessions.some((session) => {
    const sameDate =
      session.data === client.proximaSessao

    const sameHour =
      session.horario ===
      client.horarioProximaSessao

    const sameClient =
      session.cliente_nome === client.nome

    return sameDate && sameHour && !sameClient
  })
}

function useClients() {
  const [clients, setClients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function loadClients() {
      try {
        const clientsPayload = await getClients()
        const safeClients = normalizeApiList(clientsPayload)
        const uniqueClients = normalizeClientList(safeClients)

        setClients(uniqueClients)
      } catch (error) {
        alert(error.message)
      }
    }

    loadClients()
  }, [])

  const filteredClients = useMemo(() => {
    const safeClients = Array.isArray(clients)
      ? clients
      : []

    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      return safeClients
    }

    return safeClients.filter((client) =>
      String(client.nome || '')
        .toLowerCase()
        .includes(term),
    )
  }, [clients, searchTerm])

  async function addClient(client) {
    try {
      const hasConflict =
        await clientHasScheduleConflict(client)

      if (hasConflict) {
        alert(
          'Já existe um agendamento para este dia e horário.',
        )

        return false
      }

      const payload = createClientPayload(client)
      const createdClient = await createClient(payload)

      if (!createdClient?.id) {
        alert(
          'Cliente criado, mas o retorno da API veio incompleto. Atualize a lista.',
        )

        return false
      }

      const normalizedClient =
        normalizeClient(createdClient)

      await createSessionFromClient(client)

      setClients((currentClients) => {
        const safeCurrentClients =
          normalizeClientList(currentClients)

        return normalizeClientList([
          normalizedClient,
          ...safeCurrentClients,
        ])
      })

      return true
    } catch (error) {
      alert(error.message)
      return false
    }
  }

  async function updateClient(client) {
    try {
      if (!client?.id) {
        alert(
          'Não foi possível editar: cliente sem identificador.',
        )

        return false
      }

      const hasConflict =
        await clientHasScheduleConflict(client)

      const safeClients = Array.isArray(clients)
        ? clients
        : []

      const currentClient = safeClients.find(
        (item) => item.id === client.id,
      )

      const sameSchedule =
        currentClient &&
        currentClient.proximaSessao ===
          client.proximaSessao &&
        currentClient.horarioProximaSessao ===
          client.horarioProximaSessao

      if (hasConflict && !sameSchedule) {
        alert(
          'Já existe um agendamento para este dia e horário.',
        )

        return false
      }

      const payload = createClientPayload(client)

      const updatedClient = await updateClientApi(
        client.id,
        payload,
      )

      if (!updatedClient?.id) {
        alert(
          'Atualização concluída, mas o retorno da API veio incompleto. Recarregue a lista.',
        )

        return false
      }

      const normalizedClient =
        normalizeClient(updatedClient)

      setClients((currentClients) => {
        const safeCurrentClients =
          normalizeClientList(currentClients)

        return normalizeClientList(
          safeCurrentClients.map((item) =>
            item.id === normalizedClient.id
              ? normalizedClient
              : item,
          ),
        )
      })

      return true
    } catch (error) {
      if (isNotFoundError(error)) {
        alert(
          'Este cliente não existe mais no servidor. A lista será atualizada.',
        )

        setClients((currentClients) => {
          const safeCurrentClients =
            normalizeClientList(currentClients)

          return safeCurrentClients.filter(
            (item) => item.id !== client.id,
          )
        })

        return false
      }

      alert(error.message)
      return false
    }
  }

  async function deleteClient(clientId) {
    try {
      await deleteClientApi(clientId)

      setClients((currentClients) => {
        const safeCurrentClients =
          normalizeClientList(currentClients)

        return safeCurrentClients.filter(
          (client) => client.id !== clientId,
        )
      })

      return true
    } catch (error) {
      if (isNotFoundError(error)) {
        setClients((currentClients) => {
          const safeCurrentClients =
            normalizeClientList(currentClients)

          return safeCurrentClients.filter(
            (client) => client.id !== clientId,
          )
        })

        return true
      }

      alert(error.message)
      return false
    }
  }

  return {
    clients,
    filteredClients,
    searchTerm,
    setSearchTerm,
    totalClients: Array.isArray(clients) ? clients.length : 0,
    addClient,
    updateClient,
    deleteClient,
  }
}

export default useClients


