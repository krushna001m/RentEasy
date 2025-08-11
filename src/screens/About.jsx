import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

const About = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:support@renteasyapp.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+919699050043');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://www.renteasyapp.com');
  };

  const handleInstagramPress = () => {
    Linking.openURL('https://www.instagram.com/renteasy.in');
  };

  const handleFacebookPress = () => {
    Linking.openURL('https://www.facebook.com/renteasyapp');
  };

  const handleFeedbackPress = () => {
    Linking.openURL('mailto:feedback@renteasyapp.com?subject=App Feedback&body=Hi RentEasy Team,');
  };

  const handleLocationPress = () => {
    const url = Platform.select({
      ios: 'http://maps.apple.com/?q=RentEasy+Headquarters',
      android: 'geo:0,0?q=RentEasy+Headquarters',
    });
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>RentEasy</Text>
      <Text style={styles.version}>Version 1.0.0</Text>

      <Text style={styles.description}>
        RentEasy is your go-to platform for renting and lending everyday items. Whether you're looking to save money or earn from unused stuff — we connect trusted borrowers and lenders in a secure, community-driven app.
      </Text>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>

        <TouchableOpacity style={styles.row} onPress={handleEmailPress}>
          <MaterialIcons name="email" size={20} color="#007BFF" />
          <Text style={styles.linkText}>support@renteasyapp.com</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={handlePhonePress}>
          <FontAwesome name="phone" size={20} color="#007BFF" />
          <Text style={styles.linkText}>+91 9699050043</Text>
        </TouchableOpacity>
      </View>

      {/* Social Media */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Follow Us</Text>

        <TouchableOpacity style={styles.row} onPress={handleInstagramPress}>
          <FontAwesome name="instagram" size={20} color="#C13584" />
          <Text style={styles.linkText}>Instagram</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={handleFacebookPress}>
          <FontAwesome name="facebook" size={20} color="#3b5998" />
          <Text style={styles.linkText}>Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={handleWebsitePress}>
          <Feather name="globe" size={20} color="#007BFF" />
          <Text style={styles.linkText}>www.renteasyapp.com</Text>
        </TouchableOpacity>
      </View>

      {/* Extra */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Info</Text>

        <TouchableOpacity style={styles.row} onPress={handleFeedbackPress}>
          <MaterialIcons name="feedback" size={20} color="#007BFF" />
          <Text style={styles.linkText}>Send Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={handleLocationPress}>
          <Ionicons name="location-sharp" size={20} color="#FF5722" />
          <Text style={styles.linkText}>RentEasy HQ, Nashik</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>© 2025 RentEasy. All rights reserved.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    flexGrow: 1,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
  },
  version: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 10,
  },
  footer: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default About;
