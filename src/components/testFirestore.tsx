// Example: src/components/TestFirestore.tsx
import { useEffect } from 'react';
import { db } from '../main.tsx';
import { collection, getDocs } from 'firebase/firestore';

const TestFirestore = () => {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, 'healthcare-professionals'),
        );

        snapshot.forEach((doc) => {
          // console.log(doc.id, doc.data());
          console.log(`
            First Name: ${doc.data().firstName}
            Last Name: ${doc.data().lastName}
            Role: ${doc.data().role}
            UID: ${doc.data().uid}
          `);
        });
      } catch (err) {
        console.error('Firestore connection failed:', err);
      }
    };

    testConnection();
  }, []);

  return <></>;
};

export default TestFirestore;
