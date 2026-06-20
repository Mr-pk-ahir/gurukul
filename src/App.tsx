import './App.css'
import { ThemeProvider } from './components/theme/ThemeContext'
import Routers from './Routes/Routes'
function App() {
  return (
    <ThemeProvider>
      <Routers />
    </ThemeProvider>
  )
}
export default App
