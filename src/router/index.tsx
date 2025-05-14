import { useEffect, useState } from 'react';

import '../App.css';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.tsx';
import Dashboard from '../pages/dashboard.tsx';
import FirebaseAuthService from '@/services/firebaseAuthService.ts';
//
import FirestoreDbService from '@/services/db/firestoreDbService.ts';
import COLLECTION_NAMES from '@/constants/collectionNames.ts';
import HealthcareProfessional from '@/models/healthCareProfessional.model.ts';

import ClipLoader from 'react-spinners/ClipLoader';

function Router() {
  // set type to useState
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
  const [userData, setUserData] = useState<any | undefined>(undefined);

  const healthcareProfessionalsDbService = new FirestoreDbService(
    COLLECTION_NAMES.HEALTHCARE_PROFESSIONALS,
    HealthcareProfessional,
  );

  useEffect(() => {
    const firebaseAuthService = new FirebaseAuthService();
    const authListener = firebaseAuthService.authChangeSubscriber(
      async (user) => {
        // try to get healthcare profession
        const uid = user.uid;
        const getUser = await healthcareProfessionalsDbService.get(uid);
        const exists = getUser?.data();
        if (!exists) {
          const newHealthCareProfessional = new HealthcareProfessional(
            uid,
            'dummyFirst',
            'dummyLast',
            'SPEECH_THERAPIST',
          );
          const created = await healthcareProfessionalsDbService.create(
            uid,
            newHealthCareProfessional.asObject(),
          );
          console.log('created =', created);
        }

        if (exists) {
          setUserData({
            firstName: exists.firstName,
            lastName: exists.lastName,
            role: exists.role,
          });
        } else {
          setUserData(null);
        }
        console.log('USER SIGNED IN', user);
        setIsLoggedIn(true);
      },
      () => {
        console.log('USER LOGGED OUT');
        setIsLoggedIn(false);
      },
    );

    return authListener;
  }, []);

  if (isLoggedIn === undefined)
    return (
      <div className="flex h-screen items-center justify-center">
        <ClipLoader color="#3498db" size={50} />
      </div>
    );

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={!isLoggedIn ? <Home /> : <Dashboard userData={userData} />}
        />
      </Routes>
    </>
  );
}

export default Router;
