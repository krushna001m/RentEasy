import React, { useEffect, useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Platform
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import ProductCard from '../components/ProductCard';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { categories } from '../constants/categories';
import SearchWithFilter from '../components/SearchWithFilter';
import Loader from '../components/Loader';
import RentEasyModal from '../components/RentEasyModal';

const BrowseItems = ({ navigation }) => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const isFocused = useIsFocused();
    const URL = "https://renteasy-bbce5-default-rtdb.firebaseio.com";

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
        const fetchItems = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${URL}/items.json`);
                if (response.data) {
                    const formatted = Object.entries(response.data).flatMap(([parentId, nestedItems]) =>
                        Object.entries(nestedItems).map(([childId, item]) => ({
                            id: `${parentId}_${childId}`,
                            ...item
                        }))
                    );
                    setItems(formatted);
                    setFilteredItems(formatted);
                } else {
                    setItems([]);
                    setFilteredItems([]);
                }
            } catch (error) {
                console.error("Error fetching items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [isFocused]);

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

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>WELCOME TO RENTEASY</Text>
                <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>

                {/* 🔍 Search & Filter */}
                <SearchWithFilter
                    allItems={items}
                    setFilteredItems={setFilteredItems}
                />

                {/* Browse Title */}
                <View>
                    <TouchableOpacity style={{ flexDirection: 'row' }}>
                        <MaterialIcons name="explore" size={28} color='#001F54' style={{ marginTop: 10 }} />
                        <Text style={{ marginTop: 13, marginLeft: 6, fontWeight: '600', fontSize: 15, color: '#333' }}>Explore</Text>
                    </TouchableOpacity>
                </View>



                {/* 🔁 Filtered Dynamic Items */}
                {filteredItems.map(item => (
                    <ProductCard
                        key={item.id}
                        image={
                            item.images && item.images.length > 0
                                ? item.images
                                : [require('../../assets/item_placeholder.png')]
                        }
                        title={` ${item.title}`}
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
                            owner: `${item.ownerName || 'N/A'}`,
                            availability: item.availability?.request
                                ? "Available on Request"
                                : item.availability?.booking
                                    ? "Available for Booking"
                                    : "Not Available"
                        }}
                        itemKey={item.id.split("_")[1]}        // <- Extract actual item key from id
                        parentKey={item.id.split("_")[0]}      // <- Extract parentKey from id
                        navigation={navigation}
                    />

                ))}
            </ScrollView>

            {/* Footer Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="home" size={28} />
                    <Text style={styles.navLabel}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("BrowseItems")}>
                    <MaterialIcons name="explore" size={28} color={route.name === "BrowseItems" ? activeColor : inactiveColor} />
                    <Text style={[styles.navLabel, { color: route.name === "BrowseItems" ? activeColor : inactiveColor }]}>Explore</Text>
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

export default BrowseItems;

// 🔧 styles unchanged

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
        borderRadius: 35,
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
