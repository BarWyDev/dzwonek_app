import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import { useNotifications } from './hooks/useNotifications'

function App() {
  // Włącz nasłuchiwanie powiadomień w foreground
  useNotifications()

  return (
    <>
      <Toaster position="top-center" />
      <Layout>
        <Dashboard />
      </Layout>
    </>
  )
}

export default App
