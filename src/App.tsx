import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Dashboard from './components/dashboard.tsx'

// testing firestore connection
import TestFirestore from './components/testFirestore.tsx'

function App() {
  return (
    <>
      <TestFirestore />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
