import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBXFGAVpObinRmMb0DcL_fW2mMzQ2voquA",
    authDomain: "exampracticebyaa.firebaseapp.com",
    projectId: "exampracticebyaa",
    storageBucket: "exampracticebyaa.appspot.com",
    messagingSenderId: "892700899290",
    appId: "1:892700899290:web:d66b3782d79c780927f2e3",
    measurementId: "G-90MKG9SXVK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logout = () => {
  return signOut(auth);
};