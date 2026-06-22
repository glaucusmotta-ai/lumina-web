import { SESSION_STATUS } from '../services/scheduleService'
import { styles } from '../styles/dashboardStyles'

const statusOptions = [
  SESSION_STATUS.CONFIRMADA,
  SESSION_STATUS.PENDENTE,
  SESSION_STATUS.CANCELADA,
  SESSION_STATUS.FINALIZADA,
]

function SessionFormModal({
  form,
  isEditing,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <section style={styles.popupOverlay}>
      <div style={styles.popup}>
        <div style={styles.popupHeader}>
          <h2 style={styles.popupTitle}>
            {isEditing
              ? 'Editar agendamento'
              : 'Novo agendamento'}
          </h2>

          <button
            type="button"
            style={styles.popupClose}
            onClick={onClose}
          >
            Fechar
          </button>
        </div>

        <div style={styles.popupBody}>
          <div style={styles.formGrid}>
            <input
              style={styles.formInput}
              placeholder="Nome do cliente"
              value={form.cliente || ''}
              onChange={(event) =>
                onChange(
                  'cliente',
                  event.target.value,
                )
              }
            />

            <input
              style={styles.formInput}
              placeholder="Serviço"
              value={form.servico || ''}
              onChange={(event) =>
                onChange(
                  'servico',
                  event.target.value,
                )
              }
            />

            <input
              type="date"
              style={styles.formInput}
              value={form.date || ''}
              onChange={(event) =>
                onChange(
                  'date',
                  event.target.value,
                )
              }
            />

            <input
              type="time"
              style={styles.formInput}
              value={form.horario || ''}
              onChange={(event) =>
                onChange(
                  'horario',
                  event.target.value,
                )
              }
            />

            <select
              style={styles.formInput}
              value={
                form.status ||
                SESSION_STATUS.CONFIRMADA
              }
              onChange={(event) =>
                onChange(
                  'status',
                  event.target.value,
                )
              }
            >
              {statusOptions.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

            <input
              style={styles.formInput}
              placeholder="Telefone / WhatsApp"
              value={form.telefone || ''}
              onChange={(event) =>
                onChange(
                  'telefone',
                  event.target.value,
                )
              }
            />

            <input
              type="email"
              style={styles.formInput}
              placeholder="E-mail"
              value={form.email || ''}
              onChange={(event) =>
                onChange(
                  'email',
                  event.target.value,
                )
              }
            />
          </div>

          <button
            type="button"
            style={styles.buttonPrimary}
            onClick={onSubmit}
          >
            {isEditing
              ? 'Salvar alterações'
              : 'Salvar sessão'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default SessionFormModal


