// firebaseService.js
import storage from '@react-native-firebase/storage';
import { Platform } from 'react-native';
import uuid from 'react-native-uuid';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';

export const uploadImageToFirebase = async (uri) => {
    if (!uri) return null;

    try {
        const imageId = uuid.v4();
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

// ✅ Save image URL to Realtime Database
export const saveImageUrlToRealtimeDB = async (url, itemId) => {
    try {
        await database()
            .ref(`/items/${itemId}/images`)
            .push(url);
        console.log('✅ Image URL saved to Realtime Database');
    } catch (error) {
        console.error('🔥 Failed to save URL to Realtime DB:', error);
        throw error;
    }
};

// ✅ Save image URL to Firestore (Cloud Firestore)
export const saveImageUrlToFirestore = async (url, itemId) => {
    try {
        const itemRef = firestore().collection('items').doc(itemId);
        await itemRef.update({
            images: firestore.FieldValue.arrayUnion(url),
        });
        console.log('✅ Image URL saved to Firestore');
    } catch (error) {
        console.error('🔥 Failed to save URL to Firestore:', error);
        throw error;
    }
};
