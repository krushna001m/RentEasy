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
    Modal
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNHTMLtoPDF from "react-native-html-to-pdf";
import FileViewer from "react-native-file-viewer";
import Share from 'react-native-share';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PDFView from "react-native-view-pdf"; // For PDF preview

const URL = "https://renteasy-bbce5-default-rtdb.firebaseio.com";

const History = ({ navigation }) => {
    const [history, setHistory] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [pdfPath, setPdfPath] = useState("");
    console.log("RNHTMLtoPDF:", RNHTMLtoPDF);
    console.log("FileViewer:", FileViewer);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const username = await AsyncStorage.getItem("username");
                if (!username) return;

                const response = await axios.get(`${URL}/history/${username}.json`);
                const data = response.data || {};
                setHistory(Object.values(data).reverse());
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, []);

    // ✅ Ask storage permission for Android
    const requestStoragePermission = async () => {
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "Storage Permission Required",
                    message: "RentEasy needs access to your storage to save receipts.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    // ✅ Generate Receipt (Download / Share)
    const generateReceipt = async (item, share = false) => {
        try {
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
                Alert.alert("Permission Denied", "Cannot save receipt without storage permission.");
                return;
            }

            const htmlContent = `
        <h1 style="text-align:center; color:#001F54;">RentEasy Receipt</h1>
        <p><b>Item:</b> ${item.title}</p>
        <p><b>Owner:</b> ${item.owner || "N/A"}</p>
        <p><b>Price:</b> ₹${item.price || "N/A"}</p>
        <p><b>Status:</b> ${item.status}</p>
        <p><b>Date:</b> ${new Date(item.date).toLocaleDateString()}</p>
        <hr/>
        <p style="text-align:center; font-size:12px;">Thank you for using RentEasy!</p>
      `;

            let options = {
                html: htmlContent,
                fileName: `RentEasy_Receipt_${item.title.replace(/\s/g, "_")}`,
                directory: Platform.OS === "android" ? "Downloads" : "Documents",
            };

            const file = await RNHTMLtoPDF.convert(options);

            if (share) {
                await Share.open({
                    url: `file://${file.filePath}`,
                    type: "application/pdf",
                    failOnCancel: false,
                });
            } else {
                Alert.alert("Receipt Generated ✅", `Saved to: ${file.filePath}`);
            }
        } catch (error) {
            console.error("PDF Error:", error);
            Alert.alert("Error", "Could not generate receipt.");
        }
    };

    // ✅ View Receipt using Native PDF Viewer
    const viewReceipt = async (item) => {
        try {
            const htmlContent = `
            <h1 style="text-align:center; color:#001F54;">Preview Receipt</h1>
            <p><b>Item:</b> ${item.title}</p>
            <p><b>Owner:</b> ${item.owner || "N/A"}</p>
        `;

            const file = await RNHTMLtoPDF.convert({
                html: htmlContent,
                fileName: `Preview_Receipt_${item.title.replace(/\s/g, "_")}`,
                directory: Platform.OS === "android" ? "Downloads" : "Documents",
            });

            await FileViewer.open(file.filePath, {
                showOpenWithDialog: true, // Android: lets user pick app (Google Drive, etc.)
                showAppsSuggestions: true,
            });
        } catch (error) {
            console.error("Preview Error:", error);
            Alert.alert("Error", "Could not open receipt.");
        }
    };
    return (
        <View style={styles.container}>
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

                <TouchableOpacity style={styles.historyTab}>
                    <Text style={styles.historyTabText}>HISTORY</Text>
                    <Ionicons name="document-text" size={20} color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>

                <Text style={styles.label}>YOUR RENTAL HISTORY</Text>

                {history.length === 0 ? (
                    <Text style={{ marginTop: 10, color: "#555" }}>No rental history yet.</Text>
                ) : (
                    history.map((item, index) => (
                        <View key={index} style={styles.summaryCard}>
                            <Text style={styles.summaryText}>📦 ITEM: {item.title}</Text>
                            {item.owner && <Text style={styles.summaryText}>👤 OWNER: {item.owner}</Text>}
                            {item.price && <Text style={styles.summaryText}>💸 PRICE: {item.price}</Text>}
                            {item.date && (
                                <Text style={styles.summaryText}>📅 DATE: {new Date(item.date).toLocaleDateString()}</Text>
                            )}
                            <Text style={styles.summaryText}>✅ STATUS: {item.status}</Text>

                            {/* ✅ Download Receipt */}
                            <TouchableOpacity
                                style={styles.downloadBtn}
                                onPress={() => generateReceipt(item)}
                            >
                                <Ionicons name="download" size={18} color="#fff" />
                                <Text style={styles.downloadBtnText}>Download</Text>
                            </TouchableOpacity>

                            {/* ✅ Share Receipt */}
                            <TouchableOpacity
                                style={[styles.downloadBtn, { backgroundColor: "#4CAF50", marginTop: 5 }]}
                                onPress={() => generateReceipt(item, true)}
                            >
                                <Ionicons name="share-social" size={18} color="#fff" />
                                <Text style={styles.downloadBtnText}>Share</Text>
                            </TouchableOpacity>
                            {/* ✅ PDF Preview */}
                            <TouchableOpacity
                                style={[styles.downloadBtn, { backgroundColor: "#FF9800", marginTop: 5 }]}
                                onPress={() => viewReceipt(item)}
                            >
                                <Ionicons name="eye" size={18} color="#fff" />
                                <Text style={styles.downloadBtnText}>View</Text>
                            </TouchableOpacity>

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

export default History;

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

    historyTab: {
        backgroundColor: '#001F54',
        alignSelf: 'center',
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    historyTabText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17
    },
    label: {
        fontWeight: 'bold',
        marginTop: 25,
        fontSize: 17,
        color: '#222',
        marginBottom: 4
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#001F54',
        textAlign: 'center',
        marginVertical: 15,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3, // Android shadow
        borderLeftWidth: 5,
        borderLeftColor: '#001F54', // Accent bar
    },
    summaryText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
        fontWeight: '500',
    },
    downloadBtn: {
        flexDirection: "row",
        backgroundColor: "#001F54",
        padding: 8,
        borderRadius: 6,
        marginTop: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    downloadBtnText: {
        color: "#fff",
        marginLeft: 6,
        fontSize: 13,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#fff',
        marginTop: 6
    },
    periodRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textBreak: {
        fontSize: 15,
        color: '#444',
        marginTop: 4,
        marginLeft: 10
    },
    status: {
        fontSize: 15,
        marginTop: 6,
        color: '#000',
        marginLeft: 10
    },
    downloadBtn: {
        marginTop: 30,
        backgroundColor: '#001F54',
        padding: 12,
        borderRadius: 30,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    downloadText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17
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
