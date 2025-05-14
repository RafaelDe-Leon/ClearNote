import { Suspense } from 'react';
import NoteForm from '@/components/noteForm';

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FirebaseAuthService from '@/services/firebaseAuthService';

import ThemeToggle from '@/components/theme-toggle';

interface dashboardProps {
  userData: any;
}
export default function Dashboard({ userData }: dashboardProps) {
  const firebaseAuthService = new FirebaseAuthService();
  console.log('Dashboard got userData:', userData); // ✅ check this

  return (
    <div className="from-background to-muted/30 dark:from-background dark:to-background flex min-h-screen flex-col bg-gradient-to-b">
      <main className="container mx-auto flex-1 px-4 py-8">
        <ThemeToggle />
        {/* <Link to='/'> */}
        <Button className="mb-4" onClick={firebaseAuthService.signOut}>
          Sign Out
        </Button>
        {/* </Link> */}
        <h1 className="from-primary to-primary/70 mb-2 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
          Professional Note Generator
        </h1>

        {userData && (
          <div className="text-muted-foreground mb-6 text-sm">
            <p>
              Welcome, {userData.firstName} {userData.lastName}!
            </p>
            <p className="text-muted-foreground">Role: {userData.role}</p>
          </div>
        )}

        <Suspense
          fallback={
            <div className="p-8 text-center">Loading note generator...</div>
          }
        >
          <NoteForm />
        </Suspense>
      </main>
      <footer className="bg-muted/30 border-t py-4">
        <div className="text-ssm text-muted-foreground container mx-auto text-center">
          © 2025 ClearNote. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
