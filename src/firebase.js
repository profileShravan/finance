// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAnalytics} from "firebase/analytics"
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore, doc, setDoc} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiqiMt9YhxURLU0jemXzAICJXBSeazoGI",
  authDomain: "financly-ef22f.firebaseapp.com",
  projectId: "financly-ef22f",
  storageBucket: "financly-ef22f.appspot.com",
  messagingSenderId: "119326070635",
  appId: "1:119326070635:web:55858a3cb8f429a4985e2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc};