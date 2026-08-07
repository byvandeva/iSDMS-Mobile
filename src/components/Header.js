import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Image
          source={require('../../assets/suzuki_logo.svg')}
          style={{ width: 105, height: 36 }}
          contentFit="contain"
        />
        <View style={{ borderLeftWidth: 1, borderLeftColor: '#cbd5e1', paddingLeft: 10 }}>
          <Text style={styles.headerTitle}>Suzuki Dealer Portal</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
