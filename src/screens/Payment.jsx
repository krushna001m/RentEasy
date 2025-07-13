import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Payment = ({ navigation, route }) => {
    const { itemInfo, title } = route.params;
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: '',
    });
    const [upiId, setUpiId] = useState('');
    const [agreed, setAgreed] = useState(false);

    const handlePayNow = () => {
        if (!agreed) {
            Alert.alert('⚠️ Agreement Required', 'Please agree to the rental policy.');
            return;
        }

        if (paymentMethod === 'card') {
            const { number, expiry, cvv, name } = cardDetails;
            if (!number || !expiry || !cvv || !name) {
                Alert.alert('⚠️ Missing Info', 'Please fill all card details.');
                return;
            }
        }

        if (paymentMethod === 'upi' && !upiId) {
            Alert.alert('⚠️ Missing UPI', 'Please enter your UPI ID.');
            return;
        }

        Alert.alert('✅ Payment Successful', 'Thanks for renting with RentEasy!');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Image source={require('../../assets/logo.png')} style={styles.logo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Entypo name="chat" size={36} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                <View>
                    <Text style={styles.title}>WELCOME TO RENTEASY</Text>
                    <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>
                </View>

                {/* Booking Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.sectionTitle}>📑 BOOKING SUMMARY</Text>
                    <Text style={styles.summaryText}>📦 ITEM: {title}</Text>

                    {/* Optional fields check */}
                    {itemInfo.owner && (
                        <Text style={styles.summaryText}>👤 OWNER: {itemInfo.owner}</Text>
                    )}
                    {itemInfo.availability && (
                        <Text style={styles.summaryText}>📅 RENTAL AVAILABILITY: {itemInfo.availability}</Text>
                    )}
                    {itemInfo.duration && (
                        <Text style={styles.summaryText}>🕒 DURATION: {itemInfo.duration}</Text>
                    )}
                    {itemInfo.price && (
                        <Text style={styles.summaryText}>💸 RENTAL PRICE: {itemInfo.price}</Text>
                    )}
                    {itemInfo.location && (
                        <Text style={styles.summaryText}>📍 LOCATION: {itemInfo.location}</Text>
                    )}
                </View>


                {/* Payment Method Selection */}
                <Text style={styles.sectionTitle}>💳 SELECT PAYMENT METHOD</Text>

                {/* Card Option */}
                <TouchableOpacity onPress={() => setPaymentMethod('card')} style={styles.radio}>
                    <Text style={{ fontWeight: paymentMethod === 'card' ? 'bold' : 'normal' }}>
                        🔘 💳 CREDIT / DEBIT CARD
                    </Text>
                </TouchableOpacity>

                {paymentMethod === 'card' && (
                    <>
                        <TextInput
                            placeholder="💳 Card Number "
                            style={styles.input}
                            keyboardType="numeric"
                            maxLength={16}
                            onChangeText={(text) => setCardDetails({ ...cardDetails, number: text })}
                            value={cardDetails.number}
                        />
                        <TextInput
                            placeholder="📅 Expiry Date (MM/YY) "
                            style={styles.input}
                            onChangeText={(text) => setCardDetails({ ...cardDetails, expiry: text })}
                            value={cardDetails.expiry}
                        />
                        <TextInput
                            placeholder="🔒 CVV "
                            style={styles.input}
                            secureTextEntry
                            keyboardType="numeric"
                            maxLength={3}
                            onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })}
                            value={cardDetails.cvv}
                        />
                        <TextInput
                            placeholder="🧾 Name on Card "
                            style={styles.input}
                            onChangeText={(text) => setCardDetails({ ...cardDetails, name: text })}
                            value={cardDetails.name}
                        />
                    </>
                )}

                {/* UPI Option */}
                <TouchableOpacity onPress={() => setPaymentMethod('upi')} style={styles.radio}>
                    <Text style={{ fontWeight: paymentMethod === 'upi' ? 'bold' : 'normal' }}>
                        🔘 💰 PAY VIA GOOGLE PAY / PHONEPE / PAYTM
                    </Text>
                </TouchableOpacity>

                {paymentMethod === 'upi' && (
                    <TextInput
                        placeholder="Enter UPI ID (e.g., krushna@upi)"
                        style={styles.input}
                        onChangeText={(text) => setUpiId(text)}
                        value={upiId}
                    />
                )}

                {/* Net Banking Option */}
                <TouchableOpacity onPress={() => setPaymentMethod('net')} style={styles.radio}>
                    <Text style={{ fontWeight: paymentMethod === 'net' ? 'bold' : 'normal' }}>
                        🔘 🏦 NET BANKING
                    </Text>
                </TouchableOpacity>

                {/* Security Note */}
                <Text style={styles.note}>
                    🔐 “All payments are 100% secure and encrypted. Your details are never stored.”
                </Text>

                {/* Custom Checkbox */}
                <TouchableOpacity
                    onPress={() => setAgreed(!agreed)}
                    style={styles.customCheckboxContainer}
                >
                    <FontAwesome
                        name={agreed ? 'check-square' : 'square-o'}
                        size={24}
                        color={agreed ? '#001F54' : '#888'}
                    />
                    <Text style={styles.checkboxText}>
                        I AGREE TO RENTEASY’S RENTAL POLICY AND WILL RETURN THE ITEM SAFELY.
                    </Text>
                </TouchableOpacity>

                {/* Pay Now Button */}
                <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
                    <Text style={styles.payText}>PAY NOW</Text>
                </TouchableOpacity>
            </ScrollView>
            {/*  Fixed Bottom Navigation */}
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
        </View >
    );
};

export default Payment;

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
    sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 25,
        marginBottom: 10,
    },
    summaryCard: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    summaryText: {
        marginBottom: 5,
        fontSize: 14,
        margin: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 10,
        padding: 10,
        marginVertical: 6,
        marginLeft: 30
    },
    radio: {
        marginTop: 10,
        marginLeft: 20
    },
    note: {
        fontSize: 14,
        color: '#555',
        marginTop: 70,
        marginBottom: 20
    },
    customCheckboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    checkboxText: {
        marginLeft: 10,
        fontSize: 12,
        color: '#333',
        flex: 1,
        flexWrap: 'wrap',
    },
    payButton: {
        backgroundColor: '#001F54',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    payText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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

