import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBhvhoW8ykOGOkjS48u9nNYD3XSdjg_leI",
  authDomain: "data-of-saso.firebaseapp.com",
  projectId: "data-of-saso",
  storageBucket: "data-of-saso.firebasestorage.app",
  messagingSenderId: "139514168369",
  appId: "1:139514168369:web:a45711a85c9a9e44ed8110",
  measurementId: "G-DVSTF8K0ZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;