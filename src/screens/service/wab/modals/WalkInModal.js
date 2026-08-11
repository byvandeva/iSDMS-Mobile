import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Keyboard, Alert, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { globalStyles } from '../../../../config/theme';

const OCR_SPACE_API_KEY = 'K89836873688957';

export default function WalkInModal({
  visible,
  onClose,
  licensePlate,
  setLicensePlate,
  vehicleModel,
  setVehicleModel,
  showModelDropdown,
  setShowModelDropdown,
  arrivalPurpose,
  setArrivalPurpose,
  onSubmit,
}) {
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrPhotoUri, setOcrPhotoUri] = useState(null);

  const modelList = [
    'Suzuki XL7 Alpha', 'Suzuki XL7 Beta', 'Suzuki XL7 Hybrid Alpha', 'Suzuki XL7 Hybrid Beta',
    'Suzuki All New Ertiga Hybrid', 'Suzuki All New Ertiga Cruise', 'Suzuki Ertiga GA', 'Suzuki Ertiga GL',
    'Suzuki Grand Vitara', 'Suzuki e-Vitara',
    'Suzuki S-Presso',
    'Suzuki Baleno',
    'Suzuki Ignis',
    'Suzuki Fronx',
    'Suzuki Jimny 3-Door', 'Suzuki Jimny 5-Door',
    'Suzuki Carry Pick Up', 'Suzuki Carry Flat Deck', 'Suzuki Carry Wide Deck', 'Suzuki Carry Blind Van',
    'Suzuki APV Arena', 'Suzuki APV Blind Van', 'Suzuki APV Luxury'
  ];

  const handleScanOcrOptions = () => {
    Alert.alert(
      '📷 Scan Plat Nomor',
      'Pilih metode untuk mengambil foto plat nomor kendaraan:',
      [
        { text: 'Ambil Foto (Kamera)', onPress: handleTakeOcrCamera },
        { text: 'Pilih dari Galeri', onPress: handlePickOcrGallery },
        { text: 'Batal', style: 'cancel' }
      ]
    );
  };

  const extractLicensePlate = (rawText) => {
    if (!rawText) return '';
    const cleanText = rawText.toUpperCase().replace(/\r?\n|\r/g, ' ').replace(/[^A-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

    // 1. Strict match: e.g. B 1234 ABC or B 123 ABC
    const strictMatch = cleanText.match(/\b([A-Z]{1,2})\s*([0-9]{1,4})\s*([A-Z]{1,3})\b/);
    if (strictMatch) {
      return `${strictMatch[1]} ${strictMatch[2]} ${strictMatch[3]}`;
    }

    // 2. Unspaced match: e.g. B1234ABC -> B 1234 ABC
    const unspacedMatch = cleanText.match(/([A-Z]{1,2})([0-9]{1,4})([A-Z]{1,3})/);
    if (unspacedMatch) {
      return `${unspacedMatch[1]} ${unspacedMatch[2]} ${unspacedMatch[3]}`;
    }

    // 3. Partial match: e.g. B 1234 or 1234 ABC
    const partialMatch = cleanText.match(/([A-Z]{1,2}\s*[0-9]{1,4}|[0-9]{1,4}\s*[A-Z]{1,3})/);
    if (partialMatch) {
      return partialMatch[0];
    }

    // 4. Return cleaned alphanumeric text if long enough
    const alphaNumOnly = cleanText.replace(/[^A-Z0-9 ]/g, '').trim();
    if (alphaNumOnly.length >= 3) {
      return alphaNumOnly;
    }

    return '';
  };

  const processOcrImage = async (uri) => {
    setOcrPhotoUri(uri);
    setIsOcrScanning(true);

    try {
      let rawText = '';
      try {
        const formData = new FormData();
        formData.append('file', {
          uri,
          type: 'image/jpeg',
          name: 'plate.jpg',
        });
        formData.append('apikey', OCR_SPACE_API_KEY);
        formData.append('OCREngine', '2');
        formData.append('scale', 'true');
        formData.append('detectOrientation', 'true');
        formData.append('isTable', 'false');
        formData.append('language', 'eng');

        let response = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (response.status === 429) {
          // Rate limited — wait 1 second and retry once
          await new Promise(r => setTimeout(r, 1000));
          response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: formData,
            headers: { Accept: 'application/json' },
          });
        }

        if (response.ok) {
          const json = await response.json();
          rawText = json?.ParsedResults?.[0]?.ParsedText || '';
        }
      } catch (apiErr) {
        console.warn('API OCR fallback:', apiErr);
      }

      const parsedPlate = extractLicensePlate(rawText);

      if (parsedPlate) {
        setLicensePlate(parsedPlate);
        Alert.alert(
          'Scan Berhasil!',
          `Nomor polisi terdeteksi: ${parsedPlate}\n\nSilakan periksa atau sesuaikan jika ada karakter yang perlu dikoreksi.`
        );
      } else {
        Alert.alert(
          '📷 Foto Terlampir',
          `Teks terbaca: "${rawText.trim() || '(tidak ada)'}"\n\nSilakan masukkan nomor polisi secara manual.`
        );
      }
    } catch (err) {
      console.error('OCR.space error:', err);
      Alert.alert('Koneksi Gagal', 'Tidak dapat menghubungi server OCR. Periksa koneksi internet Anda, atau masukkan nomor polisi manual.');
    } finally {
      setIsOcrScanning(false);
    }
  };

  const handleTakeOcrCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Akses kamera diperlukan untuk memindai plat nomor.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        processOcrImage(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Error Kamera', 'Gagal membuka kamera: ' + err.message);
    }
  };

  const handlePickOcrGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Akses galeri foto diperlukan untuk memilih foto plat nomor.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        processOcrImage(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Error Galeri', 'Gagal mengambil gambar: ' + err.message);
    }
  };

  const handleSubmit = () => {
    onSubmit?.();
    setOcrPhotoUri(null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a' }}>Walk-In</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ paddingHorizontal: 6, paddingVertical: 2 }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#64748b' }}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text style={globalStyles.label}>Nomor Polisi</Text>
            <TouchableOpacity
              onPress={handleScanOcrOptions}
              disabled={isOcrScanning}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                backgroundColor: '#ffffff',
                borderColor: '#0f172a',
                borderWidth: 1,
                paddingHorizontal: 9,
                paddingVertical: 4,
                borderRadius: 6
              }}
            >
              {isOcrScanning ? (
                <ActivityIndicator size="small" color="#0f172a" />
              ) : (
                <Feather name="camera" size={13} color="#0f172a" />
              )}
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#0f172a' }}>
                {isOcrScanning ? 'Memproses OCR...' : 'Foto / Scan'}
              </Text>
            </TouchableOpacity>
          </View>

          {ocrPhotoUri && (
            <View style={{ marginBottom: 8, position: 'relative', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#cbd5e1' }}>
              <Image source={{ uri: ocrPhotoUri }} style={{ width: '100%', height: 133, resizeMode: 'cover' }} />
              <View style={{ position: 'absolute', bottom: 4, left: 6, backgroundColor: 'rgba(15, 23, 42, 0.85)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="check-circle" size={11} color="#22c55e" />
                <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '600' }}>
                  {isOcrScanning ? 'Membaca Plat...' : `OCR Result: ${licensePlate || '-'}`}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => { setOcrPhotoUri(null); }}
                style={{ position: 'absolute', top: 4, right: 6, backgroundColor: 'rgba(225, 29, 72, 0.85)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}
              >
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>✕ Hapus</Text>
              </TouchableOpacity>
            </View>
          )}

          <TextInput
            style={globalStyles.input}
            placeholder="B 1234 ABC"
            value={licensePlate}
            onChangeText={setLicensePlate}
            autoCapitalize="characters"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />

          <Text style={globalStyles.label}>Model / Tipe Kendaraan</Text>
          <View style={{ position: 'relative', justifyContent: 'center' }}>
            <TextInput
              style={[globalStyles.input, { paddingRight: vehicleModel ? 36 : 10 }]}
              placeholder="Ketik untuk mencari model... (contoh: XL7, Ertiga)"
              value={vehicleModel}
              onChangeText={text => {
                setVehicleModel(text);
                setShowModelDropdown(text.trim().length > 0);
              }}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={true}
            />
            {vehicleModel ? (
              <TouchableOpacity
                style={{ position: 'absolute', right: 10, height: '100%', justifyContent: 'center', paddingHorizontal: 6 }}
                onPress={() => {
                  setVehicleModel('');
                  setShowModelDropdown(false);
                }}
              >
                <Text style={{ color: '#64748b', fontSize: 15, fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {showModelDropdown && vehicleModel.trim().length > 0 && (
            <View style={{ maxHeight: 140, backgroundColor: '#ffffff', borderRadius: 6, borderWidth: 1, borderColor: '#cbd5e1', marginTop: 4 }}>
              <ScrollView nestedScrollEnabled style={{ maxHeight: 135 }}>
                {modelList
                  .filter(m => m.toLowerCase().includes(vehicleModel.toLowerCase()))
                  .map(modelName => (
                    <TouchableOpacity
                      key={modelName}
                      style={{ paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}
                      onPress={() => {
                        setVehicleModel(modelName);
                        setShowModelDropdown(false);
                      }}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '500', color: '#0f172a' }}>
                        [SUZUKI] {modelName}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          )}

          <Text style={globalStyles.label}>Tujuan Kedatangan</Text>
          <View style={globalStyles.purposeGrid}>
            {[
              { id: 'Service', label: 'Service', icon: 'tool' },
              { id: 'Sales', label: 'Sales', icon: 'shopping-bag' },
              { id: 'BodyRepair', label: 'Body Repair', icon: 'layers' },
              { id: 'SparePart', label: 'Spare Part', icon: 'package' }
            ].map(p => {
              const isActive = (arrivalPurpose || 'Service') === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    globalStyles.purposeChip,
                    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
                    isActive && globalStyles.purposeChipActive
                  ]}
                  onPress={() => setArrivalPurpose(p.id)}
                >
                  <Feather name={p.icon} size={14} color={isActive ? '#ffffff' : '#0f172a'} />
                  <Text style={[globalStyles.purposeText, isActive && globalStyles.purposeTextActive]}>{p.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={[globalStyles.button, { width: '100%', marginTop: 18 }]} onPress={handleSubmit}>
            <Text style={globalStyles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
