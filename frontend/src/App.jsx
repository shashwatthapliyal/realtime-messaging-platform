import './App.css'
import { Outlet } from 'react-router-dom'
import Nav from './components/Nav'

function App() {
  return (
    <div className="app-shell">
      <Nav />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}

export default App
