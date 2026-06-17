import { useState } from 'react'

import ClientForm from '../components/ClientForm'
import ClientList from '../components/ClientList'
import SearchBar from '../components/SearchBar'
import Topbar from '../components/Topbar'

import useClients from '../hooks/useClients'

import { cadastroStyles as styles } from '../styles/cadastroStyles'

function CadastroScreen() {
  const {
    filteredClients,
    searchTerm,
    setSearchTerm,
    totalClients,
    addClient,
    updateClient,
    deleteClient,
  } = useClients()

  const [selectedClient, setSelectedClient] = useState(null)
  const [activeView, setActiveView] = useState('list')

  function handleSubmit(client) {
    if (selectedClient) {
      const updated = updateClient(client)

      if (!updated) {
        return false
      }

      setSelectedClient(null)
      setActiveView('list')
      return true
    }

    const created = addClient(client)

    if (!created) {
      return false
    }

    setActiveView('list')
    return true
  }

  function handleEdit(client) {
    setSelectedClient(client)
    setActiveView('create')
  }

  function handleCancelEdit() {
    setSelectedClient(null)
    setActiveView('list')
  }

  function handleChangeView(view) {
    setSelectedClient(null)
    setActiveView(view)

    if (view !== 'search') {
      setSearchTerm('')
    }
  }

  return (
    <main style={styles.page}>
      <Topbar variant="back" />

      <section style={styles.header}>
        <p style={styles.kicker}>Cadastro</p>

        <h1 style={styles.title}>Clientes</h1>

        <p style={styles.subtitle}>
          Organize clientes, contatos e histórico de atendimento em uma experiência simples, leve e profissional.
        </p>
      </section>

      <section style={styles.actionPanel}>
        <div style={styles.actionBar}>
          <button
            type="button"
            style={{
              ...styles.actionButton,
              ...(activeView === 'create' ? styles.actionButtonActive : {}),
            }}
            onClick={() => handleChangeView('create')}
          >
            Cadastrar
          </button>

          <button
            type="button"
            style={{
              ...styles.actionButton,
              ...(activeView === 'list' ? styles.actionButtonActive : {}),
            }}
            onClick={() => handleChangeView('list')}
          >
            Listar clientes
          </button>

          <button
            type="button"
            style={{
              ...styles.actionButton,
              ...(activeView === 'search' ? styles.actionButtonActive : {}),
            }}
            onClick={() => handleChangeView('search')}
          >
            Buscar clientes
          </button>
        </div>

        <div style={styles.totalInfo}>
          Total de clientes: <strong>{totalClients}</strong>
        </div>
      </section>

      <section style={styles.singleColumn}>
        {activeView === 'create' && (
          <ClientForm
            selectedClient={selectedClient}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
          />
        )}

        {activeView === 'list' && (
          <ClientList
            clients={filteredClients}
            searchTerm={searchTerm}
            onEdit={handleEdit}
            onDelete={deleteClient}
          />
        )}

        {activeView === 'search' && (
          <>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
            />

            <ClientList
              clients={filteredClients}
              searchTerm={searchTerm}
              onEdit={handleEdit}
              onDelete={deleteClient}
            />
          </>
        )}
      </section>
    </main>
  )
}

export default CadastroScreen


