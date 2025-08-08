import { ref, get } from 'firebase/database';
import { db } from '../firebase/firebaseConfig';

const getUsernameFromUID = async (uid) => {
  const userRef = ref(db, `users/${uid}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val().username;
  } else {
    throw new Error('User not found');
  }
};
