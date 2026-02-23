import {
  collection,
  onSnapshot,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../src/config/firebase';
import { ElementData } from '../types';

// --- Elements ---

export interface FirestoreElement {
  number: number;
  symbol: string;
  names: { ru: string; en: string; kk: string };
  mass: number;
  category: string;
  group: number;
  period: number;
}

export function subscribeToElements(
  callback: (elements: FirestoreElement[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(collection(db, 'elements'), orderBy('number'));
  return onSnapshot(
    q,
    (snapshot) => {
      const elements = snapshot.docs.map(
        (doc) => ({ ...doc.data() } as FirestoreElement)
      );
      callback(elements);
    },
    (error) => {
      console.error('Error subscribing to elements:', error);
      onError?.(error);
    }
  );
}

export async function updateElement(
  symbol: string,
  data: Partial<FirestoreElement>
): Promise<void> {
  const docRef = doc(db, 'elements', symbol);
  await updateDoc(docRef, data);
}

// --- Formulas ---

export interface FirestoreFormula {
  id: string;
  name: string;
  equation: string;
  category?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export function subscribeToFormulas(
  callback: (formulas: FirestoreFormula[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    collection(db, 'formulas'),
    (snapshot) => {
      const formulas = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as FirestoreFormula)
      );
      callback(formulas);
    },
    (error) => {
      console.error('Error subscribing to formulas:', error);
      onError?.(error);
    }
  );
}

export async function addFormula(data: {
  name: string;
  equation: string;
  category?: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, 'formulas'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateFormula(
  id: string,
  data: { name?: string; equation?: string; category?: string }
): Promise<void> {
  const docRef = doc(db, 'formulas', id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteFormula(id: string): Promise<void> {
  const docRef = doc(db, 'formulas', id);
  await deleteDoc(docRef);
}

// --- Users (admin) ---

export interface FirestoreUser {
  uid: string;
  displayName: string;
  email: string;
  role: 'admin' | 'user';
  createdAt?: Timestamp;
  isActive?: boolean;
}

export function subscribeToUsers(
  callback: (users: FirestoreUser[]) => void,
  onError?: (error: Error) => void
): () => void {
  return onSnapshot(
    collection(db, 'users'),
    (snapshot) => {
      const users = snapshot.docs.map(
        (doc) => ({ uid: doc.id, ...doc.data() } as FirestoreUser)
      );
      callback(users);
    },
    (error) => {
      console.error('Error subscribing to users:', error);
      onError?.(error);
    }
  );
}

export async function updateUserRole(
  uid: string,
  role: 'admin' | 'user'
): Promise<void> {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, { role });
}

export async function banUser(uid: string, banned: boolean): Promise<void> {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, { isActive: !banned });
}
