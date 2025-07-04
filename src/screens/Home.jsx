import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const Home = ({navigation}) => {
    return (
        <View style={styles.container}>
            {/*  Fixed Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}><Image source={require('../../assets/logo.png')} style={styles.logo} /></TouchableOpacity>
                <TouchableOpacity><Entypo name="chat" size={36} /></TouchableOpacity>
            </View>

            {/*  Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>WELCOME TO RENTEASY</Text>
                <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>



                {/* Search */}
                <View style={styles.searchBar}>
                    <FontAwesome name="search" size={20} style={{ marginHorizontal: 10 }} />
                    <TextInput placeholder="Search Items" style={styles.input} />
                    <TouchableOpacity><FontAwesome name="filter" size={25} style={{ marginHorizontal: 10 }} /></TouchableOpacity>
                </View>

                <View style={{ marginHorizontal: 10 , flexDirection:'row'}}>
                    <FontAwesome6 name="arrow-trend-up" size={25} color="#007bff" style={{marginTop:10}} />
                    <Text style={{ fontSize: 13, color: '#333', marginTop: 2 , fontWeight:'500',marginTop:13,marginLeft:10}}>Trending</Text>
                </View>

                {/* Product Card */}
                <TouchableOpacity>
                    <View style={styles.productContainer}>
                        <TouchableOpacity>
                        <Image source={require('../../assets/camera.png')} style={styles.productImage} />
                        </TouchableOpacity>
                        <View style={styles.rating}>
                            <Entypo name="star" size={30} color="orange" />
                            <Entypo name="star" size={27} color="orange" />
                            <Entypo name="star" size={24} color="orange" />
                            <Entypo name="star" size={21} color="orange" />
                            <Entypo name="star-outlined" size={18} color="orange" />
                            <Text style={styles.ratingText}>RATING</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Info Section */}
                <TouchableOpacity>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>📸 NIKON D850 DSLR (BODY ONLY)</Text>
                        <Text style={styles.content}>      🔍 45.7MP FULL-FRAME | 🎥 4K UHD VIDEO |</Text>
                        <Text style={styles.content}>      📷 PRO-LEVEL PERFORMANCE</Text>

                        <Text style={styles.infoHeader}>📦 WHAT'S INCLUDED:</Text>
                        <Text style={styles.content}>      🔋 BATTERY & CHARGER | 💾 64GB MEMORY CARD </Text>
                        <Text style={styles.content}>      🎒 CARRY CASE</Text>

                        <Text style={styles.infoHeader}>💰 RENTAL PRICE:</Text>
                        <Text style={styles.content}>      📅 ₹500/DAY | ₹1300/3 DAYS | ₹2800/WEEK</Text>

                        <Text style={styles.infoHeader}>🔐 SECURITY DEPOSIT:</Text>
                        <Text style={styles.content}>      ₹5000 (REFUNDABLE)</Text>

                        <Text style={styles.infoHeader}>📍 LOCATION:</Text>
                        <Text style={styles.content}>      PUNE, MAHARASHTRA</Text>

                        <Text style={styles.infoHeader}>⭐ RATING:</Text>
                        <Text style={styles.content}>      4.9/5 (100 REVIEWS)</Text>

                        <Text style={styles.infoHeader}>📅 AVAILABILITY:</Text>
                        <Text style={styles.content}>      ON REQUEST</Text>
                    </View>
                </TouchableOpacity>

                {/* Buttons */}
                <TouchableOpacity style={styles.bookNow}>
                    <Ionicons name="call" size={24} color="#fff" />
                    <Text style={styles.bookNowText}>BOOK NOW</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("BrowseItems")} >
                    <Text style={styles.browseText}>BROWSE ITEM’S</Text>
                    <Ionicons name="search" size={24} color="#fff" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
            </ScrollView>

            {/*  Fixed Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="home" size={28} />
                    <Text style={styles.navLabel}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("BrowseItems")}>
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

export default Home;

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
        marginTop: 0,

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
        paddingBottom: 120, // space for bottom nav
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#eee',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        borderColor:'black',
        borderWidth:0.5,
    },
    input: {
        flex: 1,
        marginHorizontal: 10,
        fontSize: 16,
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
        marginTop:10
    },

    navLabel: {
        fontSize: 12,
        color: 'black',
        fontWeight: '400',
        marginTop: 4,
        marginBottom: 10,
    },

});

