import React, { useEffect, useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TextInput,
    Platform
} from 'react-native';
import ProductCard from '../components/ProductCard';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { categories } from '../constants/categories';
import SearchWithFilter from '../components/SearchWithFilter';

const BrowseItems = ({ navigation }) => {
    const [allItems, setAllItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        // ✅ fetch items from Firebase
        const fetchItems = async () => {
            const res = await axios.get(`${URL}/items.json`);
            const itemsArray = Object.values(res.data || {});
            setAllItems(itemsArray);
            setFilteredItems(itemsArray);
        };
        fetchItems();
    }, []);

    const [items, setItems] = useState([]);
    const isFocused = useIsFocused();

    const URL = "https://renteasy-bbce5-default-rtdb.firebaseio.com";


    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(
                    `${URL}/items.json` // ✅ Replace with your DB URL
                );

                if (response.data) {
                    const formatted = Object.keys(response.data).map(key => ({
                        id: key,
                        ...response.data[key],
                    }));
                    setItems(formatted);
                } else {
                    setItems([]);
                }
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, []);

    const getCategoryLabel = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.label : "Unknown";
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

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>WELCOME TO RENTEASY</Text>
                <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>

                {/* Search */}
                <SearchWithFilter
                    allItems={allItems} // Pass your fetched items array here
                    setFilteredItems={setFilteredItems} // Pass the state updater for displayed items
                />

                {/* Browse Title */}
                <View>
                    <TouchableOpacity style={{ flexDirection: 'row' }}>
                        <MaterialIcons name="explore" size={28} color='#007bff' style={{ marginTop: 10 }} />
                        <Text style={{ marginTop: 13, marginLeft: 6, fontWeight: '600', fontSize: 15, color: '#333' }}>Explore</Text>
                    </TouchableOpacity>
                </View>

                {/* Static Items */}
                <ProductCard
                    image={require('../../assets/camera.png')}
                    title="📸 NIKON D850 DSLR (BODY ONLY)"

                    info={{
                        features: [
                            "🔍 45.7MP FULL-FRAME | 🎥 4K UHD VIDEO",
                            "📷 PRO-LEVEL PERFORMANCE"
                        ],
                        categories: ["electronics"],
                        included: [
                            "🔋 Battery & Charger | 💾 64GB MEMORY CARD",
                            "🎒 Carry Case"
                        ],
                        price: "₹500/day | ₹1300/3 days | ₹2800/week",
                        deposit: "₹5000 (REFUNDABLE)",
                        owner: "KRUSHNA MENGAL",
                        location: "PUNE, MAHARASHTRA",
                        rating: "4.9/5 (100 REVIEWS)",
                        availability: "ON REQUEST"
                    }}
                    navigation={navigation}
                />

                <ProductCard
                    image={require('../../assets/house.png')}
                    title="🏠2BHK HOUSE FOR RENT (INDEPENDENT VILLA STYLE)"
                    info={{
                        features: [
                            "🌳 Calm Green Surroundings | 🏗️ Spacious Design"
                        ],
                        categories: ["furniture"],
                        included: [
                            "🛏️ 2 Bedrooms | 🛋️ Hall | 🍳 Kitchen",
                            "🚿 2 Bathrooms | 🚗 Parking"
                        ],
                        price: "₹8,000/month",
                        deposit: "₹25,000 (REFUNDABLE)",
                        owner: "KRUSHNA MENGAL",
                        location: "NASHIK, MAHARASHTRA",
                        rating: "4.8/5",
                        availability: "IMMEDIATE"
                    }}
                    navigation={navigation}
                />
                <ProductCard
                    image={require('../../assets/car.png')}
                    title="🚗 TOYOTA INNOVA CRYSTA (7-SEATER) FOR RENT"
                    info={{
                        features: [
                            " 🛣️ Comfortable for Long Drives |❄️Dual A/C               🎵 Music System"
                        ],
                        categories: ["vehicles"],
                        included: [
                            "💺 7-Seater | 🧳 Ample Luggage Space | 🛡️ Driver Airbags"
                        ],
                        price: "₹500/day | ₹1400/3 days | ₹3000/week",
                        deposit: "₹10,000 (REFUNDABLE)",
                        owner: "KRUSHNA MENGAL",
                        location: "SINNAR, MAHARASHTRA",
                        rating: "4.7/5",
                        availability: "ON REQUEST"
                    }}
                    navigation={navigation}
                />

                {/* ✅ Dynamically Fetched Items */}
                {items.map(item => (
                    <ProductCard
                        key={item.id}
                        image={item.imageUri ? { uri: item.imageUri } : require('../../assets/item_placeholder.png')}
                        title={` ${item.title}`}
                        info={{
                            features: [item.description || "No description provided"],
                            categories: Array.isArray(item.categories)
                                ? item.categories
                                : item.categories
                                    ? [item.categories]
                                    : ["others"], // ✅ fallback always an array
                            included: item.included ? [item.included] : [],
                            price: `₹${item.pricePerDay}/day`,
                            deposit: `₹${item.securityDeposit || '0'} (REFUNDABLE)`,
                            location: `📍 ${item.location || "Not specified"}`,
                            owner: `👤 ${item.ownerName || 'N/A'}`,
                            availability: item.availability?.request
                                ? "Available on Request"
                                : item.availability?.booking
                                    ? "Available for Booking"
                                    : "Not Available"
                        }}
                        navigation={navigation}
                    />
                ))}
            </ScrollView>

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

export default BrowseItems;

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
