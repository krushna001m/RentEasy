import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Chat = ({ navigation }) => {
    const [messages, setMessages] = useState([
        { text: 'Hey! Your item is ready for pickup.', sender: 'lender' },
        { text: 'Thanks! I will come at 5 PM.', sender: 'borrower' },
        { text: 'Sure, see you then.', sender: 'lender' },
        { text: 'Will you be available tomorrow as well?', sender: 'borrower' },
        { text: 'Yes, till 3 PM.', sender: 'lender' },
    ]);

    const [input, setInput] = useState('');
    const scrollViewRef = useRef();

    const handleSend = () => {
        if (input.trim()) {
            setMessages(prev => [...prev, { text: input.trim(), sender: 'borrower' }]);
            setInput('');
        }
    };

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}> 
                    <Image source={require('../../assets/logo.png')} style={styles.logo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("Chat")}>
                    <Entypo name="chat" size={36} />
                </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={styles.title}>WELCOME TO RENTEASY</Text>
            <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>
            <TouchableOpacity style={styles.chatLabel}>
                <Text style={styles.chatText}>CHAT</Text>
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
                        style={[styles.messageBubble, msg.sender === 'lender' ? styles.left : styles.right]}
                    >
                        <Text style={styles.messageText}>{msg.text}</Text>
                        <Text style={styles.senderLabel}>{msg.sender === 'lender' ? '👈 LENDER' : 'BORROWER 👉'}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Input Area */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
        </View>
    );
};

export default Chat;

const styles = StyleSheet.create({
       container: {
            flex: 1,
            backgroundColor: '#E6F0FA',
            paddingTop: 30,
            ...Platform.select({
                ios:{
                    flex:1,
                    marginTop:10
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
         borderRadius:16,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 6,
        color: '#1E1E1E',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    logo: {
        width: 60,
        height: 70,
        resizeMode: 'contain',
        borderRadius: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 6,
        fontStyle: 'italic'
    },
    chatLabel: {
        alignSelf: 'center',
        backgroundColor: '#001F54',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 10,
        padding:10,
        marginTop:15
    },
    chatText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold'
    },
    messageContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100
    },
    messageBubble: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 12,
        marginVertical: 6,
        maxWidth: '75%',
        alignSelf: 'flex-start'
    },
    left: {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0'
    },
    right: {
        alignSelf: 'flex-end',
        backgroundColor: '#d4e9ff'
    },
    messageText: {
        fontSize: 15
    },
    senderLabel: {
        fontSize: 11,
        fontWeight: '500',
        marginTop: 2,
        color: '#444'
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        backgroundColor: '#fff',
        ...Platform.select({
            android:{
                padding:5,
                paddingHorizontal:10,
                marginTop:10,
                marginBottom:10,
                borderWidth:0.5,
                borderColor:'black',
                backgroundColor:'#eee'
            },
            ios:{
                padding:10,
                paddingHorizontal:15,
                marginTop:10,
                marginBottom:10,
                borderWidth:0.5,
                borderColor:'black',
                backgroundColor:'#eee'
            }
        }),
        marginBottom:75,
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
        height:50
        
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
        paddingVertical: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 65,
        borderTopWidth: 2,
        borderTopColor: '#ccc',
        paddingHorizontal: 16
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
