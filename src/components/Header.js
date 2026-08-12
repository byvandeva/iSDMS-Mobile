import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Image
          source={require('../../assets/suzuki_logo.png')}
          style={{ width: 105, height: 36, resizeMode: 'contain' }}
        />
        <View style={{ borderLeftWidth: 1, borderLeftColor: '#cbd5e1', paddingLeft: 10 }}>
          <Text style={styles.headerTitle}>SDMS</Text>
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
