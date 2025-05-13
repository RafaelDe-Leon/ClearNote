import { Suspense } from 'react'
import NoteForm from '@/components/noteForm'

import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

import ThemeToggle from '@/components/theme-toggle'

export default function Dashboard() {
  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-background'>
      <main className='container mx-auto py-8 px-4 flex-1'>
        <ThemeToggle />
        <Link to='/'>
          <Button className='mb-4'>Go to Home</Button>
        </Link>
        <h1 className='text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
          Professional Note Generator
        </h1>

        <Suspense fallback={<div className='p-8 text-center'>Loading note generator...</div>}>
          <NoteForm />
        </Suspense>
      </main>
      <footer className='py-4 border-t bg-muted/30'>
        <div className='container mx-auto text-center text-ssm text-muted-foreground'>
          © 2025 ClearNote. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
