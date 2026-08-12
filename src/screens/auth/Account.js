import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../config/theme';

export default function AccountScreen({ userRole, onLogout }) {
  return (
    <View style={{ backgroundColor: COLORS.cardBg, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
      <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 16 }}>Profil Pengguna</Text>

      <View style={{ alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 }}>
          <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: 'bold' }}>
            {userRole === 'Security' ? 'S' : userRole === 'Foreman' ? 'F' : 'SA'}
          </Text>
        </View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary }}>
          {userRole === 'Security' ? 'Security Gate Officer' : userRole === 'Foreman' ? 'Foreman Bengkel' : 'Service Advisor (SA)'}
        </Text>
        <View style={{ marginTop: 6, backgroundColor: '#e2e8f0', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textDarkLabel }}>
            Role: {userRole}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={{ backgroundColor: '#be123c', paddingVertical: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
        onPress={onLogout}
        activeOpacity={0.8}
      >
        <Feather name="log-out" size={16} color="#ffffff" />
        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 14 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
