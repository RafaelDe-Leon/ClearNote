import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import NoteGenerator from '../components/NoteGenerator'

export default function Dashboard() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-4xl font-bold'>Dashboard</h1>
      <Link to='/'>
        <Button className='mt-4'>Go to Home</Button>
      </Link>
      <NoteGenerator />
    </div>
  )
}
