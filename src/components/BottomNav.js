import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function BottomNav({ userRole, activeTab, setActiveTab }) {
  const navItems = userRole === 'Security'
    ? [
      { id: 'bookings', label: 'List Booking', icon: 'list' },
      { id: 'daftar-tamu', label: 'Daftar Tamu', icon: 'users' },
      { id: 'history', label: 'Riwayat', icon: 'clock' },
      { id: 'account', label: 'Akun', icon: 'user' },
    ]
    : userRole === 'Foreman'
      ? [
        { id: 'foreman', label: 'Workshop', icon: 'tool' },
        { id: 'history', label: 'Hist. WAB', icon: 'clock' },
        { id: 'account', label: 'Akun', icon: 'user' },
      ]
      : [
        { id: 'daftar-tamu', label: 'Daftar Tamu', icon: 'users' },
        { id: 'wab-form', label: 'Form WAB', icon: 'file-text' },
        { id: 'history', label: 'History', icon: 'clock' },
        { id: 'account', label: 'Akun', icon: 'user' },
      ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map(item => {
        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.bottomNavItem}
            onPress={() => setActiveTab(item.id)}
          >
            <Feather
              name={item.icon}
              size={18}
              color={isActive ? '#0f172a' : '#94a3b8'}
            />
            <Text style={[styles.bottomNavText, isActive && styles.bottomNavTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#ffffff',
    height: 60,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 8,
  },
  bottomNavItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNavText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
  bottomNavTextActive: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
});
