import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { globalStyles } from '../config/theme';

export default function SuccessCheckInModal({ data, onClose }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (data) {
      scaleAnim.setValue(0);
      pulseAnim.setValue(0);
      rotateAnim.setValue(0);

      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }).start();

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [data]);

  if (!data) return null;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-35deg', '0deg'],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.6],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0.8, 0.4, 0],
  });

  return (
    <Modal visible={!!data} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 16, width: 300, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 10 }}>

          <View style={{ width: 80, height: 80, justifyContent: 'center', alignItems: 'center', marginBottom: 14 }}>
            <Animated.View style={{
              position: 'absolute',
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: '#bbf7d0',
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
            }} />

            <Animated.View style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: '#16a34a',
              justifyContent: 'center',
              alignItems: 'center',
              transform: [
                { scale: scaleAnim },
                { rotate: spin },
              ],
              shadowColor: '#16a34a',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 6,
            }}>
              <View style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', marginTop: 2, marginLeft: 1 }}>
                <Feather name="check" size={38} color="#ffffff" style={{ textAlign: 'center' }} />
              </View>
            </Animated.View>
          </View>

          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 }}>
            {data.title || 'Check-In Berhasil!'}
          </Text>
          <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 14 }}>
            {data.details || `Kendaraan ${data.licensePlate} telah terdaftar.`}
          </Text>

          {data.queueNumber && (
            <View style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 10, color: '#64748b', fontWeight: 'bold', marginBottom: 2 }}>NOMOR ANTRIAN</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0f172a' }}>{data.queueNumber}</Text>
            </View>
          )}

          <TouchableOpacity style={[globalStyles.button, { width: '100%', marginTop: 0, backgroundColor: '#0f172a' }]} onPress={onClose}>
            <Text style={globalStyles.buttonText}>Selesai</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
