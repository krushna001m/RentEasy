import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = getStorage();

export const uploadImagesToFirebase = async (uris) => {
  const urls = [];

  for (const uri of uris) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageId = uuidv4();
    const imageRef = ref(storage, `item-images/${imageId}.jpg`);

    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);
    urls.push(downloadURL);
  }

  return urls; // All uploaded image URLs
};
