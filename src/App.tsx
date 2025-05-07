import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from '@/components/ui/button'

// testing firestore connection
import TestFirestore from './components/testFirestore.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TestFirestore />
      <Button>Click Me</Button>
    </>
  )
}

export default App
