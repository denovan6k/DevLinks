import { initializeApp } from 'firebase/app';
import { clientConfig } from './config';
import { getStorage } from "firebase/storage";
import { getFirestore } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';

export const app = initializeApp(clientConfig);
export const imagedb = getStorage(app);
export const db = getFirestore(app);
const auth = getAuth(app);