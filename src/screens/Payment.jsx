import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
    Platform,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const URL = "https://renteasy-bbce5-default-rtdb.firebaseio.com";

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
    const [netBankingDetails, setNetBankingDetails] = useState({
        name: '',
        bank: '',
        account: '',
        ifsc: ''
    });
    const [agreed, setAgreed] = useState(false);

    // ✅ NEW STATE: Days, Selected Price Option, Total Amount
    const [days, setDays] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);


    useEffect(() => {
        const perDay = Number(itemInfo?.pricePerDay || 0);
        const price3Days = Number(itemInfo?.price3Days || 0);
        const priceWeek = Number(itemInfo?.priceWeek || 0);
        const deposit = Number(itemInfo?.securityDeposit || 0);

        let total = 0;
        let remainingDays = days;

        // Apply week pricing
        if (priceWeek > 0 && remainingDays >= 7) {
            const weeks = Math.floor(remainingDays / 7);
            total += weeks * priceWeek;
            remainingDays -= weeks * 7;
        }

        // Apply 3-day block pricing
        if (price3Days > 0 && remainingDays >= 3) {
            const blocks = Math.floor(remainingDays / 3);
            total += blocks * price3Days;
            remainingDays -= blocks * 3;
        }

        // Remaining days use per-day pricing
        total += remainingDays * perDay;

        // Add security deposit
        total += deposit;

        setTotalAmount(total.toFixed(2));
    }, [days, itemInfo]);


    const handlePayNow = async () => {
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

        try {
            const username = await AsyncStorage.getItem("username");
            if (!username) {
                Alert.alert("Login Required", "Please login first!");
                return;
            }

            const historyItem = {
                title,
                ...itemInfo,
                days,
                totalAmount: parseFloat(totalAmount),
                paymentMethod,
                upiId,
                netBankingDetails,
                date: new Date().toISOString(),
                status: "Completed",
            };


            await axios.post(`${URL}/history/${username}.json`, historyItem);

            Alert.alert('✅ Payment Successful', `You rented for ${days} day(s). Total: ₹${itemInfo.price}`);
            navigation.navigate("History");
        } catch (error) {
            console.error("Error saving history:", error);
            Alert.alert("Error", "Could not update history. Try again.");
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
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
                    {/* Section Title */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                        <Ionicons
                            name="document-text-outline"
                            size={22}
                            color="#000"
                            style={{ marginRight: 6, marginTop: 10 }}
                        />
                        <Text style={styles.sectionTitle}>BOOKING SUMMARY</Text>
                    </View>

                    {/* Item */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                        <Ionicons name="cube-outline" size={16} color="#333" style={{ marginRight: 6 }} />
                        <Text style={styles.summaryText}>ITEM: {title}</Text>
                    </View>

                    {/* Owner */}
                    {itemInfo.owner && (
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                            <Ionicons name="person-outline" size={16} color="#333" style={{ marginRight: 6 }} />
                            <Text style={styles.summaryText}>OWNER: {itemInfo.owner}</Text>
                        </View>
                    )}

                    {/* Rental Price */}
                    {itemInfo.price && (
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                            <FontAwesome name="money" size={16} color="#333" style={{ marginRight: 6 }} />
                            <Text style={styles.summaryText}>RENTAL PRICE (Per Day): {itemInfo.price}</Text>
                        </View>
                    )}

                    {/* ✅ Days Picker */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                        <MaterialCommunityIcons name="calendar-clock" size={18} color="#333" style={{ marginRight: 6 }} />
                        <Text style={[styles.summaryText, { marginRight: 10 }]}>DAYS:</Text>

                        <TouchableOpacity
                            onPress={() => setDays(Math.max(1, days - 1))}
                            style={{ backgroundColor: "#001F54", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginRight: 6 }}
                        >
                            <Text style={{ color: "#fff", fontSize: 18 }}>-</Text>
                        </TouchableOpacity>

                        <Text style={[styles.summaryText, { fontWeight: "bold", marginHorizontal: 6 }]}>{days}</Text>

                        <TouchableOpacity
                            onPress={() => setDays(days + 1)}
                            style={{ backgroundColor: "#001F54", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}
                        >
                            <Text style={{ color: "#fff", fontSize: 18 }}>+</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ✅ Total Amount */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                        <FontAwesome name="money" size={18} color="#001F54" style={{ marginRight: 6 }} />
                        <Text style={[styles.summaryText, { fontWeight: "bold", color: "#001F54" }]}>
                            TOTAL AMOUNT: {totalAmount} (incl. Security Deposit)
                        </Text>
                    </View>

                    {/* ✅ Chat Button */}
                    {itemInfo.owner && (
                        <TouchableOpacity
                            style={styles.chatButton}
                            onPress={() =>
                                navigation.navigate("Chat", {
                                    ownerUsername: itemInfo.owner,
                                })
                            }
                        >
                            <Entypo name="chat" size={18} color="#fff" style={{ marginRight: 6 }} />
                            <Text style={styles.chatButtonText}>Chat with {itemInfo.owner}</Text>
                        </TouchableOpacity>
                    )}
                </View>


                {/* Payment Method Selection */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                    <MaterialIcons
                        name="payment"
                        size={22}
                        color="#000"
                        style={{ marginRight: 6, marginTop: 14 }}
                    />
                    <Text style={styles.sectionTitle}>SELECT PAYMENT METHOD</Text>
                </View>

                {/* ✅ Credit / Debit Card Option */}
                <TouchableOpacity onPress={() => setPaymentMethod('card')} style={styles.radio}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <FontAwesome
                            name={paymentMethod === 'card' ? 'dot-circle-o' : 'circle-o'}
                            size={18}
                            color={paymentMethod === 'card' ? '#001F54' : '#666'}
                            style={{ marginRight: 6 }}
                        />
                        <Ionicons name="card-outline" size={18} color="#333" style={{ marginRight: 6 }} />
                        <Text style={{ fontWeight: paymentMethod === 'card' ? 'bold' : 'normal' }}>
                            CREDIT / DEBIT CARD
                        </Text>
                    </View>
                </TouchableOpacity>

                {paymentMethod === 'card' && (
                    <>
                        <TextInput
                            placeholder="Card Number"
                            style={styles.input}
                            keyboardType="numeric"
                            maxLength={16}
                            onChangeText={(text) => setCardDetails({ ...cardDetails, number: text })}
                            value={cardDetails.number}
                        />
                        <TextInput
                            placeholder="Expiry Date (MM/YY)"
                            style={styles.input}
                            onChangeText={(text) => setCardDetails({ ...cardDetails, expiry: text })}
                            value={cardDetails.expiry}
                        />
                        <TextInput
                            placeholder="CVV"
                            style={styles.input}
                            secureTextEntry
                            keyboardType="numeric"
                            maxLength={3}
                            onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })}
                            value={cardDetails.cvv}
                        />
                        <TextInput
                            placeholder="Name on Card"
                            style={styles.input}
                            onChangeText={(text) => setCardDetails({ ...cardDetails, name: text })}
                            value={cardDetails.name}
                        />
                    </>
                )}

                {/* ✅ UPI Option */}
                <TouchableOpacity onPress={() => setPaymentMethod('upi')} style={styles.radio}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <FontAwesome
                            name={paymentMethod === 'upi' ? 'dot-circle-o' : 'circle-o'}
                            size={18}
                            color={paymentMethod === 'upi' ? '#001F54' : '#666'}
                            style={{ marginRight: 6 }}
                        />
                        <MaterialCommunityIcons
                            name="currency-inr"
                            size={18}
                            color="#333"
                            style={{ marginRight: 6 }}
                        />
                        <Text style={{ fontWeight: paymentMethod === 'upi' ? 'bold' : 'normal' }}>
                            PAY VIA GOOGLE PAY / PHONEPE / PAYTM
                        </Text>
                    </View>
                </TouchableOpacity>

                {paymentMethod === 'upi' && (
                    <TextInput
                        placeholder="Enter UPI ID (e.g., krushna@upi)"
                        style={styles.input}
                        onChangeText={(text) => setUpiId(text)}
                        value={upiId}
                    />
                )}

                {/* ✅ Net Banking Option */}
                <TouchableOpacity onPress={() => setPaymentMethod('net')} style={styles.radio}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <FontAwesome
                            name={paymentMethod === 'net' ? 'dot-circle-o' : 'circle-o'}
                            size={18}
                            color={paymentMethod === 'net' ? '#001F54' : '#666'}
                            style={{ marginRight: 6 }}
                        />
                        <FontAwesome
                            name="bank"
                            size={18}
                            color="#333"
                            style={{ marginRight: 6 }}
                        />
                        <Text style={{ fontWeight: paymentMethod === 'net' ? 'bold' : 'normal' }}>
                            NET BANKING
                        </Text>
                    </View>
                </TouchableOpacity>

                {paymentMethod === 'net' && (
                    <>
                        <TextInput
                            placeholder="Account Holder Name"
                            style={styles.input}
                            onChangeText={(text) => setNetBankingDetails({ ...netBankingDetails, name: text })}
                            value={netBankingDetails?.name}
                        />
                        <TextInput
                            placeholder="Bank Name"
                            style={styles.input}
                            onChangeText={(text) => setNetBankingDetails({ ...netBankingDetails, bank: text })}
                            value={netBankingDetails?.bank}
                        />
                        <TextInput
                            placeholder="Account Number"
                            style={styles.input}
                            keyboardType="numeric"
                            onChangeText={(text) => setNetBankingDetails({ ...netBankingDetails, account: text })}
                            value={netBankingDetails?.account}
                        />
                        <TextInput
                            placeholder="IFSC Code"
                            style={styles.input}
                            onChangeText={(text) => setNetBankingDetails({ ...netBankingDetails, ifsc: text })}
                            value={netBankingDetails?.ifsc}
                        />
                    </>
                )}


                {/* ✅ Secure Note */}
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                    <Ionicons
                        name="lock-closed-outline"
                        size={22}
                        color="#000"
                        style={{ marginRight: 6, marginTop: 47 }}
                    />
                    <Text style={styles.note}>
                        All payments are 100% secure and encrypted. Your details are never stored.
                    </Text>
                </View>

                {/* ✅ Agreement Checkbox */}
                <TouchableOpacity
                    onPress={() => setAgreed(!agreed)}
                    style={styles.customCheckboxContainer}
                >
                    <FontAwesome
                        name={agreed ? 'check-square' : 'square-o'}
                        size={24}
                        color={agreed ? '#001F54' : '#000'}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={styles.checkboxText}>
                        I AGREE TO RENTEASY’S RENTAL POLICY AND WILL RETURN THE ITEM SAFELY.
                    </Text>
                </TouchableOpacity>

                {/* ✅ Pay Now Button */}
                <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <MaterialIcons
                            name="payments"
                            size={20}
                            color="#fff"
                            style={{ marginRight: 6 }}
                        />
                        <Text style={styles.payText}>PAY NOW</Text>
                    </View>
                </TouchableOpacity>


            </ScrollView>

            {/* Fixed Bottom Navigation */}
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
        width: 70,
        height: 70,
        resizeMode: 'contain',
        borderRadius: 35, // half of width/height
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
    chatButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#001F54",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 12,
    },
    chatButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#001F54",
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 18,
    },
    payText: {
        color: "#fff",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: 16,
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

