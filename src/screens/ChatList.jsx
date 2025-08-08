import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { firebase } from '../services/firebaseConfig'; // Adjust path if needed
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const ChatList = ({ navigation }) => {
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = getAuth().currentUser.uid;
    const db = getDatabase();

    useEffect(() => {
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
                    const isUserInChat = Object.values(chat.users).includes(userId);
                    if (isUserInChat) {
                        const otherUserId = Object.values(chat.users).find((id) => id !== userId);
                        const lastMsg = Object.values(chat.messages).pop();

                        // Fetch username of other user
                        const userRef = ref(db, `users/${otherUserId}`);
                        const userPromise = new Promise((resolve) => {
                            onValue(userRef, (userSnap) => {
                                const userData = userSnap.val();
                                loadedChats.push({
                                    chatId: chatKey,
                                    userId: otherUserId,
                                    username: userData?.username || 'Unknown',
                                    lastMessage: lastMsg?.text || 'No messages yet',
                                });
                                resolve();
                            }, {
                                onlyOnce: true,
                            });
                        });

                        userPromises.push(userPromise);
                    }
                }
            }

            await Promise.all(userPromises);
            setChatList(loadedChats.reverse());
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
                navigation.navigate('Chat', {
                    receiverUsername: item.username, // 👈 passed to Chat.jsx
                })
            }
        >
            <Ionicons name="person-circle-outline" size={36} color="#555" />
            <View style={styles.chatTextContainer}>
                <Text style={styles.chatUserId}>{item.username}</Text>
                <Text style={styles.chatLastMessage} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
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
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Chat List</Text>
                    <Text style={styles.headerSubtitle}>Messages with Borrowers / Lenders</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                    <Ionicons name="chatbubble-ellipses-outline" size={26} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Chat List */}
            {loading ? (
                <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
            ) : chatList.length > 0 ? (
                <FlatList
                    data={chatList}
                    keyExtractor={(item) => item.chatId}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            ) : (
                <View style={styles.noChatsContainer}>
                    <Text style={styles.noChatsText}>No chats found.</Text>
                </View>
            )}
        </View>
    );
};

export default ChatList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingTop: 40,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#f2f2f2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
    },
    logo: {
        width: 36,
        height: 36,
    },
    headerTextContainer: {
        flex: 1,
        marginLeft: 12,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#888',
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    chatTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    chatUserId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    chatLastMessage: {
        fontSize: 14,
        color: '#555',
        marginTop: 2,
    },
    noChatsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noChatsText: {
        fontSize: 16,
        color: '#999',
    },
});
