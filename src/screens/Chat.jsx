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
import axios from "axios";

const Chat = ({ navigation, route }) => {
    const { ownerUsername } = route.params || {}; // ✅ Passed from Booking Summary screen

    const [currentUser, setCurrentUser] = useState("");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const scrollViewRef = useRef();
    const URL = "https://renteasy-bbce5-default-rtdb.firebaseio.com";

    // ✅ Create Unique Chat Room ID (Sorted usernames)
    const chatRoomId =
        currentUser && ownerUsername
            ? [currentUser, ownerUsername].sort().join("__")
            : "";

    // ✅ Get logged-in username from AsyncStorage
    useEffect(() => {
        const fetchUsername = async () => {
            const username = await AsyncStorage.getItem("username");
            if (!username) {
                Alert.alert("Error", "Please login first!");
                navigation.navigate("Login");
                return;
            }
            setCurrentUser(username);
        };
        fetchUsername();
    }, []);

    // ✅ Fetch messages every 1 second (Polling)
    useEffect(() => {
        let interval;
        if (chatRoomId) {
            interval = setInterval(fetchMessages, 1000);
        }
        return () => clearInterval(interval);
    }, [chatRoomId]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${URL}/chats/${chatRoomId}.json`);
            const data = response.data || {};
            const formattedMessages = Object.values(data).sort(
                (a, b) => a.timestamp - b.timestamp
            );
            setMessages(formattedMessages);
        } catch (error) {
            console.error("Fetch Messages Error:", error);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessage = {
            text: input.trim(),
            sender: currentUser,
            timestamp: Date.now(),
        };

        try {
            await axios.post(`${URL}/chats/${chatRoomId}.json`, newMessage);
            setInput("");
            setMessages((prev) => [...prev, newMessage]);
        } catch (error) {
            console.error("Send Message Error:", error);
            Alert.alert("Error", "Could not send message.");
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
                <Entypo
                    name="message"
                    size={18}
                    color="#fff"
                    style={{ marginLeft: 4 }}
                />
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
                            msg.sender === currentUser
                                ? styles.right
                                : styles.left,
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
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("ChatBot")}
                    >
                        <Image
                            source={require("../../assets/ChatBot.png")}
                            style={styles.ChatBot}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.inputBar}>
                    <FontAwesome name="smile-o" size={24} color="#555" />
                    <TextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        placeholder="TYPE HERE............"
                        placeholderTextColor="#999"
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity onPress={handleSend}>
                        <Entypo name="attachment" size={24} color="#555" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate("Home")}
                >
                    <Ionicons name="home" size={28} />
                    <Text style={styles.navLabel}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate("BrowseItems")}
                >
                    <MaterialIcons name="explore" size={28} />
                    <Text style={styles.navLabel}>Explore</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate("AddItem")}
                >
                    <Entypo name="plus" size={28} />
                    <Text style={styles.navLabel}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate("History")}
                >
                    <Ionicons name="document-text" size={28} />
                    <Text style={styles.navLabel}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate("Profile")}
                >
                    <Ionicons name="person" size={28} />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
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
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1.5,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        backgroundColor: "#eee",
        marginBottom: 80,
        borderRadius: 10,
        marginHorizontal: 16,
        ...Platform.select({
            ios: {
                marginBottom: 20, // Adjust for iOS keyboard
            },
            android: {
                marginBottom: 80, // Adjust for Android keyboard
                height: 50,
                padding:4
            },
        }),
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 10,
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
