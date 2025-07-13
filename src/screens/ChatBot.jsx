import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

const ChatBot = ({ navigation }) => {
    console.log("ChatBot API Key:", OPENAI_API_KEY);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi 👋! How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful customer support bot for a rental platform.' },
                        ...messages.map(m => ({
                            role: m.sender === 'user' ? 'user' : 'assistant',
                            content: m.text
                        }))
                    ]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const botReply = response.data.choices[0].message.content;
            setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        } catch (err) {
            console.error("ChatBot Error:", err.response?.data || err.message);
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: '⚠️ Sorry, I am having trouble answering that now.'
            }]);
        } finally {
            setLoading(false);
        }
    };


    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Image source={require('../../assets/logo.png')} style={styles.logo} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Entypo name="chat" size={36} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>WELCOME TO RENTEASY</Text>
                <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>

                <TouchableOpacity style={styles.supBtn} >
                    <Text style={styles.supText} >Customer Support</Text>
                    <FontAwesome5 name="robot" size={18} color="#fff" style={{ marginLeft: 6 }} />
                </TouchableOpacity>

                {messages.map((msg, index) => (
                    <View
                        key={index}
                        style={[styles.message, msg.sender === 'user' ? styles.userMsg : styles.botMsg]}
                    >
                        <Text style={styles.msgText}>{msg.text}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputBar}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type your message..."
                    placeholderTextColor="#999"
                    onSubmitEditing={sendMessage}
                    returnKeyType="send"
                />
                <TouchableOpacity onPress={sendMessage} disabled={loading}>
                    <Ionicons name="send" size={28} color="#007bff" />
                </TouchableOpacity>
            </View>

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="home" size={28} />
                    <Text style={styles.navLabel}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("BrowseItems")}>
                    <MaterialIcons name="explore" size={28} />
                    <Text style={styles.navLabel}>Explore</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("AddItem")}>
                    <Entypo name="plus" size={28} />
                    <Text style={styles.navLabel}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("History")}>
                    <Ionicons name="document-text" size={28} />
                    <Text style={styles.navLabel}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
                    <Ionicons name="person" size={28} />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatBot;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F0FA',
        paddingTop: 30,
        ...Platform.select({
            ios: {
                flex: 1,
                marginTop: 10
            }
        })
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 1,
    },
    logo: {
        width: 60,
        height: 70,
        resizeMode: 'contain',
        borderRadius: 16,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 6,
        color: '#1E1E1E',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        color: '#3a3a3a',
        fontStyle: 'italic',
        fontWeight: '500',
        letterSpacing: 0.5,
        opacity: 0.9,
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 120,
    },
    supBtn: {
        flexDirection: 'row',
        backgroundColor: '#001F54',
        paddingVertical: 6,
        paddingHorizontal: 14,
        alignSelf: 'center',
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    supText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
    },
    message: {
        padding: 12,
        borderRadius: 10,
        marginVertical: 6,
        maxWidth: '80%',
        elevation: 2
    },
    userMsg: {
        backgroundColor: '#D1E7DD',
        alignSelf: 'flex-end'
    },
    botMsg: {
        backgroundColor: '#F8D7DA',
        alignSelf: 'flex-start'
    },
    msgText: {
        fontSize: 15,
        color: '#000'
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
                marginBottom: 10,
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
        justifyContent: 'space-between',
        alignItems: 'center',
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