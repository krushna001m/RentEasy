import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { categories } from "../constants/categories";

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
        <Text style={styles.infoTitle}>{title}</Text>

        {/* Features */}
        {info.features &&
          info.features.map((line, i) => (
            <Text style={styles.content} key={`feat-${i}`}>
              {line}
            </Text>
          ))}

        {/* Categories */}
        {Array.isArray(info.categories) && info.categories.length > 0 ? (
          <>
            <Text style={styles.infoHeader}>📂 CATEGORIES:</Text>
            <Text style={styles.content}>
              {info.categories
                .map((catId) => {
                  const category = categories.find((c) => c.id === catId);
                  return category ? category.label : "Unknown";
                })
                .join(", ")}
            </Text>
          </>
        ) : null}


        {/* Included */}
        {info.included && info.included.length > 0 && (
          <>
            <Text style={styles.infoHeader}>📦 WHAT'S INCLUDED:</Text>
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

        {/* Owner */}
        {info.owner && (
          <>
            <Text style={styles.infoHeader}>👤 OWNER:</Text>
            <Text style={styles.content}>{info.owner}</Text>
          </>
        )}

        {/* Location */}
        {info.location && (
          <>
            <Text style={styles.infoHeader}>📍 LOCATION:</Text>
            <Text style={styles.content}>{info.location}</Text>
          </>
        )}

        {/* Availability */}
        {info.availability && (
          <>
            <Text style={styles.infoHeader}>📅 AVAILABILITY:</Text>
            <Text style={styles.content}>{info.availability}</Text>
          </>
        )}

        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() =>
            navigation.navigate("Payment", { itemInfo: info, title })
          }
        >
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
    marginTop: 20,
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
    backgroundColor: "#eee",
    padding: 16,
    borderRadius: 20,
    marginTop: 10,
    borderColor: "black",
    borderWidth: 0.4,
  },
  infoTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    color: "#000",
    textAlign: "center",
    textTransform: "uppercase",
  },
  infoHeader: {
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  content: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  bookBtn: {
    backgroundColor: "#001F54",
    marginTop: 18,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  bookText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 14,
  },
});
