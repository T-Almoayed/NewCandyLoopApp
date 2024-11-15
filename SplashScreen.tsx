import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    // Start the animation
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start(() => {
      // Navigate to the Login screen after the animation
      setTimeout(() => {
        (navigation as any).navigate('LoginScreen');
      }, 2000);
    });
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0], // Move from left to center
  });

  const translateXRight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0], // Move from right to center
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { transform: [{ translateX }] }]}>
        Candy
      </Animated.Text>
      <Animated.Text style={[styles.text, { transform: [{ translateX: translateXRight }] }]}>
        Loop
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#D60265',
    fontFamily: 'luckybones-bold',
  },
});

export default SplashScreen;
