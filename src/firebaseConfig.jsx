// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAPs_NeoYTDs7ufIRmfKyXKXdTHOt4Lh6I",
  authDomain: "renteasy-bbce5.firebaseapp.com",
  databaseURL: "https://renteasy-bbce5-default-rtdb.firebaseio.com",
  projectId: "renteasy-bbce5",
  storageBucket: "renteasy-bbce5.firebasestorage.app",
  messagingSenderId: "822340796747",
  appId: "1:822340796747:android:560109758edbd5ef9fa8ce"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Setup Realtime Database
const database = getDatabase(app);

// ✅ Setup Storage
const storage = getStorage(app);

const auth = getAuth(app);

export {
  database,
  ref,
  set,
  push,
  storage,
  storageRef,
  uploadBytes,
  getDownloadURL,
  auth
};
