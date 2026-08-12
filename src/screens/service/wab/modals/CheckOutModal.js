import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../../../config/theme';

export default function CheckOutModal({ visible, checkingOutTicket, onClose, onConfirm }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 }}>
        <View style={{ backgroundColor: 'white', padding: 22, borderRadius: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 }}>Konfirmasi Check-Out</Text>
          <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
            Apakah Anda yakin kendaraan <Text style={{ fontWeight: 'bold', color: '#000000ff' }}>{checkingOutTicket?.licensePlate}</Text> ({checkingOutTicket?.vehicleModel}) akan rilis/keluar dari gerbang?
          </Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <TouchableOpacity style={[globalStyles.button, { flex: 1, backgroundColor: '#64748b', marginTop: 0 }]} onPress={onClose}>
              <Text style={globalStyles.buttonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[globalStyles.button, { flex: 1.5, backgroundColor: '#16a34a', marginTop: 0 }]} onPress={onConfirm}>
              <Text style={globalStyles.buttonText}>Check-Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
