import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  // These will be set via environment variables in production
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "codewise-hub.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "codewise-hub",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "codewise-hub.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider 
};

// User profile management
export const createUserProfile = async (userAuth: any, additionalData: any = {}) => {
  if (!userAuth) return;
  
  const userRef = doc(db, 'users', userAuth.uid);
  const snapShot = await getDoc(userRef);

  if (!snapShot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        displayName: displayName || additionalData.name || 'User',
        name: additionalData.name || displayName || 'User',
        email,
        createdAt,
        role: additionalData.role || 'student',
        ageGroup: additionalData.ageGroup || '6-11',
        childName: additionalData.childName || '',
        schoolName: additionalData.schoolName || '',
        ...additionalData
      });
    } catch (error) {
      console.log('Error creating user profile', error);
    }
  }

  return userRef;
};