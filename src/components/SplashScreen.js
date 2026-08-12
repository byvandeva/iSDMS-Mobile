import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, Dimensions, StyleSheet, Image } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

export default function SplashScreen({ onFinish }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const splashContainerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const targetLogoTranslateY = -(SCREEN_HEIGHT / 2 - 105);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(350),

      Animated.parallel([
        Animated.timing(logoTranslateY, {
          toValue: targetLogoTranslateY,
          duration: 700,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1.0,
          duration: 700,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 700,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),

      Animated.timing(splashContainerOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      if (onFinish) onFinish();
    });
  }, [logoOpacity, logoScale, logoTranslateY, cardTranslateY, cardOpacity, splashContainerOpacity, onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: splashContainerOpacity }]}>
      <View style={styles.logoCenterContainer}>
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [
              { translateY: logoTranslateY },
              { scale: logoScale }
            ],
          }}
        >
          <AnimatedExpoImage
            source={require('../../assets/suzuki_white_logo.png')}
            style={styles.logoImage}
            contentFit="contain"
          />
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.bottomCardPreview,
          {
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslateY }]
          }
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002b5c',
  },
  logoCenterContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logoImage: {
    width: 210,
    height: 85,
  },
  bottomCardPreview: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT - 200,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
});
