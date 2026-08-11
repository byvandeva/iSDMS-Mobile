import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../../../config/theme';
import { getPurposeString } from '../../../../utils/helpers';

export default function PendingCheckInModal({ pendingCheckIn, onClose, onConfirm }) {
  if (!pendingCheckIn) return null;

  return (
    <Modal visible={!!pendingCheckIn} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 14, position: 'relative' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a' }}>Konfirmasi Check-In</Text>
            <TouchableOpacity onPress={onClose} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a' }}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
              <Text style={{ fontSize: 13, color: '#64748b' }}>Nomor Polisi</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>{(pendingCheckIn.data.licensePlate || '').toUpperCase()}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
              <Text style={{ fontSize: 13, color: '#64748b' }}>Model Kendaraan</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>{pendingCheckIn.data.vehicleModel || 'Suzuki Vehicle'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: pendingCheckIn.data.customerName ? 1 : 0, borderBottomColor: '#f1f5f9' }}>
              <Text style={{ fontSize: 13, color: '#64748b' }}>Tujuan Kedatangan</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>{getPurposeString(pendingCheckIn.data.arrivalPurpose)}</Text>
            </View>
            {pendingCheckIn.data.customerName ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
                <Text style={{ fontSize: 13, color: '#64748b' }}>Nama Pelanggan</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>{pendingCheckIn.data.customerName}</Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity style={[globalStyles.button, { backgroundColor: '#0f172a', marginTop: 0 }]} onPress={onConfirm}>
            <Text style={globalStyles.buttonText}>Check-In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
