import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { categories } from "../constants/categories";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ProductCard = ({ image, title, info, navigation }) => {
  const renderStars = (ratingString) => {
    const rating = parseFloat(ratingString);
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Entypo
          key={`full-${i}`}
          name="star"
          size={20}
          color="orange"
          style={{ marginRight: 2 }}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Entypo
          key="half"
          name="star-outlined"
          size={20}
          color="orange"
          style={{ marginRight: 2 }}
        />
      );
    }

    return stars;
  };

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />

      {/* ⭐ Dynamic Rating Row */}
      {info.rating && (
        <View style={styles.ratingRow}>
          {renderStars(info.rating)}
          <Text style={styles.ratingText}>{info.rating}</Text>
        </View>
      )}

      <View style={styles.infoBox}>
        {/* Title with Icon */}
        <View style={styles.titleRow}>
          <Ionicons name="information-circle-outline" size={20} color="#333" />
          <Text style={styles.infoTitle}>{title}</Text>
        </View>

        {/* Features */}
        {info.features &&
          info.features.map((line, i) => (
            <Text style={styles.content} key={`feat-${i}`}>
              {line}
            </Text>
          ))}

        {/* Categories */}
        {Array.isArray(info.categories) && info.categories.length > 0 && (
          <>
            <View style={styles.headerRow}>
              <MaterialIcons name="category" size={18} color="#555" />
              <Text style={styles.infoHeader}>CATEGORIES:</Text>
            </View>
            <Text style={styles.content}>
              {info.categories
                .map((catId) => {
                  const category = categories.find((c) => c.id === catId);
                  return category ? category.label : "Unknown";
                })
                .join(", ")}
            </Text>
          </>
        )}

        {/* Included */}
        {info.included && info.included.length > 0 && (
          <>
            <View style={styles.headerRow}>
              <Ionicons name="cube-outline" size={18} color="#555" />
              <Text style={styles.infoHeader}>WHAT'S INCLUDED:</Text>
            </View>
            {info.included.map((line, i) => (
              <Text style={styles.content} key={`incl-${i}`}>
                {line}
              </Text>
            ))}
          </>
        )}

        {/* Rental Price */}
        {info.price && (
          <>
            <View style={styles.headerRow}>
              <FontAwesome name="money" size={18} color="#555" />
              <Text style={styles.infoHeader}>RENTAL PRICE:</Text>
            </View>
            <Text style={styles.content}>{info.price}</Text>
          </>
        )}

        {/* Security Deposit */}
        {info.deposit && (
          <>
            <View style={styles.headerRow}>
              <Ionicons name="lock-closed-outline" size={18} color="#555" />
              <Text style={styles.infoHeader}>SECURITY DEPOSIT:</Text>
            </View>
            <Text style={styles.content}>{info.deposit}</Text>
          </>
        )}

        {/* Owner */}
        {info.owner && (
          <>
            <View style={styles.headerRow}>
              <Ionicons name="person-outline" size={18} color="#555" />
              <Text style={styles.infoHeader}>OWNER:</Text>
            </View>
            <Text style={styles.content}>{info.owner}</Text>
          </>
        )}

        {/* Location */}
        {info.location && (
          <>
            <View style={styles.headerRow}>
              <Ionicons name="location-outline" size={18} color="#555" />
              <Text style={styles.infoHeader}>LOCATION:</Text>
            </View>
            <Text style={styles.content}>{info.location}</Text>
          </>
        )}

        {/* Availability */}
        {info.availability && (
          <>
            <View style={styles.headerRow}>
              <Ionicons name="calendar-outline" size={18} color="#555" />
              <Text style={styles.infoHeader}>AVAILABILITY:</Text>
            </View>
            <Text style={styles.content}>{info.availability}</Text>
          </>
        )}

        {/* Book Now Button */}
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => navigation.navigate("Payment", { itemInfo: info, title })}
        >
          <Ionicons name="calendar" size={18} color="#fff" />
          <Text style={styles.bookText}>BOOK NOW</Text>
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
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  ratingText: {
    marginLeft: 6,
    color: "#333",
    fontWeight: "bold",
  },
  image: {
    width: 380,
    height: 250,
    resizeMode: "cover",
    backgroundColor: '#E6F0FA',
    marginTop: 20,
    marginBottom:20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 300,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  infoBox: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
    marginTop:10
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 6,
  },

  infoHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginLeft: 6,
  },

  content: {
    fontSize: 14,
    color: "#666",
    marginLeft: 25, // aligns under the header
    marginTop: 4,
  },

  bookBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001F54",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },

  bookText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
});
