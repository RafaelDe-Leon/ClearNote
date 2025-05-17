import { Suspense, useState } from 'react';
import NoteForm from '@/components/noteForm';
import { Button } from '@/components/ui/button';
import FirebaseAuthService from '@/services/firebaseAuthService';
import FirestoreDbService from '@/services/db/firestoreDbService';
import ThemeToggle from '@/components/theme-toggle';
import HealthcareProfessional from '@/models/healthcareProfessional.model';

interface DashboardProps {
  userData: {
    uid: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
export default function Dashboard({ userData }: DashboardProps) {
  const firebaseAuthService = new FirebaseAuthService();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // FirestoreDbService expects collection name and model
  const firestoreDbService = new FirestoreDbService(
    'healthcare-professionals',
    HealthcareProfessional,
  );

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Dashboard] handleAddPatient called');
    setLoading(true);
    setSuccess('');
    setError('');

    console.log('[Dashboard] Current userData:', userData);
    console.log(
      '[Dashboard] Patient First Name:',
      firstName,
      'Last Name:',
      lastName,
    );

    if (!userData || !userData.uid) {
      console.error(
        '[Dashboard] User data or UID is missing. userData:',
        userData,
      );
      setError('User information is not available. Please try again shortly.');
      setLoading(false);
      return;
    }

    try {
      const patientUid = `${userData.uid}_${Date.now()}`;
      console.log(
        '[Dashboard] Attempting to create patient with UID:',
        patientUid,
        'Assigned to HP UID:',
        userData.uid,
      );
      await firestoreDbService.createPatient(
        patientUid,
        firstName,
        lastName,
        userData.uid, // userData.uid is now confirmed to be a string
      );
      setSuccess('Patient added and assigned successfully!');
      console.log(
        '[Dashboard] Patient creation reported as successful by the service.',
      );
      setFirstName('');
      setLastName('');
    } catch (err) {
      console.error('[Dashboard] Error in handleAddPatient catch block:', err);
      setError('Failed to add patient. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="from-background to-muted/30 dark:from-background dark:to-background flex min-h-screen flex-col bg-gradient-to-b">
      <main className="container mx-auto flex-1 px-4 py-8">
        <ThemeToggle />
        <Button className="mb-4" onClick={firebaseAuthService.signOut}>
          Sign Out
        </Button>
        <h1 className="from-primary to-primary/70 mb-2 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
          Professional Note Generator
        </h1>

        {/* Add Patient Form */}
        <form
          onSubmit={handleAddPatient}
          className="bg-muted/10 mb-8 rounded border p-4"
        >
          <h2 className="mb-2 text-xl font-semibold">Add New Patient</h2>
          <div className="mb-2">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded border p-2"
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded border p-2"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !userData || !userData.uid}
          >
            {loading ? 'Adding...' : 'Add Patient'}
          </Button>
          {success && <div className="mt-2 text-green-600">{success}</div>}
          {error && <div className="mt-2 text-red-600">{error}</div>}
        </form>

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
