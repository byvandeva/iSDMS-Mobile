import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../config/theme';

export default function SparepartScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Modul Sparepart</Text>
        <Text style={styles.cardSubtitle}>Pengelolaan stok & permintaan SGP (Suzuki Genuine Parts).</Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Status Stok SGP</Text>
          <Text style={styles.infoText}>Oli Ecstar 0W-20 — 142 Pcs (Aman)</Text>
          <Text style={styles.infoText}>Filter Oli XL7 — 88 Pcs (Aman)</Text>
          <Text style={styles.infoText}>Kampas Rem Ertiga — 12 Pcs (Perlu Reorder)</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 12,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textDarkLabel,
    marginBottom: 4,
  },
});
