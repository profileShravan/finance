// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyCusMpfmb39Vao1pLE4-QAcPM34vcRlubU",
  authDomain: "financely-finance-tracke-e60ec.firebaseapp.com",
  projectId: "financely-finance-tracke-e60ec",
  storageBucket: "financely-finance-tracke-e60ec.appspot.com",
  messagingSenderId: "864856685867",
  appId: "1:864856685867:web:791b404fd209320d55596e",
  measurementId: "G-B6N4HVDCD3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};
