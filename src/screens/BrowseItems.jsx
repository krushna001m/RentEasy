import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TextInput
} from 'react-native';

import ProductCard from '../components/ProductCard';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const BrowseItems = ({navigation}) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Image source={require('../../assets/logo.png')} style={styles.logo} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Entypo name="chat" size={36} />
                </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>WELCOME TO RENTEASY</Text>
                <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <FontAwesome name="search" size={20} style={{ marginHorizontal: 10 }} />
                    <TextInput placeholder="Search Items" style={styles.input} />
                    <TouchableOpacity>
                        <FontAwesome name="filter" size={25} style={{ marginHorizontal: 10 }} />
                    </TouchableOpacity>
                </View>

                {/* Browse Title */}
                <View>
                    <TouchableOpacity style={{flexDirection:'row'}}>
                    <MaterialIcons name="explore" size={28} style={{marginTop:10}} />
                    <Text style={{marginTop:15,marginLeft:5,fontWeight:'500',fontSize:13,color: '#333'}}>Explore</Text>
                    </TouchableOpacity>
                </View>
                {/* Product Cards */}
                <TouchableOpacity>
                    <ProductCard
                        image={require('../../assets/camera.png')}
                        title="📸 NIKON D850 DSLR (BODY ONLY)"
                        info={{
                            features: [
                                "     🔍 45.7MP FULL-FRAME | 🎥 4K UHD VIDEO",
                                "     📷 PRO-LEVEL PERFORMANCE"
                            ],
                            included: [
                                "     🔋 Battery & Charger | 💾 64GB MEMORY CARD",
                                "     🎒 Carry Case"
                            ],
                            price: "      📅 ₹500/day | ₹1300/3 days | ₹2800/week",
                            deposit: "      ₹5000 (REFUNDABLE)",
                            location: "      PUNE, MAHARASHTRA",
                            rating: "       4.9/5 (100 REVIEWS)",
                            availability: "     ON REQUEST"
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity>
                    <ProductCard
                        image={require('../../assets/house.png')}
                        title="🏠 2BHK HOUSE FOR RENT (INDEPENDENT VILLA STYLE)"
                        info={{
                            features: [
                                " 🌳 Calm Green Surroundings | 🏗️ Spacious Design"
                            ],
                            included: [
                                "     🛏️ 2 Bedrooms | 🛋️ Hall | 🍳 Kitchen",
                                "     🚿 2 Bathrooms | 🚗 Parking"
                            ],
                            price: "       ₹8,000/month",
                            deposit: "      ₹25,000 (REFUNDABLE)",
                            location: "      NASHIK, MAHARASHTRA",
                            rating: "      4.8/5",
                            availability: "      IMMEDIATE"
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <ProductCard
                        image={require('../../assets/car.png')}
                        title="🚗 TOYOTA INNOVA CRYSTA (7-SEATER) FOR RENT"
                        info={{
                            features: [
                                " 🛣️ Comfortable for Long Drives | ❄️ Dual A/C |              🎵 Music System"
                            ],
                            included: [
                                "     💺 7-Seater | 🧳 Ample Luggage Space | 🛡️ Driver Airbags"
                            ],
                            price: "       ₹500/day | ₹1400/3 days | ₹3000/week",
                            deposit: "      ₹10,000 (REFUNDABLE)",
                            location: "      SINNAR, MAHARASHTRA",
                            rating: "       4.7/5",
                            availability: "     ON REQUEST"
                        }}
                    />
                </TouchableOpacity>

            </ScrollView>
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="home" size={28} />
                    <Text style={styles.navLabel}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <MaterialIcons name="explore" size={28} />
                    <Text style={styles.navLabel}>Explore</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Entypo name="plus" size={28} />
                    <Text style={styles.navLabel}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="document-text" size={28} />
                    <Text style={styles.navLabel}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
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
    },
    title: {
        fontSize: 28,
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
        fontSize: 18,
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
        padding: 10,
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
    },
    browseTitle: {
        fontSize: 18,
        fontWeight: '400',
        marginTop: 15

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
        marginTop: 10
    },

    navLabel: {
        fontSize: 12,
        color: 'black',
        fontWeight: '400',
        marginTop: 4,
        marginBottom: 10,
    },
});
