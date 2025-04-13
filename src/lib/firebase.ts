
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwq1zcFbx30O9uPhudEhgKPz5AkBzFZVU",
  authDomain: "evchargingstationfinder-736ec.firebaseapp.com",
  projectId: "evchargingstationfinder-736ec",
  storageBucket: "evchargingstationfinder-736ec.appspot.com",
  messagingSenderId: "712598879499",
  appId: "1:712598879499:web:26d3e5f32a44e0d0835d28",
  measurementId: "G-GQ8RJDVNHE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Auth provider to select account every time
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, db, googleProvider };
