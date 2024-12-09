// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYGs7pI1uhbjq54FHLamLGVbMMI8HfLxs",
  authDomain: "callback-7f7b6.firebaseapp.com",
  projectId: "callback-7f7b6",
  storageBucket: "callback-7f7b6.firebasestorage.app",
  messagingSenderId: "808358483123",
  appId: "1:808358483123:web:8fec30bb98d4853950ccc6",
  measurementId: "G-P0ZZ3N6KW1"
};

// Initialize Firebase
const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;