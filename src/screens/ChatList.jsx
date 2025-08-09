import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatList = ({ navigation }) => {
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUid, setCurrentUid] = useState(null);

    const auth = getAuth();
    const db = getDatabase();

    useEffect(() => {
        // Get UID from AsyncStorage or Firebase Auth
        const fetchUid = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('loggedInUser');
                if (storedUser) {
                    const parsed = JSON.parse(storedUser);
                    if (parsed?.uid) {
                        setCurrentUid(parsed.uid);
                        return;
                    }
                }
                if (auth.currentUser?.uid) {
                    setCurrentUid(auth.currentUser.uid);
                } else {
                    Alert.alert('Error', 'User is not logged in.');
                }
            } catch (err) {
                console.error('UID fetch error:', err);
            }
        };
        fetchUid();
    }, []);

    useEffect(() => {
        if (!currentUid) return;

        const chatRef = ref(db, 'chats');
        const unsubscribe = onValue(chatRef, async (snapshot) => {
            const data = snapshot.val();
            const loadedChats = [];

            if (!data) {
                setChatList([]);
                setLoading(false);
                return;
            }

            const userPromises = [];

            for (const chatKey in data) {
                const chat = data[chatKey];
                if (chat?.users && chat.messages) {
                    const isUserInChat = Object.values(chat.users).includes(currentUid);
                    if (isUserInChat) {
                        const otherUserId = Object.values(chat.users).find((id) => id !== currentUid);
                        const messagesArray = Object.values(chat.messages || {});
                        const lastMsg = messagesArray[messagesArray.length - 1] || {};
                        const lastMsgTime = lastMsg?.timestamp || null;

                        const userRef = ref(db, `users/${otherUserId}`);
                        const userPromise = new Promise((resolve) => {
                            onValue(
                                userRef,
                                (userSnap) => {
                                    const userData = userSnap.val() || {};
                                    loadedChats.push({
                                        chatId: chatKey,
                                        userId: otherUserId,
                                        username: userData.username || 'Unknown',
                                        profileImage: userData.profileImage || null,
                                        lastMessage: lastMsg?.text || 'No messages yet',
                                        lastMessageTime: lastMsgTime,
                                    });
                                    resolve();
                                },
                                { onlyOnce: true }
                            );
                        });

                        userPromises.push(userPromise);
                    }
                }
            }

            await Promise.all(userPromises);
            loadedChats.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
            setChatList(loadedChats);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUid]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
                navigation.navigate('Chat', {
                    receiverUid: item.userId,
                    receiverUsername: item.username
                })
            }
        >
            <Image
                source={
                    item.profileImage
                        ? { uri: item.profileImage }
                        : require('../../assets/user-icon.png')
                }
                style={styles.avatar}
            />
            <View style={styles.chatTextContainer}>
                <View style={styles.chatHeader}>
                    <Text style={styles.chatUserId}>{item.username}</Text>
                    {item.lastMessageTime && (
                        <Text style={styles.chatTime}>
                            {new Date(item.lastMessageTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    )}
                </View>
                <Text style={styles.chatLastMessage} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.headerTitle}>Chats</Text>
            </View>

            {/* Chat List */}
            {loading ? (
                <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
            ) : chatList.length > 0 ? (
                <FlatList
                    data={chatList}
                    keyExtractor={(item) => item.chatId}
                    renderItem={renderItem}
                />
            ) : (
                <View style={styles.noChatsContainer}>
                    <Text style={styles.noChatsText}>No chats found.</Text>
                </View>
            )}

            {/* ChatBot Floating Button */}
            <TouchableOpacity
                style={styles.chatbotContainer}
                onPress={() => navigation.navigate('ChatBot')}
            >
                <Image
                    source={require('../../assets/ChatBot.png')}
                    style={styles.chatbot}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </View>
    );
};

export default ChatList;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        paddingTop: 40,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#f2f2f2',
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
    },
    logo: { width: 36, height: 36 },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        backgroundColor: '#ccc',
    },
    chatTextContainer: { flex: 1, justifyContent: 'center' },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    chatUserId: { fontSize: 16, fontWeight: '600', color: '#333' },
    chatTime: { fontSize: 12, color: '#888' },
    chatLastMessage: { fontSize: 14, color: '#555' },
    noChatsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    noChatsText: { fontSize: 16, color: '#999' },
    chatbotContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    chatbot: {
        width: 70,
        height: 70,
    },
});
