import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../config/theme';

export default function AccountScreen({ userRole, onLogout }) {
  return (
    <View style={{ backgroundColor: COLORS.cardBg, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border }}>
      <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 12 }}>Profil Pengguna (Account)</Text>

      <View style={{ alignItems: 'center', marginVertical: 16, padding: 16, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>
            {userRole === 'Security' ? 'S' : userRole === 'Foreman' ? 'F' : 'SA'}
          </Text>
        </View>
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.textPrimary }}>
          {userRole === 'Security' ? 'Security Gate Officer' : userRole === 'Foreman' ? 'Foreman Bengkel' : 'Service Advisor (SA)'}
        </Text>
        <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>
          Role: {userRole}
        </Text>
      </View>

      <TouchableOpacity
        style={{ backgroundColor: '#be123c', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 10 }}
        onPress={onLogout}
      >
        <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 14 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
