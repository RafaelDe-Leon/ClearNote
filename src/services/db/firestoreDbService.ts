import { db } from '@/main';
import {
  getDoc,
  addDoc,
  collection,
  Firestore,
  CollectionReference,
  doc,
  setDoc,
} from 'firebase/firestore';

// import COLLECTION_NAMES from '@/constants/collectionNames';
import HealthcareProfessional from '@/models/healthCareProfessional.model';

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

  async create(uid: string, payload: any) {
    try {
      const newDoc = await setDoc(doc(this.collection, uid), payload);
      return newDoc;
    } catch (error) {
      console.error('HANDLE ERROR', error);
      return null;
    }
  }

  async get(id?: string) {
    try {
      if (id) {
        const retrieve = await getDoc(doc(this.collection, id));
        return retrieve;
        // get single doc
      }

      // return all docs
    } catch (error) {
      console.error('HANDLE ERROR', error);
      return null;
    }
  }
}

export default FirestoreDbService;
