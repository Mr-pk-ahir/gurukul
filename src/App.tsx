import { Toaster } from 'sonner'
import './App.css'
import { ThemeProvider } from './components/theme/ThemeContext'
import Routers from './Routes/Routes'
function App() {
  return (
    <ThemeProvider>
      <Routers />
      <Toaster
        position="top-right"
        richColors
        closeButton
    />
    </ThemeProvider>
  )
}
export default App
