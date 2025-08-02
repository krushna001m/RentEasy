import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from 'react-native-uuid';
import app from './firebaseConfig';

const uploadImageToFirebase = async (imageUri) => {
    try {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const storage = getStorage(app);
        const imageId = uuid.v4(); // ✅ React Native safe UUID
        const ref = storageRef(storage, `images/${imageId}`);

        await uploadBytes(ref, blob);
        const downloadURL = await getDownloadURL(ref);
        return downloadURL;

    } catch (error) {
        console.error('Upload Error:', error);
        return null;
    }
};

export { uploadImageToFirebase };
