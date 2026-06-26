import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import AgendaScreen from './screens/AgendaScreen'
import CadastroScreen from './screens/CadastroScreen'
import CampanhasScreen from './screens/CampanhasScreen'
import DashboardScreen from './screens/DashboardScreen'
import LembretesScreen from './screens/LembretesScreen'
import LoginScreen from './screens/LoginScreen'
import MetricasScreen from './screens/MetricasScreen'
import TrialExpiredScreen from './screens/TrialExpiredScreen'

import useAuth from './hooks/useAuth'

function App() {
  const { isAuthenticated, isTrialExpired, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fffaf9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ color: '#7a6d6d', fontSize: 15, fontWeight: 600 }}>
          Carregando...
        </p>
      </div>
    )
  }

  if (isAuthenticated && isTrialExpired) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<TrialExpiredScreen />} />
        </Routes>
      </BrowserRouter>
    )
  }

  const authenticated = isAuthenticated

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={authenticated ? <Navigate to="/dashboard" replace /> : <LoginScreen />} />
        <Route path="/dashboard" element={authenticated ? <DashboardScreen /> : <Navigate to="/" replace />} />
        <Route path="/cadastro" element={authenticated ? <CadastroScreen /> : <Navigate to="/" replace />} />
        <Route path="/agenda" element={authenticated ? <AgendaScreen /> : <Navigate to="/" replace />} />
        <Route path="/lembretes" element={authenticated ? <LembretesScreen /> : <Navigate to="/" replace />} />
        <Route path="/campanhas" element={authenticated ? <CampanhasScreen /> : <Navigate to="/" replace />} />
        <Route path="/metricas" element={authenticated ? <MetricasScreen /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

