
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDhspi4mYzWSEZWu2oy-EsWZL4XXpc5d04",
  authDomain: "interviews-9bd9b.firebaseapp.com",
  projectId: "interviews-9bd9b",
  storageBucket: "interviews-9bd9b.appspot.com",
  messagingSenderId: "296421667361",
  appId: "1:296421667361:web:ed30af9f9fc1e6279ea960",
  measurementId: "G-R1VLEDCZPC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };