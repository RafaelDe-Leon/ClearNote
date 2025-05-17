import { useEffect, useState, useMemo } from 'react';

import '../App.css';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.tsx';
import Dashboard from '../pages/dashboard.tsx';
import NotFound from '../pages/notFound.tsx'; // Corrected casing

import FirebaseAuthService from '@/services/firebaseAuthService.ts';
import FirestoreDbService from '@/services/db/firestoreDbService.ts';
import COLLECTION_NAMES from '@/constants/collectionNames.ts';
import HealthcareProfessional from '@/models/healthcareProfessional.model.ts'; // Corrected casing

import ClipLoader from 'react-spinners/ClipLoader';

// Define an interface for UserData
interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  role: string;
}

function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
  const [userData, setUserData] = useState<UserData | null | undefined>(
    undefined,
  );

  // Wrap healthcareProfessionalsDbService in useMemo to prevent re-creation on every render
  const healthcareProfessionalsDbService = useMemo(() => {
    return new FirestoreDbService(
      COLLECTION_NAMES.HEALTHCARE_PROFESSIONALS,
      HealthcareProfessional,
    );
  }, []); // Empty dependency array means it's created once

  useEffect(() => {
    const firebaseAuthService = new FirebaseAuthService();
    const authListener = firebaseAuthService.authChangeSubscriber(
      async (user) => {
        const uid = user.uid;
        let userProfileData: UserData | null = null;

        const userDocumentSnap =
          await healthcareProfessionalsDbService.get(uid);

        // Check if userDocumentSnap is a DocumentSnapshot and exists
        if (
          userDocumentSnap &&
          'exists' in userDocumentSnap &&
          userDocumentSnap.exists()
        ) {
          const existingUserData = userDocumentSnap.data();
          if (existingUserData) {
            // Ensure data is not undefined
            userProfileData = {
              uid: uid,
              firstName: existingUserData.firstName,
              lastName: existingUserData.lastName,
              role: existingUserData.role,
            };
          }
        } else {
          const newHealthCareProfessional = new HealthcareProfessional(
            uid,
            'dummyFirst',
            'dummyLast',
            'SPEECH_THERAPIST',
          );
          await healthcareProfessionalsDbService.create(
            uid,
            newHealthCareProfessional.asObject(),
          );
          console.log('New healthcare professional created with UID:', uid);
          userProfileData = {
            uid: uid,
            firstName: newHealthCareProfessional.firstName,
            lastName: newHealthCareProfessional.lastName,
            role: newHealthCareProfessional.role,
          };
        }

        setUserData(userProfileData);
        setIsLoggedIn(true);
        console.log('USER SIGNED IN. UserData set to:', userProfileData);
      },
      () => {
        console.log('USER LOGGED OUT');
        setIsLoggedIn(false);
        setUserData(null); // Clear userData on logout
      },
    );

    return authListener;
  }, [healthcareProfessionalsDbService]); // Added healthcareProfessionalsDbService to dependency array

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
          element={
            isLoggedIn && userData ? (
              <Dashboard userData={userData} />
            ) : (
              <Home />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default Router;
