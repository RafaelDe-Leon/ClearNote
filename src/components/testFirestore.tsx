// Example: src/components/TestFirestore.tsx
import { useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

const TestFirestore = () => {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'test')) // 'test' is your collection name
        console.log(`Connected! Retrieved ${snapshot.size} documents.`)
        snapshot.forEach(doc => {
          console.log(doc.id, doc.data())
        })
      } catch (err) {
        console.error('Firestore connection failed:', err)
      }
    }

    testConnection()
  }, [])

  return <div className='mb-6'>Check the console for Firestore connection test results.</div>
}

export default TestFirestore
