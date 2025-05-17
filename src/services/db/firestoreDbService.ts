import { db } from '@/main';
import {
  getDoc,
  collection,
  Firestore,
  CollectionReference,
  doc,
  setDoc,
  getDocs,
} from 'firebase/firestore';

import COLLECTION_NAMES from '@/constants/collectionNames';
import HealthcareProfessional from '@/models/healthcareProfessional.model';
import Patient from '@/models/patient.model';

class FirestoreDbService {
  db: Firestore;
  collectionName: string;
  collection: CollectionReference;
  model: typeof HealthcareProfessional;

  constructor(collectionName: string, model: typeof HealthcareProfessional) {
    this.db = db;
    this.collectionName = collectionName;
    this.collection = collection(this.db, this.collectionName);
    this.model = model;
  }

  // Update create method to use a generic type with constraint
  async create<T extends object>(uid: string, payload: T) {
    try {
      const newDoc = await setDoc(doc(this.collection, uid), payload);
      return newDoc;
    } catch (error) {
      console.error('HANDLE ERROR', error);
      return null;
    }
  }

  // Fix getDocs and doc typing
  async get(id?: string) {
    try {
      if (id) {
        // Get a single document
        const retrieve = await getDoc(doc(this.collection, id));
        return retrieve.exists() ? retrieve : null;
      }

      // Get all documents
      const snapshot = await getDocs(this.collection);
      const allDocs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      return allDocs;
    } catch (error) {
      console.error('HANDLE ERROR', error);
      return null;
    }
  }

  // add patient to healthcare professional
  async addPatientToHealthcareProfessional(
    uid: string,
    patient: Patient,
  ): Promise<Patient | null> {
    console.log(
      '[FirestoreDbService] addPatientToHealthcareProfessional called with HP UID:',
      uid,
      'Patient:',
      patient,
    );
    try {
      const docRef = doc(this.collection, uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const patients = data?.patients || [];
        patients.push(patient.uid);
        console.log(
          '[FirestoreDbService] Updating HP document with new patient UID list:',
          patients,
        );
        await setDoc(docRef, { patients }, { merge: true });
        console.log('[FirestoreDbService] Successfully added patient to HP.');
        return patient;
      } else {
        console.error(
          '[FirestoreDbService] Healthcare professional document not found for UID:',
          uid,
        );
        return null;
      }
    } catch (error) {
      console.error(
        '[FirestoreDbService] Error in addPatientToHealthcareProfessional:',
        error,
      );
      // Re-throw the error so it can be caught by the caller if needed, or handle appropriately
      throw error;
    }
  }

  // 1. Create a new Patient instance
  async createPatient(
    uid: string,
    firstName: string,
    lastName: string,
    healthcareProfessionalUid: string,
  ) {
    console.log(
      '[FirestoreDbService] createPatient called with Patient UID:',
      uid,
      'Name:',
      firstName,
      lastName,
      'Assigned to HP UID:',
      healthcareProfessionalUid,
    );
    try {
      const newPatient = new Patient(uid, firstName, lastName, [
        healthcareProfessionalUid,
      ]);
      console.log(
        '[FirestoreDbService] New Patient object created:',
        newPatient.asObject(),
      );
      // Add the patient to the 'patients' collection
      const patientsCollection = collection(this.db, COLLECTION_NAMES.PATIENTS);
      console.log(
        "[FirestoreDbService] Setting document in 'patients' collection with ID:",
        newPatient.uid,
      );
      await setDoc(
        doc(patientsCollection, newPatient.uid),
        newPatient.asObject(),
      );
      console.log(
        "[FirestoreDbService] Patient document successfully set in 'patients' collection.",
      );
      // Assign the patient to the healthcare professional
      console.log(
        '[FirestoreDbService] Calling addPatientToHealthcareProfessional...',
      );
      await this.addPatientToHealthcareProfessional(
        healthcareProfessionalUid,
        newPatient,
      );
      console.log('[FirestoreDbService] createPatient completed successfully.');
      return true;
    } catch (error) {
      console.error('[FirestoreDbService] Error in createPatient:', error);
      throw error; // Re-throw to be caught by handleAddPatient in Dashboard
    }
  }
}

export default FirestoreDbService;

// No React components or hooks should be here. File ends with the export of FirestoreDbService.
// If you need to fetch user data in a React component, do it in src/pages/dashboard.tsx or a similar file using useEffect.
