// src/screens/CampanhasScreen.jsx
import { useEffect, useState } from 'react'

import Topbar from '../components/Topbar'
import Footer from '../components/Footer'
import { styles } from '../styles/dashboardStyles'
import { theme } from '../styles/theme'
import { getClients } from '../services/api/clientApi'

const CAMPAIGN_TYPES = [
  {
    id: 'aniversario',
    label: 'Parabéns',
    emoji: '🎂',
    description: 'Mensagem de aniversário para clientes',
    buildMessage: (client) =>
      `Olá, ${client.nome}! 🎂\n\nO Lumina veio te desejar um feliz aniversário! Que este dia seja especial para você.\n\nAproveite para agendar uma sessão como presente para si mesmo! 🌸`,
  },
  {
    id: 'reativacao',
    label: 'Reativação',
    emoji: '💌',
    description: 'Para clientes sem sessão recente',
    buildMessage: (client) =>
      `Olá, ${client.nome}! 💌\n\nSentimos sua falta! Faz um tempo que não nos vemos e gostaríamos de saber como você está.\n\nQue tal agendarmos uma sessão? Estamos aqui quando precisar. 🌿`,
  },
  {
    id: 'lembrete',
    label: 'Lembrete geral',
    emoji: '📅',
    description: 'Lembrete de cuidado ou retorno',
    buildMessage: (client) =>
      `Olá, ${client.nome}! 📅\n\nPassando para lembrar que seu bem-estar é prioridade. Caso queira agendar ou tirar dúvidas, estamos disponíveis.\n\nAté breve! 🌸`,
  },
]

const cardStyle = {
  background: '#ffffff',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  padding: '20px 24px',
  boxShadow: `0 4px 16px ${theme.colors.shadow}`,
}

const labelStyle = {
  fontSize: 13,
  fontWeight: 700,
  color: theme.colors.textSoft,
  marginBottom: 6,
  display: 'block',
}

const inputStyle = {
  width: '100%',
  border: `1.5px solid ${theme.colors.border}`,
  borderRadius: theme.radius.sm,
  padding: '10px 14px',
  fontSize: 14,
  color: theme.colors.text,
  background: '#fff',
  boxSizing: 'border-box',
}

const textareaStyle = {
  ...inputStyle,
  minHeight: 120,
  resize: 'vertical',
  fontFamily: 'inherit',
  lineHeight: 1.5,
}

function CampanhasScreen() {
  const [clients, setClients] = useState([])
  const [selectedType, setSelectedType] = useState(CAMPAIGN_TYPES[0])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState([])

  useEffect(() => {
    getClients()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || [])
        setClients(list)
      })
      .catch(() => setClients([]))
  }, [])

  function handleSelectType(type) {
    setSelectedType(type)
    setMessage('')
    setSelectedClientId('')
  }

  function handleSelectClient(clientId) {
    setSelectedClientId(clientId)
    if (!clientId) { setMessage(''); return }
    const client = clients.find((c) => String(c.id) === clientId)
    if (client) setMessage(selectedType.buildMessage(client))
  }

  function handleSendWhatsApp() {
    const client = clients.find((c) => String(c.id) === selectedClientId)
    if (!client) return
    const phone = client.whatsapp || client.telefone || ''
    if (!phone) { alert('Este cliente não tem WhatsApp cadastrado.'); return }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
    setSent((prev) => [{ id: Date.now(), cliente: client.nome, canal: 'WhatsApp', tipo: selectedType.label, hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }, ...prev])
  }

  function handleSendEmail() {
    const client = clients.find((c) => String(c.id) === selectedClientId)
    if (!client) return
    if (!client.email) { alert('Este cliente não tem e-mail cadastrado.'); return }
    window.location.href = `mailto:${client.email}?subject=${encodeURIComponent(`Mensagem especial para ${client.nome}`)}&body=${encodeURIComponent(message)}`
    setSent((prev) => [{ id: Date.now(), cliente: client.nome, canal: 'E-mail', tipo: selectedType.label, hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }, ...prev])
  }

  const selectedClient = clients.find((c) => String(c.id) === selectedClientId)

  const btnBase = {
    border: 'none',
    borderRadius: theme.radius.sm,
    padding: '11px 22px',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  }

  return (
    <main style={styles.page}>
      <Topbar variant="back" />

      <section style={styles.header}>
        <p style={styles.kicker}>Campanhas</p>
        <h1 style={styles.title}>Relacionamento inteligente</h1>
        <p style={styles.subtitle}>
          Crie mensagens personalizadas para fortalecer o vínculo com seus clientes e aumentar retornos.
        </p>
      </section>

      <section style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gap: 24 }}>

        <div style={cardStyle}>
          <p style={{ ...labelStyle, marginBottom: 14 }}>Tipo de campanha</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {CAMPAIGN_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleSelectType(type)}
                style={{
                  ...btnBase,
                  background: selectedType.id === type.id ? theme.colors.primary : 'rgba(214,180,185,0.12)',
                  color: selectedType.id === type.id ? '#fff' : theme.colors.text,
                  border: `1.5px solid ${selectedType.id === type.id ? theme.colors.primary : theme.colors.border}`,
                }}
              >
                {type.emoji} {type.label}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 13, color: theme.colors.textSoft, marginTop: 10 }}>
            {selectedType.description}
          </p>
        </div>

        <div style={cardStyle}>
          <label style={labelStyle} htmlFor="cliente-select">Cliente</label>
          <select
            id="cliente-select"
            value={selectedClientId}
            onChange={(e) => handleSelectClient(e.target.value)}
            style={inputStyle}
          >
            <option value="">Selecione um cliente...</option>
            {clients.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.nome}
              </option>
            ))}
          </select>

          {selectedClient && (
            <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: theme.colors.textSoft }}>
              {(selectedClient.whatsapp || selectedClient.telefone) && (
                <span>📱 {selectedClient.whatsapp || selectedClient.telefone}</span>
              )}
              {selectedClient.email && <span>✉️ {selectedClient.email}</span>}
            </div>
          )}
        </div>

        {message && (
          <div style={cardStyle}>
            <label style={labelStyle} htmlFor="mensagem">Mensagem</label>
            <textarea
              id="mensagem"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={textareaStyle}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              {(selectedClient?.whatsapp || selectedClient?.telefone) && (
                <button type="button" onClick={handleSendWhatsApp} style={{ ...btnBase, background: '#25d366', color: '#fff' }}>
                  📱 Enviar WhatsApp
                </button>
              )}
              {selectedClient?.email && (
                <button type="button" onClick={handleSendEmail} style={{ ...btnBase, background: theme.colors.primary, color: '#fff' }}>
                  ✉️ Enviar E-mail
                </button>
              )}
            </div>
          </div>
        )}

        {sent.length > 0 && (
          <div style={cardStyle}>
            <p style={{ ...labelStyle, marginBottom: 14 }}>Enviados nesta sessão</p>
            <div style={{ display: 'grid', gap: 10 }}>
              {sent.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(214,180,185,0.08)', borderRadius: theme.radius.sm, fontSize: 14, flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontWeight: 700, color: theme.colors.text }}>{item.cliente}</span>
                  <span style={{ color: theme.colors.textSoft }}>{item.tipo} via {item.canal}</span>
                  <span style={{ background: 'rgba(72,180,120,0.15)', color: '#2d6a4f', borderRadius: 99, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
                    ✓ {item.hora}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}

export default CampanhasScreen

