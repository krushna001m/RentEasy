import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    Platform
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const History = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Image source={require('../../assets/logo.png')} style={styles.logo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("Chat")}>
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

                <Text style={styles.label}>RENTAL ITEM / SERVICE NAME</Text>
                <TextInput style={styles.input} placeholder="E.g., Nikon DSLR Camera" />

                <Text style={styles.label}>RENTAL PERIOD</Text>
                <View style={styles.periodRow}>
                    <TextInput style={[styles.input, { flex: 1, marginRight: 5 }]} placeholder="From" />
                    <TextInput style={[styles.input, { flex: 1, marginLeft: 5 }]} placeholder="To" />
                </View>

                <Text style={styles.label}>PRICE BREAKDOWN</Text>
                <Text style={styles.textBreak}>- DAILY RENTAL RATE x NUMBER OF DAYS</Text>
                <Text style={styles.textBreak}>- DEPOSIT OR SECURITY FEE</Text>
                <Text style={styles.textBreak}>- ANY APPLICABLE TAXES OR LATE FEES</Text>

                <Text style={styles.label}>STATUS</Text>
                <Text style={styles.status}><FontAwesome name="check-circle" size={18}/> COMPLETED</Text>
                <Text style={styles.status}><FontAwesome name="check-circle" size={18}/> RETURNED LATE</Text>
                <Text style={styles.status}><FontAwesome name="check-circle" size={18}/> CANCELLED</Text>

                <Text style={styles.label}>PICK-UP / DROP-OFF LOCATION</Text>
                <TextInput style={styles.input} placeholder="E.g., Pune, Maharashtra" />

                <Text style={styles.label}>RENTAL ID OR RECEIPT NUMBER</Text>
                <TextInput style={styles.input} placeholder="#RENT12345678" />

                <Text style={styles.label}>NOTES / FEEDBACK </Text>
                <TextInput style={[styles.input, { height: 100 }]} placeholder="Write your feedback..." multiline />

                <TouchableOpacity style={styles.downloadBtn}>
                    <Text style={styles.downloadText}>DOWNLOAD RECEIPT OR INVOICE</Text>
                    <Entypo name="download" size={20} color="white" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
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
                ios:{
                    flex:1,
                    marginTop:10
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
        marginBottom:4
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
        fontSize:17
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
