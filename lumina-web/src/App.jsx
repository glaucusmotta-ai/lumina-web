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

import useAuth from './hooks/useAuth'

function App() {
  const { isAuthenticated } = useAuth()
  const authenticated = isAuthenticated

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            authenticated
              ? <Navigate to="/dashboard" replace />
              : <LoginScreen />
          }
        />

        <Route
          path="/dashboard"
          element={
            authenticated
              ? <DashboardScreen />
              : <Navigate to="/" replace />
          }
        />

        <Route
          path="/cadastro"
          element={
            authenticated
              ? <CadastroScreen />
              : <Navigate to="/" replace />
          }
        />

        <Route
          path="/agenda"
          element={
            authenticated
              ? <AgendaScreen />
              : <Navigate to="/" replace />
          }
        />

        <Route
          path="/lembretes"
          element={
            authenticated
              ? <LembretesScreen />
              : <Navigate to="/" replace />
          }
        />

        <Route
          path="/campanhas"
          element={
            authenticated
              ? <CampanhasScreen />
              : <Navigate to="/" replace />
          }
        />

        <Route
          path="/metricas"
          element={
            authenticated
              ? <MetricasScreen />
              : <Navigate to="/" replace />
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App



