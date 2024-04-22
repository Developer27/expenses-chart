// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyBuKx3R7SlC2houHdlm5AOERk5HcYb6734",
  authDomain: "cards-11b89.firebaseapp.com",
  projectId: "cards-11b89",
  storageBucket: "cards-11b89.appspot.com",
  messagingSenderId: "386337211250",
  appId: "1:386337211250:web:9a218647122f06342513eb",
  measurementId: "G-G8V2W14C09"

};


// Initialize Firebase

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { db }
