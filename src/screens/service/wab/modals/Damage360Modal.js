import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Image, Alert, Keyboard, useWindowDimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { globalStyles } from '../../../../config/theme';

export default function Damage360Modal({
  visible,
  onClose,
  damageType,
  setDamageType,
  severity,
  setSeverity,
  damageNotes,
  setDamageNotes,
  damagePhoto,
  setDamagePhoto,
  isEditing,
  onSave,
}) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const handleSelectPhotoOptions = () => {
    Alert.alert(
      "Foto Bukti Kerusakan",
      "Pilih sumber foto bukti kerusakan:",
      [
        { text: "Batal", style: "cancel" },
        { text: "📷 Kamera", onPress: openCamera },
        { text: "🖼 Galeri Foto", onPress: openGallery }
      ]
    );
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Izin Akses", "Izin membuka kamera diperlukan.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setDamagePhoto(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert("Error", "Gagal membuka kamera.");
    }
  };

  const openGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Izin Akses", "Izin membuka galeri foto diperlukan.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setDamagePhoto(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert("Error", "Gagal membuka galeri.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={onClose}
            style={{
              flex: 1,
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}}
              style={{
                backgroundColor: '#ffffff',
                padding: 20,
                borderRadius: 14,
                width: '100%',
                maxWidth: 420,
                maxHeight: '90%',
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
              }}
            >
              <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 4 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 }}>
                  {isEditing ? 'Edit Catatan Kerusakan 360°' : 'Tambah Catatan Kerusakan 360°'}
                </Text>

                <Text style={globalStyles.label}>Jenis Kerusakan:</Text>
                <View style={globalStyles.purposeGrid}>
                  {[
                    { id: 'Scratch', label: 'Baret / Scratch' },
                    { id: 'Dent', label: 'Penyok / Dent' },
                    { id: 'Crack', label: 'Retak / Crack' },
                    { id: 'Paint', label: 'Cat Terkelupas' }
                  ].map(item => {
                    const isActive = damageType === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.7}
                        style={[globalStyles.purposeChip, isActive && globalStyles.purposeChipActive]}
                        onPress={() => setDamageType(item.id)}
                      >
                        <Text style={[globalStyles.purposeText, isActive && globalStyles.purposeTextActive]}>{item.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={globalStyles.label}>Tingkat Keparahan:</Text>
                <View style={globalStyles.purposeGrid}>
                  {['Low', 'Medium', 'High'].map(lvl => {
                    const isActive = severity === lvl;
                    return (
                      <TouchableOpacity
                        key={lvl}
                        activeOpacity={0.7}
                        style={[globalStyles.purposeChip, isActive && globalStyles.purposeChipActive]}
                        onPress={() => setSeverity(lvl)}
                      >
                        <Text style={[globalStyles.purposeText, isActive && globalStyles.purposeTextActive]}>{lvl}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={globalStyles.label}>Catatan Tambahan (Opsional):</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Misal: Baret sepanjang 5cm di samping pintu..."
                  value={damageNotes}
                  onChangeText={setDamageNotes}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={true}
                />

                <Text style={globalStyles.label}>Foto Bukti Kerusakan:</Text>
                {damagePhoto ? (
                  <View style={{ marginTop: 6, alignItems: 'center', position: 'relative' }}>
                    <Image
                      source={{ uri: damagePhoto }}
                      style={{ width: '100%', height: 130, borderRadius: 8, resizeMode: 'cover' }}
                    />
                    <TouchableOpacity
                      onPress={() => setDamagePhoto(null)}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(225, 29, 72, 0.9)',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: 'bold' }}>✕ Hapus Foto</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleSelectPhotoOptions}
                    style={{
                      marginTop: 6,
                      borderWidth: 1,
                      borderColor: '#cbd5e1',
                      borderStyle: 'dashed',
                      borderRadius: 8,
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      backgroundColor: '#f8fafc',
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: 10,
                    }}
                  >
                    <Feather name="camera" size={16} color="#0054a6" />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#0054a6', marginLeft: 4 }}>
                      + Ambil Foto / Upload Evidence
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
                  <TouchableOpacity style={[globalStyles.button, { flex: 1, backgroundColor: '#64748b' }]} onPress={onClose}>
                    <Text style={globalStyles.buttonText}>Batal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[globalStyles.button, { flex: 2, backgroundColor: '#15803d' }]} onPress={onSave}>
                    <Text style={globalStyles.buttonText}>{isEditing ? 'Update Titik' : 'Simpan Titik'}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
