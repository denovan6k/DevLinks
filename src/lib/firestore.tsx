import { getFirestore } from "firebase/firestore";
import {app} from '../../firebase';

const db = getFirestore(app);
export default db;

// import { initFirestore } from "@auth/firebase-adapter"
// import { cert } from "firebase-admin/app"
 
// export const firestore = initFirestore({
//   credential: cert({
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
//   }),
// })