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
import { database } from '../firebaseConfig'
import { query, orderByChild, equalTo } from 'firebase/database';
import { ref, get, getDatabase } from 'firebase/database';
import AsyncStorage from "@react-native-async-storage/async-storage";
import RentEasyModal from '../components/RentEasyModal';

const URL = "https://renteasy-bbce5-default-rtdb.firebaseio.com";

const Payment = ({ navigation, route }) => {

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

    const { itemInfo, title, parentKey, itemKey } = route.params;
    const [price, setPrice] = useState(); // undefined

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

    const [days, setDays] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);

    const [chatRoomId, setChatRoomId] = useState(null);
    const ownerUid = itemInfo?.owner;  // could be undefined


    useEffect(() => {
        const loadChatIds = async () => {
            if (itemInfo?.owner) {
                const ownerUid = itemInfo.owner;
                const senderUid = await AsyncStorage.getItem('uid');
                if (ownerUid && senderUid) {
                    setChatRoomId([senderUid, ownerUid].sort().join('__'));
                }
            }
        };
        loadChatIds();
    }, [itemInfo]);

    const cleanNumber = (value) => {
  const num = parseFloat(String(value).replace(/[^0-9.]/g, "")); 
  return isNaN(num) ? 0 : num;
};

useEffect(() => {
    if (!itemInfo) return;

    const perDay = cleanNumber(itemInfo?.pricePerDay || itemInfo?.price);
    const price3Days = cleanNumber(itemInfo?.price3Days);
    const priceWeek = cleanNumber(itemInfo?.priceWeek);
    const deposit = cleanNumber(itemInfo?.securityDeposit);

    let total = 0;
    let remainingDays = Math.max(1, days);

    if (priceWeek > 0 && remainingDays >= 7) {
        const weeks = Math.floor(remainingDays / 7);
        total += weeks * priceWeek;
        remainingDays -= weeks * 7;
    }

    if (price3Days > 0 && remainingDays >= 3) {
        const blocks = Math.floor(remainingDays / 3);
        total += blocks * price3Days;
        remainingDays -= blocks * 3;
    }

    total += remainingDays * perDay;
    total += deposit;

    setTotalAmount(total.toFixed(2));
}, [days, itemInfo]);

    const handlePayNow = async () => {
        if (!agreed) {
            Alert.alert("Agreement Required", "Please agree to the rental policy before proceeding.");
            return;
        }

        try {
            // Get and sanitize username
            let username = await AsyncStorage.getItem("username");
            if (!username) throw new Error("User not logged in");
            username = username.replace(/[.#$[\]]/g, "_");

            // Prepare safe history object
            const historyItem = {
                itemTitle: itemInfo?.title || "Unknown Item",
                owner:itemInfo.owner||"Unknown Owner",
                price:itemInfo.pricePerDay,
                date: new Date().toISOString(),
                days: days || 0,
                totalAmount: totalAmount || "0",
                paymentMethod: paymentMethod || "N/A",
                status: "Completed",
            };

            console.log("📤 POST to:", `${URL}/history/${username}.json`);
            console.log("📦 Data:", JSON.stringify(historyItem));

            // Save history to Firebase
            await axios.post(`${URL}/history/${username}.json`, historyItem, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("✅ History saved successfully");

            // Update purchase count
            if (itemInfo?.parentKey && itemInfo?.itemKey) {
                const path = `${URL}/items/${itemInfo.parentKey.replace(/[.#$[\]]/g, "_")}/${itemInfo.itemKey.replace(/[.#$[\]]/g, "_")}/purchaseCount.json`;
                console.log("🔍 PUT path:", path);

                try {
                    const res = await axios.get(path);
                    console.log("📥 Current count response:", res.data);

                    const currentCount = typeof res.data === "number" ? res.data : 0;
                    const newCount = currentCount + 1;

                    console.log("📤 New count to PUT:", newCount);

                    await axios.put(path, newCount, {
                        headers: { "Content-Type": "application/json" }
                    });

                    console.log("✅ Purchase count updated successfully");
                } catch (putError) {
                    console.error("❌ PUT error:", putError.response?.data || putError.message);
                }
            } else {
                console.warn("⚠️ Skipping purchase count update: missing keys", itemInfo?.parentKey, itemInfo?.itemKey);
            }

            // Show success modal
            showModal("✅ Payment Successful", `You rented for ${days} day(s). Total: ₹${totalAmount}`);

            // Redirect after short delay
            setTimeout(() => {
                navigation.navigate("History");
            }, 1500);

        } catch (error) {
            console.error("❌ Payment error:", error.response?.data || error.message);
            Alert.alert("Error", error.response?.data?.error || "Something went wrong while processing payment.");
        }
    };


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../assets/logo.png')} style={styles.logo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ChatList")}>
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
                            TOTAL AMOUNT: ₹{totalAmount > 0 ? totalAmount : 'Calculating...\n'} (incl. Security Deposit)
                        </Text>

                    </View>

                    {itemInfo?.owner && (
                        <TouchableOpacity
                            style={styles.chatButton}
                            onPress={async () => {
                                try {
                                    const db = getDatabase();
                                    const ownerUid = itemInfo.owner; // Already UID

                                    // 1. Fetch owner details
                                    const ownerSnap = await get(ref(db, `users/${ownerUid}`));
                                    if (!ownerSnap.exists()) {
                                        Alert.alert('Error', 'Owner information not found.');
                                        return;
                                    }
                                    const ownerData = ownerSnap.val();

                                    // 2. Get current logged-in user details
                                    const senderUid = await AsyncStorage.getItem('uid'); // store uid in AsyncStorage at login
                                    const senderUsername = await AsyncStorage.getItem('username');

                                    if (!senderUid || !senderUsername) {
                                        Alert.alert('Error', 'Unable to fetch your account info.');
                                        return;
                                    }

                                    // 3. Navigate to Chat screen
                                    navigation.navigate('Chat', {
                                        receiverUid: ownerUid,
                                        receiverUsername: ownerData.username,
                                        senderUid: senderUid,
                                        senderUsername: senderUsername,
                                    });

                                } catch (error) {
                                    console.error('Chat Button Error:', error);
                                    Alert.alert('Error', 'Failed to start chat.');
                                }
                            }}
                        >
                            <Entypo name="chat" size={18} color="#fff" style={{ marginRight: 6 }} />
                            <Text style={styles.chatButtonText}>Chat with Owner</Text>
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

