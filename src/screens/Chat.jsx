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
    KeyboardAvoidingView,
    Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore"; // ✅ Firestore
import RentEasyModal from '../components/RentEasyModal';
import database from '@react-native-firebase/database';


const Chat = ({ navigation, route }) => {
    const { ownerUsername } = route.params || {};
    const [currentUser, setCurrentUser] = useState("");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const scrollViewRef = useRef();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", message: "" });
    const [pendingDeleteKey, setPendingDeleteKey] = useState(null);
    

    const showModal = (title, message, onConfirm = null) => {
        setModalContent({ title, message, onConfirm });
        setModalVisible(true);
    };

    const confirmDelete = (itemKey) => {
        setPendingDeleteKey(itemKey);
        showModal("Delete History?", "Are you sure you want to delete this item?", handleDeleteConfirmed);
    };

    const chatRoomId =
        currentUser && ownerUsername
            ? [currentUser, ownerUsername].sort().join("__")
            : "";

    // ✅ Get username
    useEffect(() => {
        const fetchUsername = async () => {
            const username = await AsyncStorage.getItem("username");
            if (!username) {
                showModal("Error", "Please login first!");
                navigation.navigate("Login");
                return;
            }
            setCurrentUser(username);
        };
        fetchUsername();
    }, []);

    // ✅ Real-time message listener from Realtime Database
    useEffect(() => {
        if (!chatRoomId) return;

        const messagesRef = database().ref(`chats/${chatRoomId}/messages`);

        const onValueChange = messagesRef.on('value', snapshot => {
            const fetchedMessages = [];

            snapshot.forEach(childSnapshot => {
                const messageData = childSnapshot.val();
                fetchedMessages.push({
                    id: childSnapshot.key, // Unique ID for each message
                    ...messageData
                });
            });

            setMessages(fetchedMessages);
        });

        // ✅ Unsubscribe on cleanup
        return () => messagesRef.off('value', onValueChange);
    }, [chatRoomId]);

    const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = {
        text: input.trim(),
        sender: currentUser,
        timestamp: Date.now(), // You can use this for ordering
    };

    try {
        await database()
            .ref(`chats/${chatRoomId}/messages`)
            .push(newMessage);

        setInput("");
    } catch (error) {
        console.error("Send Message Error:", error);
        showModal("Error", "Could not send message.");
    }
};

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require("../../assets/logo.png")}
                        style={styles.logo}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Entypo name="chat" size={36} />
                </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={styles.title}>WELCOME TO RENTEASY</Text>
            <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>

            <TouchableOpacity style={styles.chatLabel}>
                <Text style={styles.chatText}>
                    CHAT WITH {ownerUsername ? ownerUsername.toUpperCase() : "OWNER"}
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
                        key={index}
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

            {/* Input Area */}
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate("ChatBot")}>
                        <Image
                            source={require("../../assets/ChatBot.png")}
                            style={styles.ChatBot}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        placeholder="TYPE HERE............"
                        placeholderTextColor="#999"
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity onPress={handleSend} >
                        <Ionicons name="send" size={28} color="#007bff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* Bottom Nav */}

            <RentEasyModal
                visible={modalVisible}
                title={modalContent.title}
                message={modalContent.message}
                onClose={() => setModalVisible(false)}
                onConfirm={modalContent.onConfirm}
            />

        </View>
    );
};

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E6F0FA",
        paddingTop: 30,
        ...Platform.select({
            ios: { flex: 1, marginTop: 10 },
        }),
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
        marginBottom: 6,
        color: "#1E1E1E",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 16,
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
        marginTop: 15,
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
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 12,
        marginVertical: 6,
        maxWidth: "75%",
        alignSelf: "flex-start",
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
        fontWeight: "500",
        marginTop: 2,
        color: "#444",
    },
    ChatBot: {
        height: 80,
        width: 80,
        resizeMode: "contain",
        borderRadius: 16,
        marginLeft: 325,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        backgroundColor: '#fff',
        ...Platform.select({
            android: {
                padding: 5,
                paddingHorizontal: 10,
                marginTop: 10,
                marginBottom: 1,
                borderWidth: 0.5,
                borderColor: 'black',
                backgroundColor: '#eee'
            },
            ios: {
                padding: 10,
                paddingHorizontal: 15,
                marginTop: 10,
                marginBottom: 10,
                borderWidth: 0.5,
                borderColor: 'black',
                backgroundColor: '#eee'
            }
        }),
        marginBottom: 75,
        borderRadius: 10,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1,
        marginTop: 10,
        height: 50

    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 10
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#eee',
        paddingVertical: 12,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 65,
        marginBottom: 7,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1,
        paddingHorizontal: 16,
        borderTopWidth: 2,
        borderTopColor: '#ccc',
        marginTop: 10,
        borderRadius: 10,
    },
    navItem: {
        alignItems: 'center',
        marginTop: 5
    },
    navLabel: {
        fontSize: 12,
        color: 'black',
        fontWeight: '400',
        marginTop: 4,
        marginBottom: 10,
    },
});