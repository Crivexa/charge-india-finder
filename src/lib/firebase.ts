
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAC_wwUiMvLtgb0LZ9byxF6v64ZiyWFeB8",
  authDomain: "evchargingstationfinder-736ec.firebaseapp.com",
  projectId: "evchargingstationfinder-736ec",
  storageBucket: "evchargingstationfinder-736ec.firebasestorage.app",
  messagingSenderId: "780182430601",
  appId: "1:780182430601:web:b1872b0d4755261e767758",
  measurementId: "G-KY7LSY2ZVP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Auth provider to select account every time
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, db, googleProvider, analytics };
