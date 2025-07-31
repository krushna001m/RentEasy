// firebaseService.js
import storage from '@react-native-firebase/storage';
import { Platform } from 'react-native';
import uuid from 'react-native-uuid';

export const uploadImageToFirebase = async (uri) => {
    if (!uri) return null;

    try {
        const imageId = uuid.v4(); // unique file name
        const fileName = `itemImages/${imageId}.jpg`;

        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const reference = storage().ref(fileName);

        await reference.putFile(uploadUri);
        const downloadUrl = await reference.getDownloadURL();

        return downloadUrl;
    } catch (error) {
        console.error('🔥 Firebase upload error:', error);
        throw error;
    }
};
