import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ image, title, info }) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>{title}</Text>

        {/* Features */}
        {info.features && info.features.map((line, i) => (
          <Text style={styles.content} key={`feat-${i}`}>{line}</Text>
        ))}

        {/* What's Included */}
        {info.included && (
          <>
            <Text style={styles.infoHeader}>📦 WHAT'S INCLUDED:</Text>
            {info.included.map((line, i) => (
              <Text style={styles.content} key={`incl-${i}`}>{line}</Text>
            ))}
          </>
        )}

        {/* Rental Price */}
        {info.price && (
          <>
            <Text style={styles.infoHeader}>💰 RENTAL PRICE:</Text>
            <Text style={styles.content}>{info.price}</Text>
          </>
        )}

        {/* Security Deposit */}
        {info.deposit && (
          <>
            <Text style={styles.infoHeader}>🔐 SECURITY DEPOSIT:</Text>
            <Text style={styles.content}>{info.deposit}</Text>
          </>
        )}

        {/* Location */}
        {info.location && (
          <>
            <Text style={styles.infoHeader}>📍 LOCATION:</Text>
            <Text style={styles.content}>{info.location}</Text>
          </>
        )}

        {/* Rating */}
        {info.rating && (
          <>
            <Text style={styles.infoHeader}>⭐ RATING:</Text>
            <Text style={styles.content}>{info.rating}</Text>
          </>
        )}

        {/* Availability */}
        {info.availability && (
          <>
            <Text style={styles.infoHeader}>📅 AVAILABILITY:</Text>
            <Text style={styles.content}>{info.availability}</Text>
          </>
        )}

        <TouchableOpacity style={styles.bookBtn}>
          <Text style={styles.bookText}>📅 BOOK NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 30,
  },
  image: {
   width: 380,
        height: 250,
        resizeMode: 'contain',
        marginTop: 20
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
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  infoHeader: {
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  content: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bookBtn: {
    backgroundColor: '#001F54',
    marginTop: 18,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  bookText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 14,
  },
});
