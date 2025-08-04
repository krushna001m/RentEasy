import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Platform, Modal } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import ProductCard from '../components/ProductCard';
import { categories } from '../constants/categories';
import SearchWithFilter from '../components/SearchWithFilter';
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { database } from '../firebaseConfig';
import { getDatabase, ref, get } from "firebase/database";
import Loader from '../components/Loader';
import RentEasyModal from '../components/RentEasyModal';


const Home = ({ navigation }) => {
    const [allItems, setAllItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [trendingItems, setTrendingItems] = useState([]);
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

    useEffect(() => {
        const fetchTrendingItems = async () => {
            try {
                setLoading(true);
                const snapshot = await get(ref(database, "items"));

                if (snapshot.exists()) {
                    const data = snapshot.val();

                    // Flatten nested data
                    const allItems = Object.entries(data).flatMap(([ownerId, ownerItems]) =>
                        Object.entries(ownerItems).map(([itemKey, item]) => ({
                            ...item,
                            ownerId,
                            itemKey,
                            purchaseCount: item.purchaseCount || 0,
                        }))
                    );

                    // Sort by purchaseCount
                    const sortedItems = allItems.sort((a, b) => b.purchaseCount - a.purchaseCount);

                    // Get top 3
                    const topTrending = sortedItems.slice(0, 3);

                    setTrendingItems(topTrending); // <-- set this to a state variable
                }
            } catch (error) {
                console.error("Error fetching trending items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingItems();
    }, []);

    return (
        <View style={styles.container}>
            {/*  Fixed Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}><Image source={require('../../assets/logo.png')} style={styles.logo} /></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Chat")}><Entypo name="chat" size={36} /></TouchableOpacity>
            </View>

            {/*  Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>WELCOME TO RENTEASY</Text>
                <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>



                {/* Search */}
                <SearchWithFilter
                    allItems={allItems} // Pass your fetched items array here
                    setFilteredItems={setFilteredItems} // Pass the state updater for displayed items
                />

                <View style={{ marginHorizontal: 10, flexDirection: 'row' }}>
                    <MaterialIcons name="trending-up" size={25} color="#001F54" style={{ marginTop: 10 }} />
                    <Text style={{ fontSize: 15, color: '#333', fontWeight: '600', marginTop: 10, marginLeft: 10 }}>Trending</Text>
                </View>



                {/* Info Section */}
                {trendingItems.length > 0 && (
                    <View style={{ marginTop: 1 }}>

                        {trendingItems.map((item, index) => (
                            <ProductCard
                                key={item.itemKey}
                                image={
                                    item.images?.length > 0
                                        ? item.images
                                        : [require('../../assets/item_placeholder.png')]
                                }
                                title={`🔥 Trending #${index + 1} : ${item.title}`}
                                info={{
                                    features: [item.description || "No description provided"],
                                    categories: Array.isArray(item.categories)
                                        ? item.categories
                                        : item.categories
                                            ? [item.categories]
                                            : ["others"],
                                    included: item.included ? [item.included] : [],
                                    price: `₹${item.pricePerDay}/day`,
                                    deposit: `₹${item.securityDeposit || '0'} (REFUNDABLE)`,
                                    location: `${item.location || "Not specified"}`,
                                    owner: `${item.owner || 'N/A'}`,
                                    availability: item.availability?.request
                                        ? "Available on Request"
                                        : item.availability?.booking
                                            ? "Available for Booking"
                                            : "Not Available",
                                }}
                                navigation={navigation}
                            />
                        ))}
                    </View>
                )}

                {/* Button */}
                <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("BrowseItems")} >
                    <Text style={styles.browseText}>BROWSE ITEM’S</Text>
                    <Ionicons name="search" size={24} color="#fff" style={{ marginLeft: 6 }} />
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

export default Home;

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
        marginTop: 0,
        backgroundColor: 'transparent',
        zIndex: 100,

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
        paddingBottom: 120, // space for bottom nav
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#eee',
        borderRadius: 10,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        borderColor: 'black',
        borderWidth: 0.5,
    },
    input: {
        flex: 1,
        marginHorizontal: 10,
        fontSize: 16,
        height: 40
    },

    productImage: {
        width: 380,
        height: 250,
        resizeMode: 'contain',
        marginTop: 20
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
        alignSelf: 'center',
        marginBottom: 20,
    },
    ratingText: {
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 15,
    },
    infoBox: {
        backgroundColor: '#eee',
        padding: 16,
        borderRadius: 20,
        marginTop: 10,
        borderColor: 'black',
        borderWidth: 0.4
    },
    infoTitle: {
        fontWeight: 'bold',
        fontSize: 19,
        marginBottom: 15,
        color: '#000',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    infoHeader: {
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333',
    },
    content: {
        fontSize: 14,
        fontWeight: '400'
    },
    bookNow: {
        flexDirection: 'row',
        backgroundColor: '#000',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
    },
    bookNowText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
    },
    browseButton: {
        flexDirection: 'row',
        backgroundColor: '#001F54',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    browseText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
        marginRight: 6,
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

