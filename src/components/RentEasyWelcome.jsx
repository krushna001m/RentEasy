import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const RentEasyWelcome = () => {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
  Animated.parallel([
    Animated.spring(logoAnim, {
      toValue: 1,
      friction: 3,
      tension: 80,
      useNativeDriver: true,
    }),
    Animated.timing(textFade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
    Animated.timing(textSlide, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }),
  ]).start();
}, []);


  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/logo.png')}
        style={[
          styles.logo,
          {
            transform: [{ scale: logoAnim }],
          },
        ]}
        resizeMode="contain"
      />
      <Animated.View style={{ opacity: textFade, transform: [{ translateY: textSlide }] }}>
        <Text style={styles.title}>Welcome to RentEasy</Text>
        <Text style={styles.subtitle}>Find it. Rent it. Return it.</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F0FA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: width * 0.55,
    height: height * 0.22,
    marginBottom: 5,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#0e015dff', // Orange-500
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e18b09ff', // Orange-600
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.1,
    fontWeight:'bold'
  },
});

export default RentEasyWelcome;
