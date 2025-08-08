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
import AsyncStorage from "@react-native-async-storage/async-storage";
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const Chat = ({ navigation, route }) => {
    const { ownerUsername } = route.params || {};
    const { receiverUsername } = route.params || {};
    const [currentUser, setCurrentUser] = useState(null); // { uid, username }
    const [receiver, setReceiver] = useState(null);       // { uid, username }

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const scrollViewRef = useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", message: "" });

    const showModal = (title, message, onConfirm = null) => {
        setModalContent({ title, message, onConfirm });
        setModalVisible(true);
    };

    const chatRoomId = currentUser && ownerUsername
        ? [currentUser, ownerUsername].sort().join("__")
        : null;

    useEffect(() => {
        const initializeChat = async () => {
            try {
                const currentUserUID = auth().currentUser?.uid;

                if (!currentUserUID) {
                    showModal("Error", "Please log in first!");
                    navigation.navigate("Login");
                    return;
                }

                // Get current username (optional, fallback to AsyncStorage)
                const currentUserSnap = await database().ref(`users/${currentUserUID}`).once('value');
                const currentUsername = currentUserSnap.val()?.username || await AsyncStorage.getItem("username");

                if (!currentUsername) {
                    showModal("Error", "Could not retrieve current user data.");
                    return;
                }

                // Get receiver UID from their username
                const receiverSnap = await database().ref(`usernames/${receiverUsername}`).once('value');
                const receiverUID = receiverSnap.val();

                if (!receiverUID) {
                    showModal("Error", "User not found.");
                    return;
                }

                // Set user states
                setCurrentUser({ uid: currentUserUID, username: currentUsername });
                setReceiver({ uid: receiverUID, username: receiverUsername });

                // Set chat room ID
                const roomId = [currentUserUID, receiverUID].sort().join("__");
                setChatRoomId(roomId);
            } catch (error) {
                showModal("Error", "Error initializing chat.");
            }
        };

        initializeChat();
    }, []);

    useEffect(() => {
        if (!chatRoomId) return;

        const messagesRef = database().ref(`chats/${chatRoomId}/messages`);

        const onValueChange = messagesRef.on('value', snapshot => {
            const fetchedMessages = [];
            snapshot.forEach(child => {
                fetchedMessages.push({
                    id: child.key,
                    ...child.val(),
                });
            });

            fetchedMessages.sort((a, b) => a.timestamp - b.timestamp);
            setMessages(fetchedMessages);
        });

        return () => messagesRef.off('value', onValueChange);
    }, [chatRoomId]);


    const handleSend = async () => {
        if (!input.trim() || !chatRoomId || !currentUser) return;

        const newMessage = {
            text: input.trim(),
            sender: currentUser.username, // Keep showing username
            senderUID: currentUser.uid,   // Optionally store UID too
            timestamp: Date.now(),
        };

        try {
            await database()
                .ref(`chats/${chatRoomId}/messages`)
                .push(newMessage);

            setInput("");
        } catch (error) {
            showModal("Error", "Failed to send message.");
        }
    };


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
                    <Entypo name="chat" size={36} />
                </View>

                {/* Title */}
                <Text style={styles.title}>WELCOME TO RENTEASY</Text>
                <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>

                {/* Chat Label */}
                <TouchableOpacity style={styles.chatLabel}>
                    <Text style={styles.chatText}>
                        CHAT WITH {receiver?.username?.toUpperCase() || "USER"}
                    </Text>

                    <Entypo name="message" size={18} color="#fff" style={{ marginLeft: 4 }} />
                </TouchableOpacity>

                {/* Messages */}
                <ScrollView
                    contentContainerStyle={styles.messageContainer}
                    showsVerticalScrollIndicator={false}
                    ref={scrollViewRef}
                >
                    {messages.map((msg, index) => (
                        <View
                            key={msg.id || index}
                            style={[
                                styles.messageBubble,
                                msg.sender === currentUser ? styles.right : styles.left,
                            ]}
                        >
                            <Text style={styles.messageText}>{msg.text}</Text>
                            <Text style={styles.senderLabel}>
                                {msg.sender === currentUser
                                    ? `${msg.sender} 👉`
                                    : `👈 ${msg.sender}`}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

                {/* ChatBot Button */}
                <TouchableOpacity
                    style={styles.chatbotButton}
                    onPress={() => navigation.navigate("ChatBot")}
                >
                    <Image
                        source={require("../../assets/ChatBot.png")}
                        style={styles.chatbotImage}
                    />
                </TouchableOpacity>

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
        paddingTop: 30,
        ...Platform.select({ ios: { marginTop: 10 } }),
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    logo: {
        width: 70,
        height: 70,
        resizeMode: "contain",
        borderRadius: 35,
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
        color: "#1E1E1E",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 10,
        color: "#3a3a3a",
        fontStyle: "italic",
    },
    chatLabel: {
        alignSelf: "center",
        backgroundColor: "#001F54",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 10,
    },
    chatText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "bold",
    },
    messageContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100,
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
        borderRadius: 10,
        margin: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 10,
    },
    chatbotButton: {
        position: "absolute",
        bottom: 90,
        right: 20,
    },
    chatbotImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
        resizeMode: "contain",
    },
});
