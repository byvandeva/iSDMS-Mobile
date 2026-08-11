import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../../config/theme';

export default function DrhDashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>DRH System — Retention Dashboard</Text>
        <Text style={styles.cardSubtitle}>Monitoring tingkat kedatangan servis berkala pelanggan Suzuki.</Text>
        
        <View style={styles.metricRow}>
          <View style={[styles.metricBox, { backgroundColor: '#e0f2fe' }]}>
            <Text style={[styles.metricNumber, { color: '#0369a1' }]}>84.5%</Text>
            <Text style={styles.metricLabel}>Retention Rate</Text>
          </View>

          <View style={[styles.metricBox, { backgroundColor: '#dcfce7' }]}>
            <Text style={[styles.metricNumber, { color: '#15803d' }]}>128</Text>
            <Text style={styles.metricLabel}>Unit Servis Bulan Ini</Text>
          </View>
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
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricBox: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textDarkLabel,
    marginTop: 4,
  },
});
