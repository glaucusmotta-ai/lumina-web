import { cadastroStyles as styles } from '../styles/cadastroStyles'

function SearchBar({ value, onChange }) {
  return (
    <div style={styles.searchWrapper}>
      <input
        style={styles.searchInput}
        type="text"
        placeholder="Buscar cliente por nome"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

export default SearchBar

