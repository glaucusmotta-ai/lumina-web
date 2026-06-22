import { useEffect, useState } from 'react'

import { cadastroStyles as styles } from '../styles/cadastroStyles'

const emptyForm = {
  nome: '',
  telefone: '',
  whatsapp: '',
  email: '',
  dataNascimento: '',
  origemCliente: '',
  regiao: '',
  localAtendimento: '',
  proximaSessao: '',
  horarioProximaSessao: '',
  ultimaSessao: '',
  observacoes: '',
}

function ClientForm({ selectedClient, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (selectedClient) {
      setForm({
        ...emptyForm,
        ...selectedClient,
        observacoes: selectedClient.observacoes || '',
      })
      return
    }

    setForm(emptyForm)
  }, [selectedClient])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.nome.trim()) {
      alert('Informe o nome do cliente.')
      return
    }

    if (form.proximaSessao && !form.horarioProximaSessao) {
      alert('Informe o horário do próximo agendamento.')
      return
    }

    if (!form.proximaSessao && form.horarioProximaSessao) {
      alert('Informe a data do próximo agendamento.')
      return
    }

    const submitted = await onSubmit(form)

    if (!submitted) {
      setForm((currentForm) => ({
        ...currentForm,
        proximaSessao: '',
        horarioProximaSessao: '',
      }))
      return
    }

    setForm(emptyForm)
  }

  return (
    <form style={styles.formCard} onSubmit={handleSubmit}>
      <div style={styles.formHeader}>
        <div>
          <h2 style={styles.formTitle}>
            {selectedClient ? 'Editar cliente' : 'Novo cliente'}
          </h2>

          <p style={styles.formSubtitle}>
            Mantenha os dados essenciais sempre organizados.
          </p>
        </div>
      </div>

      <div style={styles.formGrid}>
        <div style={styles.nameBirthRow}>
          <input
            style={styles.input}
            name="nome"
            placeholder="Nome"
            value={form.nome || ''}
            onChange={handleChange}
          />

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Data de nascimento</label>

            <input
              style={styles.input}
              name="dataNascimento"
              type="date"
              value={form.dataNascimento || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={styles.compactRow}>
          <input
            style={styles.input}
            name="telefone"
            placeholder="Telefone"
            value={form.telefone || ''}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="whatsapp"
            placeholder="WhatsApp"
            value={form.whatsapp || ''}
            onChange={handleChange}
          />
        </div>

        <input
          style={styles.input}
          name="email"
          placeholder="E-mail"
          value={form.email || ''}
          onChange={handleChange}
        />

        <div style={styles.formSection}>
          <p style={styles.formSectionTitle}>Informações estratégicas</p>

          <div style={styles.compactRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Origem do cliente</label>

              <select
                style={styles.select}
                name="origemCliente"
                value={form.origemCliente || ''}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Instagram">Instagram</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Indicação">Indicação</option>
                <option value="Google">Google</option>
                <option value="Cliente antigo">Cliente antigo</option>
                <option value="Presencial">Presencial</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Local preferencial</label>

              <select
                style={styles.select}
                name="localAtendimento"
                value={form.localAtendimento || ''}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Espaço 1">Espaço 1</option>
                <option value="Espaço 2">Espaço 2</option>
                <option value="Domicílio">Domicílio</option>
                <option value="Online">Online</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <input
            style={styles.input}
            name="regiao"
            placeholder="Região, bairro, cidade ou zona"
            value={form.regiao || ''}
            onChange={handleChange}
          />
        </div>

        <div style={styles.scheduleRow}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Próximo agendamento</label>

            <input
              style={styles.input}
              name="proximaSessao"
              type="date"
              value={form.proximaSessao || ''}
              onChange={handleChange}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Horário</label>

            <input
              style={styles.input}
              name="horarioProximaSessao"
              type="time"
              value={form.horarioProximaSessao || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            Histórico dos 3 últimos agendamentos
          </label>

          <input
            style={styles.input}
            name="ultimaSessao"
            type="date"
            value={form.ultimaSessao || ''}
            onChange={handleChange}
          />
        </div>

        <textarea
          style={styles.textarea}
          name="observacoes"
          placeholder="Observações"
          value={form.observacoes || ''}
          onChange={handleChange}
        />
      </div>

      <div style={styles.formActions}>
        <button type="submit" style={styles.buttonPrimary}>
          {selectedClient ? 'Salvar alterações' : 'Adicionar cliente'}
        </button>

        {selectedClient && (
          <button
            type="button"
            style={styles.buttonSecondary}
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default ClientForm


