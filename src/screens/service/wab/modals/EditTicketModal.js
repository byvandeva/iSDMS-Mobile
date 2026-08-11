import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { globalStyles } from '../../../../config/theme';

export default function EditTicketModal({ visible, onClose, editForm, setEditForm, onSave }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 12 }}>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a' }}>Edit Data Kendaraan & Tujuan</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ paddingHorizontal: 6, paddingVertical: 2 }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#64748b' }}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={globalStyles.label}>Nomor Polisi</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="B 1234 ABC"
            value={editForm.licensePlate}
            onChangeText={text => setEditForm({ ...editForm, licensePlate: text })}
            autoCapitalize="characters"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />

          <Text style={globalStyles.label}>Model / Tipe Kendaraan</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Suzuki XL7 Alpha"
            value={editForm.vehicleModel}
            onChangeText={text => setEditForm({ ...editForm, vehicleModel: text })}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />

          <Text style={globalStyles.label}>Pilih Tujuan Kedatangan:</Text>
          <View style={globalStyles.purposeGrid}>
            {[
              { id: 'Service', label: 'Service', icon: 'tool' },
              { id: 'Sales', label: 'Sales', icon: 'shopping-bag' },
              { id: 'BodyRepair', label: 'Body Repair', icon: 'layers' },
              { id: 'SparePart', label: 'Spare Part', icon: 'package' }
            ].map(p => (
              <TouchableOpacity
                key={p.id}
                style={[
                  globalStyles.purposeChip,
                  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
                  editForm.arrivalPurpose === p.id && globalStyles.purposeChipActive
                ]}
                onPress={() => setEditForm({ ...editForm, arrivalPurpose: p.id })}
              >
                <Feather name={p.icon} size={14} color={editForm.arrivalPurpose === p.id ? '#ffffff' : '#0f172a'} />
                <Text style={[globalStyles.purposeText, editForm.arrivalPurpose === p.id && globalStyles.purposeTextActive]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[globalStyles.button, { width: '100%', marginTop: 20, backgroundColor: '#0f172a' }]} onPress={onSave}>
            <Text style={globalStyles.buttonText}>Simpan Perubahan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
