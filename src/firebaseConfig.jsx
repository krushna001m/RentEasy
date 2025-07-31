// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAPs_NeoYTDs7ufIRmfKyXKXdTHOt4Lh6I",
  authDomain: "renteasy-bbce5.firebaseapp.com",
  databaseURL: "https://renteasy-bbce5-default-rtdb.firebaseio.com",
  projectId: "renteasy-bbce5",
  storageBucket: "renteasy-bbce5.appspot.com", // correct Firebase Storage bucket
  messagingSenderId: "822340796747",
  appId: "1:822340796747:android:560109758edbd5ef9fa8ce"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, push };
