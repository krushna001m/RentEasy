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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNHTMLtoPDF from "react-native-html-to-pdf";
import FileViewer from "react-native-file-viewer";
import Share from 'react-native-share';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PDFView from "react-native-view-pdf"; // For PDF preview
import RNFS from 'react-native-fs';

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

    const getLogoBase64 = async () => {
        try {
            if (Platform.OS === 'android') {
                const base64 = await RNFS.readFileAssets('logo.png', 'base64');
                return `data:image/png;base64,${base64}`;
            } else {
                const base64 = await RNFS.readFile(`${RNFS.MainBundlePath}/logo.png`, 'base64');
                return `data:image/png;base64,${base64}`;
            }
        } catch (error) {
            console.error('Logo Load Error:', error);
            return '';
        }
    };

    // ✅ Generate Receipt (Download / Share)
    const generateReceipt = async (item, share = false) => {
        const logoBase64 = await getLogoBase64();
        try {
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) {
                Alert.alert("Permission Denied", "Cannot save receipt without storage permission.");
                return;
            }

            const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 15px; border: 1px solid #ccc; border-radius: 8px; background: #f9f9f9;">
                
                <!-- Header with Logo -->
                 <div style="text-align: center; margin-bottom: 15px;">
      <img src="${logoBase64}" style="width:80px; height:auto; margin-bottom:5px;" />
      <h1 style="color:#001F54; font-size:20px; margin:5px 0;">RentEasy Receipt</h1>
    </div>

                <!-- Receipt Details -->
                <div style="background: #ffffff; padding: 10px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
                <p style="margin:5px 0;"><b>Item:</b> ${item.title}</p>
                <p style="margin:5px 0;"><b>Owner:</b> ${item.owner || "N/A"}</p>
                <p style="margin:5px 0;"><b>Price:</b> <span style="color:#009688; font-weight:bold;">₹${item.price || "N/A"}</span></p>
                <p style="margin:5px 0;"><b>Status:</b> ${item.status}</p>
                <p style="margin:5px 0;"><b>Date:</b> ${new Date(item.date).toLocaleDateString()}</p>
                </div>

                <hr style="margin:15px 0; border:none; border-top:1px solid #ccc;"/>

                <!-- Footer -->
                <p style="text-align:center; font-size:12px; color:#555;">
                ✅ Thank you for using <b>RentEasy</b>!<br/>
                <span style="color:#001F54;">www.renteasy.com</span>
                </p>
            </div>
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
  <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 15px; border: 1px solid #ccc; border-radius: 8px; background: #f9f9f9;">
    
    <!-- Header with Logo -->
    <div style="text-align: center; margin-bottom: 15px;">
      <img src="file:///android_asset/logo.png" alt="RentEasy Logo" style="width:80px; height:auto; margin-bottom:5px;" />
      <h1 style="color:#001F54; font-size:20px; margin:5px 0;">RentEasy Receipt</h1>
    </div>

    <!-- Receipt Details -->
    <div style="background: #ffffff; padding: 10px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
      <p style="margin:5px 0;"><b>Item:</b> ${item.title}</p>
      <p style="margin:5px 0;"><b>Owner:</b> ${item.owner || "N/A"}</p>
      <p style="margin:5px 0;"><b>Price:</b> <span style="color:#009688; font-weight:bold;">₹${item.price || "N/A"}</span></p>
      <p style="margin:5px 0;"><b>Status:</b> ${item.status}</p>
      <p style="margin:5px 0;"><b>Date:</b> ${new Date(item.date).toLocaleDateString()}</p>
    </div>

    <hr style="margin:15px 0; border:none; border-top:1px solid #ccc;"/>

    <!-- Footer -->
    <p style="text-align:center; font-size:12px; color:#555;">
      ✅ Thank you for using <b>RentEasy</b>!<br/>
      <span style="color:#001F54;">www.renteasy.com</span>
    </p>
  </div>
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
                <TouchableOpacity onPress={() => navigation.goBack()}>
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

                            {/* ✅ ITEM */}
                            <View style={styles.row}>
                                <Ionicons name="cube-outline" size={16} color="#333" style={styles.icon} />
                                <Text style={styles.summaryText}>ITEM: {item.title}</Text>
                            </View>

                            {/* ✅ OWNER */}
                            {item.owner && (
                                <View style={styles.row}>
                                    <Ionicons name="person-outline" size={16} color="#333" style={styles.icon} />
                                    <Text style={styles.summaryText}>OWNER: {item.owner}</Text>
                                </View>
                            )}

                            {/* ✅ PRICE */}
                            {item.price && (
                                <View style={styles.row}>
                                    <FontAwesome name="money" size={16} color="#333" style={styles.icon} />
                                    <Text style={styles.summaryText}>PRICE: {item.price}</Text>
                                </View>
                            )}

                            {/* ✅ DATE */}
                            {item.date && (
                                <View style={styles.row}>
                                    <Ionicons name="calendar-outline" size={16} color="#333" style={styles.icon} />
                                    <Text style={styles.summaryText}>
                                        DATE: {new Date(item.date).toLocaleDateString()}
                                    </Text>
                                </View>
                            )}

                            {/* ✅ STATUS */}
                            <View style={styles.row}>
                                <Ionicons
                                    name={item.status === "Completed" ? "checkmark-circle-outline" : "time-outline"}
                                    size={16}
                                    color={item.status === "Completed" ? "#4CAF50" : "#FF9800"}
                                    style={styles.icon}
                                />
                                <Text style={styles.summaryText}>STATUS: {item.status}</Text>
                            </View>

                            {/* ✅ Action Buttons */}
                            <View style={styles.btnRows}>

                                {/* Download Receipt */}
                                <TouchableOpacity
                                    style={[styles.downloadBtn, { backgroundColor: "#001F54" }]}
                                    onPress={() => generateReceipt(item)}
                                >
                                    <Ionicons name="download-outline" size={18} color="#fff" style={{ marginRight: 5 }} />
                                    <Text style={styles.downloadBtnText}>Download</Text>
                                </TouchableOpacity>

                                {/* Share Receipt */}
                                <TouchableOpacity
                                    style={[styles.downloadBtn, { backgroundColor: "#4CAF50" }]}
                                    onPress={() => generateReceipt(item, true)}
                                >
                                    <Ionicons name="share-social-outline" size={18} color="#fff" style={{ marginRight: 5 }} />
                                    <Text style={styles.downloadBtnText}>Share</Text>
                                </TouchableOpacity>

                                {/* View PDF */}
                                <TouchableOpacity
                                    style={[styles.downloadBtn, { backgroundColor: "#FF9800" }]}
                                    onPress={() => viewReceipt(item)}
                                >
                                    <Ionicons name="eye-outline" size={18} color="#fff" style={{ marginRight: 5 }} />
                                    <Text style={styles.downloadBtnText}>View</Text>
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
        marginLeft: 4,
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    icon: {
        marginRight: 8,
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
    btnRows: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
        flexWrap: 'wrap',
        gap: 10,
        alignItems: 'center',
        paddingHorizontal: 1,
        paddingVertical: 5,
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
