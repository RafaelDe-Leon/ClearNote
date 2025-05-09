// UI COmponents
import { Button } from '@/components/ui/button'

import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-3xl font-bold mb-6'>Welcome to the Home Page</h1>
      <Link to='/dashboard'>
        <Button className='mt-4'>Go to Dashboard</Button>
      </Link>
    </div>
  )
}

export default Home
