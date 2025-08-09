import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Platform,
    KeyboardAvoidingView
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import RentEasyModal from '../components/RentEasyModal';
import { getDatabase, ref, onValue, push, get } from 'firebase/database';
import { getAuth } from "firebase/auth";

const Chat = ({ navigation, route }) => {
    const { receiverUid, receiverUsername } = route.params || {};
    const db = getDatabase();
    const auth = getAuth();

    const [currentUser, setCurrentUser] = useState(null); // { uid, username }
    const [receiver, setReceiver] = useState({ uid: receiverUid, username: receiverUsername });

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const scrollViewRef = useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", message: "" });

    const showModal = (title, message, onConfirm = null) => {
        setModalContent({ title, message, onConfirm });
        setModalVisible(true);
    };

    const chatRoomId =
        currentUser?.uid && receiver?.uid
            ? [currentUser.uid, receiver.uid].sort().join("__")
            : null;

    // Fetch current user + receiver info
    useEffect(() => {
        const initializeChat = async () => {
            try {
                const currentUserUID = auth.currentUser?.uid;
                if (!currentUserUID) {
                    showModal("Error", "Please log in first!");
                    navigation.navigate("Login");
                    return;
                }

                // Fetch current user data
                const currentUserSnap = await get(ref(db, `users/${currentUserUID}`));
                if (!currentUserSnap.exists()) {
                    showModal("Error", "Current user not found.");
                    return;
                }
                const currentUserData = currentUserSnap.val();

                setCurrentUser({
                    uid: currentUserUID,
                    username: currentUserData.username || "Unknown",
                });

                // If receiver username missing, fetch from DB
                if (!receiver.username && receiver.uid) {
                    const receiverSnap = await get(ref(db, `users/${receiver.uid}`));
                    if (receiverSnap.exists()) {
                        setReceiver((prev) => ({
                            ...prev,
                            username: receiverSnap.val()?.username || "Unknown",
                        }));
                    }
                }
            } catch (error) {
                showModal("Error", "Error initializing chat.");
            }
        };

        initializeChat();
    }, []);

    // Fetch messages in real-time
    useEffect(() => {
        if (!chatRoomId) return;
        const messagesRef = ref(db, `chats/${chatRoomId}/messages`);

        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const fetchedMessages = [];
            snapshot.forEach((child) => {
                fetchedMessages.push({
                    id: child.key,
                    ...child.val(),
                });
            });

            fetchedMessages.sort((a, b) => a.timestamp - b.timestamp);
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [chatRoomId]);

    // Send message
    const handleSend = async () => {
        if (!input.trim() || !chatRoomId || !currentUser) return;

        const newMessage = {
            text: input.trim(),
            sender: currentUser.username,
            senderUID: currentUser.uid,
            timestamp: Date.now(),
        };

        try {
            await push(ref(db, `chats/${chatRoomId}/messages`), newMessage);
            setInput("");
        } catch (error) {
            showModal("Error", "Failed to send message.");
        }
    };

    // Auto-scroll
    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={require("../../assets/logo.png")}
                            style={styles.logo}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {receiver?.username || "User"}
                    </Text>
                   
                </View>

                {/* Messages */}
                <ScrollView
                    contentContainerStyle={styles.messageContainer}
                    showsVerticalScrollIndicator={false}
                    ref={scrollViewRef}
                >
                    {messages.map((msg) => (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageBubble,
                                msg.senderUID === currentUser?.uid
                                    ? styles.right
                                    : styles.left,
                            ]}
                        >
                            <Text style={styles.messageText}>{msg.text}</Text>
                            <Text style={styles.senderLabel}>
                                {msg.senderUID === currentUser?.uid
                                    ? "You"
                                    : msg.sender}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Input Area */}
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Type your message..."
                        placeholderTextColor="#999"
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity onPress={handleSend}>
                        <Ionicons name="send" size={28} color="#007bff" />
                    </TouchableOpacity>
                </View>

                {/* Modal */}
                <RentEasyModal
                    visible={modalVisible}
                    title={modalContent.title}
                    message={modalContent.message}
                    onClose={() => setModalVisible(false)}
                    onConfirm={modalContent.onConfirm}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E6F0FA",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 10,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        alignSelf:"center",
        alignItems:'center',
        marginLeft:10
    },
    messageContainer: {
        padding: 16,
        paddingBottom: 80,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 12,
        marginVertical: 6,
        maxWidth: "75%",
    },
    left: {
        alignSelf: "flex-start",
        backgroundColor: "#f0f0f0",
    },
    right: {
        alignSelf: "flex-end",
        backgroundColor: "#d4e9ff",
    },
    messageText: {
        fontSize: 15,
    },
    senderLabel: {
        fontSize: 11,
        marginTop: 4,
        color: "#555",
    },
    inputBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ccc",
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 10,
    },
});
