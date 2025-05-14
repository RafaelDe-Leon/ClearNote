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

function Router() {
  const healthcareProfessionalsDbService = new FirestoreDbService(
    COLLECTION_NAMES.HEALTHCARE_PROFESSIONALS,
    HealthcareProfessional,
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log('USE EFFECT RUNNING');
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
            'SPEECH_THERAPISt',
          );
          const created = await healthcareProfessionalsDbService.create(
            uid,
            newHealthCareProfessional.asObject(),
          );
          console.log('created =', created);
        }

        console.log('exists =', exists);
        // if exists do nothign for now
        // else need to addDoc
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

  if (!isLoggedIn) return <h1>LOADING...</h1>;

  return (
    <>
      <Routes>
        {!isLoggedIn ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route path="/" element={<Dashboard />} />
        )}
      </Routes>
    </>
  );
}

export default Router;
