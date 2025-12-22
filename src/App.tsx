import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'

function App() {
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
