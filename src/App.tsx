import { Toaster } from 'sonner'
import './App.css'
import { ThemeProvider } from './components/theme/ThemeContext'
import Routers from './Routes/Routes'
import { LoadingProvider } from './context/LoadingContext'

function App() {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <Routers />
        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </LoadingProvider>
    </ThemeProvider>
  )
}
export default App
