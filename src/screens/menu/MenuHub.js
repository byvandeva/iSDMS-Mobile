import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function MenuHub({ userRole, onSelectMenu }) {
  const [search, setSearch] = useState('');

  const categories = [
    {
      title: 'Layanan Service & Workshop',
      items: [
        { id: 'wab-form', name: 'Form WAB', icon: 'file-text', color: '#64748b', roles: ['ServiceAdvisor', 'Admin'] },
        { id: 'daftar-tamu', name: 'Daftar Tamu', icon: 'users', color: '#64748b', roles: ['Security', 'ServiceAdvisor', 'Admin'] },
        { id: 'bookings', name: 'List Booking', icon: 'calendar', color: '#64748b', roles: ['Security', 'Admin'] },
        { id: 'foreman', name: 'Workshop Board', icon: 'tool', color: '#64748b', roles: ['Foreman', 'Admin'] },
        { id: 'tv-display', name: 'TV Display', icon: 'tv', color: '#64748b', roles: ['Security', 'ServiceAdvisor', 'Foreman', 'CCM', 'Admin'] },
        { id: 'history', name: 'Riwayat WAB', icon: 'clock', color: '#64748b', roles: ['Security', 'ServiceAdvisor', 'Foreman', 'Admin'] },
      ]
    },
    {
      title: 'Modul Sparepart & Inventory',
      items: [
        { id: 'sparepart', name: 'Sparepart', icon: 'package', color: '#64748b', roles: ['Security', 'ServiceAdvisor', 'Foreman', 'CCM', 'Admin'] },
      ]
    },
    {
      title: 'Modul DRH System',
      items: [
        { id: 'drh-dashboard', name: 'Dashboard DRH', icon: 'refresh-cw', color: '#64748b', roles: ['Security', 'ServiceAdvisor', 'Foreman', 'CCM', 'Admin'] },
      ]
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBox}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Image
            source={require('../../../assets/s_logo.png')}
            fadeDuration={0}
            style={styles.suzukiLogoImage}
          />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.brandTitle}>SDMS</Text>
              <View style={styles.brandBadge}>
                <Text style={styles.brandBadgeText}>HUB</Text>
              </View>
            </View>
            <Text style={styles.brandSubtitle}>Pusat Navigasi Modul Platform</Text>
          </View>
        </View>

        <View style={styles.searchWrapper}>
          <Feather name="search" size={16} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari modul aplikasi..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#94a3b8"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={16} color="#64748b" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {categories.map((cat, cIdx) => {
        const filteredItems = cat.items.filter(item => {
          const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
          const matchRole = item.roles.includes(userRole);
          return matchSearch && matchRole;
        });

        if (filteredItems.length === 0) return null;

        return (
          <View key={cIdx} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{cat.title}</Text>

            <View style={styles.gridRow}>
              {filteredItems.map((item, iIdx) => (
                <TouchableOpacity
                  key={iIdx}
                  style={styles.gridTile}
                  activeOpacity={0.75}
                  onPress={() => onSelectMenu(item.id)}
                >
                  <View style={styles.iconWrapper}>
                    <Feather name={item.icon} size={30} color={item.color} />
                  </View>
                  <Text style={styles.tileLabel} numberOfLines={2}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  suzukiLogoImage: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  brandBadge: {
    backgroundColor: '#0054a6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  brandBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    padding: 0,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
    paddingLeft: 2,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridTile: {
    width: '31%',
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 6,
    borderRadius: 18,
    borderWidth: 0,
    alignItems: 'center',
    justify: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justify: 'center',
    marginBottom: 6,
  },
  tileLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 15,
  },
});
