import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
    Alert,
    PermissionsAndroid,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNHTMLtoPDF from "react-native-html-to-pdf";
import FileViewer from "react-native-file-viewer";
import Share from 'react-native-share';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Loader from '../components/Loader';
import RentEasyModal from '../components/RentEasyModal';

const URL = "https://renteasy-bbce5-default-rtdb.firebaseio.com";

const History = ({ navigation }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const route = useRoute();
    const activeColor = '#007AFF'; // iOS blue
    const inactiveColor = '#444';  // gray


    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);

                // Get and sanitize username
                let username = await AsyncStorage.getItem("username");
                if (!username) return;
                username = username.replace(/[.#$[\]]/g, "_");

                // Fetch user's history
                const response = await axios.get(`${URL}/history/${username}.json`);
                const data = response.data || {};

                // Convert object to array and sort by date (newest first)
                const historyArray = Object.entries(data)
                    .map(([key, value]) => ({
                        key, // Firebase push ID
                        ...value,
                    }))
                    .sort((a, b) => new Date(b.date) - new Date(a.date));

                setHistory(historyArray);
            } catch (error) {
                console.error("❌ Error fetching history:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const sanitizeUsername = (username) => username.replace(/[.#$[\]]/g, "_");

    const requestStoragePermission = async () => {
        if (Platform.OS === "android" && Platform.Version < 30) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "Storage Permission Required",
                    message: "RentEasy needs access to your storage to save receipts.",
                    buttonPositive: "OK",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true; // Android 11+ or iOS
    };

    const getSaveDirectory = () => {
        if (Platform.OS === "android") {
            return RNFS.DownloadDirectoryPath; // Works for Android 10 and below
        } else {
            return RNFS.DocumentDirectoryPath; // iOS safe path
        }
    };


    const getLogoBase64 = async () => {
        try {
            if (Platform.OS === "android") {
                const base64 = await RNFS.readFileAssets("logo.png", "base64");
                return `data:image/png;base64,${base64}`;
            } else {
                const base64 = await RNFS.readFile(`${RNFS.MainBundlePath}/logo.png`, "base64");
                return `data:image/png;base64,${base64}`;
            }
        } catch {
            return ""; // Skip logo if missing
        }
    };


    const generateReceipt = async (item, share = false) => {
        try {
            setLoading(true);
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
                showModal("Permission Denied", "Cannot save receipt without storage permission.");
                return;
            }

            const logoBase64 = await getLogoBase64();

            // Ensure correct property names with fallback
        const title = item.title || item.itemTitle || "Untitled";
        const owner = item.owner || "N/A";
        const price = item.price || item.totalAmount || "N/A";
        const status = item.status || "N/A";
        const date = item.date ? new Date(item.date).toLocaleDateString() : "N/A";

            const htmlContent = `
  <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
  ">
    <h1 style="
        text-align: center;
        color: #2c3e50;
        margin-bottom: 30px;
        border-bottom: 3px solid #4CAF50;
        padding-bottom: 10px;
    ">
      🧾 RentEasy Receipt
    </h1>

    <div style="margin-bottom: 20px;">
      <h2 style="color: #4CAF50; font-size: 20px; margin-bottom: 10px;">📦 Item Details</h2>
      <p style="font-size: 18px;"><strong>Title:</strong> ${title}</p>
      <p style="font-size: 18px;"><strong>Owner:</strong> ${owner}</p>
      <p style="font-size: 18px;"><strong>Price:</strong> ₹${price}</p>
      <p style="font-size: 18px;"><strong>Status:</strong> ${status}</p>
      <p style="font-size: 18px;"><strong>Date:</strong> ${date}</p>
    </div>

    <div style="
        height: 1px;
        background-color: #ccc;
        margin: 20px 0;
    "></div>

    <div style="text-align: center;">
      <p style="font-size: 16px; color: #666;">For any queries, contact us at <strong>support@renteasy.com</strong></p>
      <p style="font-size: 16px; color: #666;">Thank you for using <strong style="color: #4CAF50;">RentEasy</strong>!</p>
    </div>
  </div>
`;


            const file = await RNHTMLtoPDF.convert({
                html: htmlContent,
                fileName: `RentEasy_Receipt_${item.itemTitle.replace(/\s/g, "_")}`,
                directory: getSaveDirectory(),
            });

            const filePath = Platform.OS === "android" ? `file://${file.filePath}` : file.filePath;

            if (share) {
                await Share.open({
                    url: filePath,
                    type: "application/pdf",
                });
            } else {
                showModal("Receipt Generated ✅", `Saved to: ${filePath}`);
            }
        } catch (error) {
            console.error("PDF Error:", error);
            showModal("Error", "Could not generate receipt.");
        } finally {
            setLoading(false);
        }
    };


    const viewReceipt = async (item) => {
        try {
            setLoading(true);
            const logoBase64 = await getLogoBase64();

            // Ensure correct property names with fallback
        const title = item.title || item.itemTitle || "Untitled";
        const owner = item.owner || "N/A";
        const price = item.price || item.totalAmount || "N/A";
        const status = item.status || "N/A";
        const date = item.date ? new Date(item.date).toLocaleDateString() : "N/A";

            const htmlContent = `
  <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
  ">
    <h1 style="
        text-align: center;
        color: #2c3e50;
        margin-bottom: 30px;
        border-bottom: 3px solid #4CAF50;
        padding-bottom: 10px;
    ">
      🧾 RentEasy Receipt
    </h1>

    <div style="margin-bottom: 20px;">
      <h2 style="color: #4CAF50; font-size: 20px; margin-bottom: 10px;">📦 Item Details</h2>
      <p style="font-size: 18px;"><strong>Title:</strong> ${title}</p>
      <p style="font-size: 18px;"><strong>Owner:</strong> ${owner}</p>
      <p style="font-size: 18px;"><strong>Price:</strong> ₹${price}</p>
      <p style="font-size: 18px;"><strong>Status:</strong> ${status}</p>
      <p style="font-size: 18px;"><strong>Date:</strong> ${date}</p>
    </div>

    <div style="
        height: 1px;
        background-color: #ccc;
        margin: 20px 0;
    "></div>

    <div style="text-align: center;">
      <p style="font-size: 16px; color: #666;">For any queries, contact us at <strong>support@renteasy.com</strong></p>
      <p style="font-size: 16px; color: #666;">Thank you for using <strong style="color: #4CAF50;">RentEasy</strong>!</p>
    </div>
  </div>
`;


            const file = await RNHTMLtoPDF.convert({
                html: htmlContent,
                fileName: `Preview_Receipt_${item.title.replace(/\s/g, "_")}`,
                directory: getSaveDirectory(),
            });

            const filePath = Platform.OS === "android" ? `file://${file.filePath}` : file.filePath;
            await FileViewer.open(filePath);
        } catch (error) {
            console.error("Preview Error:", error);
            showModal("Error", "Could not open receipt.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirmed = async () => {
        try {
            if (!pendingDeleteKey) return;

            // Get and sanitize username
            let username = await AsyncStorage.getItem("username");
            if (!username) throw new Error("User not logged in");
            username = sanitizeUsername(username);

            // 1. Delete from Firebase
            await axios.delete(`${URL}/history/${username}/${pendingDeleteKey}.json`);

            // 2. Remove from local state
            setHistory((prev) => prev.filter((entry) => entry.key !== pendingDeleteKey));

            // 3. Reset pending delete and close modal
            setPendingDeleteKey(null);
            setModalVisible(false);

            // 4. Show confirmation
            showModal("Removed ✅", "History item deleted successfully.");
        } catch (error) {
            console.error("Delete Error:", error.response?.data || error.message);
            showModal("Error", "Failed to delete the item from history.");
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../assets/logo.png')} style={styles.logo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ChatList")}>
                    <Entypo name="chat" size={36} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>WELCOME TO RENTEASY</Text>
                <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>

                <Text style={styles.label}>YOUR RENTAL HISTORY</Text>

                {history.length === 0 ? (
                    <Text style={{ marginTop: 10, color: "#555" }}>No rental history yet.</Text>
                ) : (
                    history.map((item, index) => (
                        <View key={item.key} style={styles.summaryCard}>
                            <View style={styles.row}><Ionicons name="cube-outline" size={16} color="#333" /><Text style={styles.summaryText}>ITEM: {item.title}</Text></View>
                            {item.owner && <View style={styles.row}><Ionicons name="person-outline" size={16} color="#333" /><Text style={styles.summaryText}>OWNER: {item.owner}</Text></View>}
                            {item.price && <View style={styles.row}><FontAwesome name="money" size={16} color="#333" /><Text style={styles.summaryText}>PRICE: ₹{item.price}</Text></View>}
                            {item.date && <View style={styles.row}><Ionicons name="calendar-outline" size={16} color="#333" /><Text style={styles.summaryText}>DATE: {new Date(item.date).toLocaleDateString()}</Text></View>}
                            <View style={styles.row}><Ionicons name={item.status === "Completed" ? "checkmark-circle-outline" : "time-outline"} size={16} color={item.status === "Completed" ? "#4CAF50" : "#FF9800"} /><Text style={styles.summaryText}>STATUS: {item.status}</Text></View>

                            <View style={styles.btnRows}>
                                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#001F54" }]} onPress={() => generateReceipt(item)}>
                                    <Ionicons name="download-outline" size={18} color="#fff" />
                                    <Text style={styles.actionBtnText}>Download</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#4CAF50" }]} onPress={() => generateReceipt(item, true)}>
                                    <Ionicons name="share-social-outline" size={18} color="#fff" />
                                    <Text style={styles.actionBtnText}>Share</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#FF9800" }]} onPress={() => viewReceipt(item)}>
                                    <Ionicons name="eye-outline" size={18} color="#fff" />
                                    <Text style={styles.actionBtnText}>View</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#E53935" }]} onPress={() => confirmDelete(item.key)}
                                >
                                    <Ionicons name="trash-outline" size={18} color="#fff" />
                                    <Text style={styles.actionBtnText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
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
                    <Ionicons name="document-text" size={28} color={route.name === "History" ? activeColor : inactiveColor} />
                    <Text style={[styles.navLabel, { color: route.name === "History" ? activeColor : inactiveColor }]}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
                    <Ionicons name="person" size={28} />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>

            <Loader visible={loading} />
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

export default History;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F0FA',
        paddingTop: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    logo: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
        borderRadius: 35,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        color: '#1E1E1E',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#3a3a3a',
        fontStyle: 'italic',
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#001F54',
        textAlign: 'center',
        marginVertical: 15,
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderLeftWidth: 5,
        borderLeftColor: '#001F54',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 6,
    },
    summaryText: {
        fontSize: 14,
        color: '#333',
    },
    btnRows: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 10,
    },
    actionBtn: {
        flexDirection: "row",
        padding: 8,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        minWidth: '47%',
    },
    actionBtnText: {
        color: "#fff",
        marginLeft: 6,
        fontSize: 13,
        fontWeight: "bold",
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
