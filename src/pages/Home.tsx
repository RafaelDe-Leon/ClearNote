import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import NoteGenerator from '@/components/NoteGenerator'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-3xl font-bold mb-6'>Welcome to the Home Page</h1>
      <Button onClick={() => alert('You clicked the button!')}>Click Me</Button>
      <Link to='/dashboard'>
        <Button className='mt-4'>Go to Dashboard</Button>
      </Link>
      <h1>Note Generator</h1>
      <NoteGenerator />
    </div>
  )
}

export default Home
