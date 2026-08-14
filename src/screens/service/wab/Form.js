import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, Modal,
  PanResponder, ActionSheetIOS, Platform, Alert, ScrollView, Keyboard, KeyboardAvoidingView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { globalStyles, COLORS } from '../../../config/theme';
import Inspection360Modal from './modals/Inspection360Modal';
import Damage360Modal from './modals/Damage360Modal';

export default function WabFormScreen({
  selectedTicket,
  wabStep,
  setWabStep,
  saCustomerName,
  setSaCustomerName,
  saDriverName,
  setSaDriverName,
  saCustomerPhone,
  setSaCustomerPhone,
  saCustomerEmail,
  setSaCustomerEmail,
  saIdentityNo,
  setSaIdentityNo,
  saPoliceRegNo,
  setSaPoliceRegNo,
  saVehicleModel,
  setSaVehicleModel,
  saOdometer,
  setSaOdometer,
  saCustomerAddress,
  setSaCustomerAddress,
  customerComplaints,
  setCustomerComplaints,
  serviceType,
  setServiceType,
  frameIndex,
  setFrameIndex,
  damages,
  currentAssetBase,
  assetPortIndex,
  setAssetPortIndex,
  assetPorts,
  functionalInspectionsMobile,
  onFunctionalChangeMobile,
  hasSaSigned,
  hasCustomerSigned,
  saSignaturePaths,
  customerSignaturePaths,
  onOpenSaSignatureModal,
  onOpenCustomerSignatureModal,
  onFinalizeWab,
  onNavigateToGuestList,
  onCarImageTouch,
  showDamageModal,
  setShowDamageModal,
  damageType,
  setDamageType,
  severity,
  setSeverity,
  damageNotes,
  setDamageNotes,
  damagePhoto,
  setDamagePhoto,
  isEditingDamage,
  onEditDamageItem,
  onSaveDamageItem,
  onDeleteDamageItem,
}) {
  const [show360Modal, setShow360Modal] = useState(false);
  const [showServiceTypePicker, setShowServiceTypePicker] = useState(false);
  const [selectedEvidencePhoto, setSelectedEvidencePhoto] = useState(null);
  const dragStartXRef = useRef(0);
  const startFrameRef = useRef(1);
  const frameIndexRef = useRef(frameIndex);
  const containerSizeRef = useRef({ w: 300, h: 180 });

  useEffect(() => {
    frameIndexRef.current = frameIndex;
  }, [frameIndex]);

  const handleOpen360Modal = () => {
    if (setShowDamageModal) setShowDamageModal(false);
    setShow360Modal(true);
  };

  const handleContainerLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      containerSizeRef.current = { w: width, h: height };
    }
  };

  const panResponder360 = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) + 5;
      },
      onPanResponderGrant: (evt, gestureState) => {
        dragStartXRef.current = gestureState.x0;
        startFrameRef.current = frameIndexRef.current;
      },
      onPanResponderMove: (evt, gestureState) => {
        const pixelsPerFrame = 8;
        const framesToMove = Math.floor(gestureState.dx / pixelsPerFrame);
        let newFrame = (startFrameRef.current - framesToMove) % 36;
        if (newFrame <= 0) newFrame += 36;
        setFrameIndex(newFrame);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) < 8 && Math.abs(gestureState.dy) < 8) {
          if (onCarImageTouch) onCarImageTouch(evt, containerSizeRef.current.w, containerSizeRef.current.h, frameIndexRef.current);
        }
      }
    })
  ).current;

  const showStatusPicker = (item) => {
    Alert.alert(
      item.name,
      'Pilih kondisi komponen:',
      [
        { text: 'Batal', style: 'cancel' },
        { text: '✓ Baik', onPress: () => onFunctionalChangeMobile(item.id, 'status', 'OK') },
        { text: '⚠ Butuh Perbaikan', style: 'destructive', onPress: () => onFunctionalChangeMobile(item.id, 'status', 'Defect') },
      ]
    );
  };

  if (!selectedTicket) {
    return (
      <View style={globalStyles.card}>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <Text style={globalStyles.cardTitle}>Pilih Kendaraan Terlebih Dahulu</Text>
          <Text style={{ color: '#64748b', textAlign: 'center', marginVertical: 10 }}>
            Silakan buka tab Daftar Tamu lalu klik "Mulai WAB" pada kendaraan yang akan diservis.
          </Text>
          <TouchableOpacity style={globalStyles.button} onPress={onNavigateToGuestList}>
            <Text style={globalStyles.buttonText}>Buka Daftar Tamu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const formattedFrameNum = frameIndex.toString().padStart(2, '0');

  return (
    <View style={globalStyles.card}>

      <Damage360Modal
        visible={showDamageModal}
        onClose={() => setShowDamageModal(false)}
        damageType={damageType}
        setDamageType={setDamageType}
        severity={severity}
        setSeverity={setSeverity}
        damageNotes={damageNotes}
        setDamageNotes={setDamageNotes}
        damagePhoto={damagePhoto}
        setDamagePhoto={setDamagePhoto}
        isEditing={isEditingDamage}
        onSave={() => {
          onSaveDamageItem();
          setShowDamageModal(false);
        }}
      />

      {/* 360 FULL-SCREEN MODAL */}
      <Inspection360Modal
        visible={show360Modal}
        onClose={() => setShow360Modal(false)}
        frameIndex={frameIndex}
        setFrameIndex={setFrameIndex}
        damages={damages}
        currentAssetBase={currentAssetBase}
        assetPortIndex={assetPortIndex}
        setAssetPortIndex={setAssetPortIndex}
        assetPorts={assetPorts}
        onCarImageTouch={onCarImageTouch}
        showDamageModal={showDamageModal}
        setShowDamageModal={setShowDamageModal}
        damageType={damageType}
        setDamageType={setDamageType}
        severity={severity}
        setSeverity={setSeverity}
        damageNotes={damageNotes}
        setDamageNotes={setDamageNotes}
        damagePhoto={damagePhoto}
        setDamagePhoto={setDamagePhoto}
        isEditingDamage={isEditingDamage}
        onEditDamageItem={onEditDamageItem}
        onSaveDamageItem={onSaveDamageItem}
        onDeleteDamageItem={onDeleteDamageItem}
      />

      {/* ELEGANT WHITE iOS SEGMENTED STEPPER BAR */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 5,
        borderRadius: 16,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        alignItems: 'center'
      }}>
        {[1, 2, 3, 4, 5].map((step, idx) => {
          const isActive = wabStep === step;
          const showLeftDivider = idx > 0 && !isActive && (wabStep !== step - 1);
          return (
            <React.Fragment key={step}>
              {showLeftDivider && (
                <View style={{ width: 1, height: 18, backgroundColor: '#cbd5e1' }} />
              )}
              <TouchableOpacity
                onPress={() => setWabStep(step)}
                activeOpacity={0.8}
                hitSlop={{ top: 8, bottom: 8, left: 2, right: 2 }}
                style={{
                  flex: 1,
                  paddingVertical: isActive ? 10 : 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  backgroundColor: isActive ? '#0f172a' : 'transparent',
                  transform: [{ scale: isActive ? 1.04 : 1 }],
                  shadowColor: isActive ? '#0f172a' : 'transparent',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: isActive ? 0.25 : 0,
                  shadowRadius: 6,
                  elevation: isActive ? 4 : 0,
                }}
              >
                <Text
                  style={{
                    color: isActive ? '#ffffff' : '#64748b',
                    fontWeight: isActive ? 'bold' : '600',
                    fontSize: isActive ? 13 : 11,
                    textAlign: 'center',
                  }}
                >
                  S{step}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>

      {/* STEP 1 */}
      {wabStep === 1 && (
        <View>
          <Text style={globalStyles.cardTitle}>Step 1: Data Pelanggan & Kendaraan</Text>

          <Text style={globalStyles.label}>Nama Pelanggan / Pemilik (Wajib)</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Masukkan nama pemilik / STNK..."
            value={saCustomerName}
            onChangeText={setSaCustomerName}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />

          <Text style={globalStyles.label}>Nama Pengemudi / Pembawa Kendaraan</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Nama pengemudi (jika berbeda)..."
            value={saDriverName}
            onChangeText={setSaDriverName}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />

          <Text style={globalStyles.label}>Nomor Telepon / WhatsApp (Wajib)</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Contoh: 08118207657"
            value={saCustomerPhone}
            onChangeText={setSaCustomerPhone}
            keyboardType="phone-pad"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />

          <Text style={globalStyles.label}>Email Pelanggan</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Contoh: pelanggan@suzuki.co.id"
            value={saCustomerEmail}
            onChangeText={setSaCustomerEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />

          <Text style={globalStyles.label}>No. KTP / Identitas</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Contoh: 3171234567890001"
            value={saIdentityNo}
            onChangeText={setSaIdentityNo}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />

          <Text style={globalStyles.label}>Nomor Polisi (Plat Nomor)</Text>
          <TextInput
            style={[globalStyles.input, { fontWeight: 'bold' }]}
            placeholder="Contoh: B 1697 TYK"
            value={saPoliceRegNo || selectedTicket.licensePlate}
            onChangeText={setSaPoliceRegNo}
            autoCapitalize="characters"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />

          <Text style={globalStyles.label}>Model Kendaraan</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Contoh: SWIFT (CBU)"
            value={saVehicleModel || selectedTicket.vehicleModel}
            onChangeText={setSaVehicleModel}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />

          <Text style={globalStyles.label}>Odometer Saat Ini (KM)</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Contoh: 15000"
            value={saOdometer}
            onChangeText={setSaOdometer}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />

          <Text style={globalStyles.label}>Alamat Tempat Tinggal / Domisili</Text>
          <TextInput
            style={[globalStyles.input, { height: 70, textAlignVertical: 'top' }]}
            placeholder="Alamat domisili pelanggan..."
            multiline
            value={saCustomerAddress}
            onChangeText={setSaCustomerAddress}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />

          <TouchableOpacity style={[globalStyles.button, { marginTop: 16 }]} onPress={() => setWabStep(2)}>
            <Text style={globalStyles.buttonText}>Selanjutnya &rarr;</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 2 */}
      {wabStep === 2 && (
        <View>
          <Text style={globalStyles.cardTitle}>Step 2: Jenis Paket Servis & Keluhan Customer</Text>

          <Text style={globalStyles.label}>Pilih Jenis Paket Servis</Text>
          <View style={{ marginBottom: 12 }}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={[globalStyles.input, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
              onPress={() => setShowServiceTypePicker(true)}
            >
              <Text style={{ fontSize: 14, color: serviceType ? '#0f172a' : '#94a3b8', fontWeight: serviceType ? '600' : '400' }}>
                {serviceType || '-- Pilih Jenis Paket Servis --'}
              </Text>
              <Feather name="chevron-down" size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <Text style={globalStyles.label}>Keluhan / Permintaan Servis Utama</Text>
          <TextInput
            style={[globalStyles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Contoh: Suara mesin agak kasar saat AC dinyalakan..."
            multiline
            value={customerComplaints}
            onChangeText={setCustomerComplaints}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={true}
          />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <TouchableOpacity style={[globalStyles.button, { flex: 1, backgroundColor: '#64748b' }]} onPress={() => setWabStep(1)}>
              <Text style={globalStyles.buttonText}>Kembali</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[globalStyles.button, { flex: 2 }]} onPress={() => setWabStep(3)}>
              <Text style={globalStyles.buttonText}>Selanjutnya &rarr;</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3 */}
      {wabStep === 3 && (
        <View>
          <Text style={globalStyles.cardTitle}>Step 3: Inspeksi Komponen & Fungsi</Text>
          <Text style={[globalStyles.label, { marginTop: 4, marginBottom: 8 }]}>Pemeriksaan Komponen & Fungsi:</Text>
          <View style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', overflow: 'hidden' }}>
            {functionalInspectionsMobile.map((item, idx) => (
              <View
                key={item.id}
                style={{
                  padding: 12,
                  borderBottomWidth: idx === functionalInspectionsMobile.length - 1 ? 0 : 1,
                  borderBottomColor: '#f1f5f9'
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a', flex: 1 }}>
                    {idx + 1}. {item.name}
                  </Text>

                  {/* DIRECT 1-TAP SEGMENTED BUTTONS FOR TABLET & PHONE */}
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity
                      onPress={() => onFunctionalChangeMobile(item.id, 'status', 'OK')}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 6,
                        backgroundColor: item.status === 'OK' ? '#15803d' : '#f1f5f9',
                        borderWidth: 1,
                        borderColor: item.status === 'OK' ? '#15803d' : '#cbd5e1',
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: 'bold', color: item.status === 'OK' ? '#ffffff' : '#475569' }}>
                        ✓ Baik
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => onFunctionalChangeMobile(item.id, 'status', 'Defect')}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 6,
                        backgroundColor: item.status === 'Defect' ? '#be123c' : '#f1f5f9',
                        borderWidth: 1,
                        borderColor: item.status === 'Defect' ? '#be123c' : '#cbd5e1',
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: 'bold', color: item.status === 'Defect' ? '#ffffff' : '#475569' }}>
                        ⚠ Perbaikan
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TextInput
                  style={{ height: 32, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, paddingHorizontal: 8, fontSize: 12, color: '#0f172a', backgroundColor: '#f8fafc' }}
                  placeholder="Catatan (opsional)..."
                  value={item.notes}
                  onChangeText={(text) => onFunctionalChangeMobile(item.id, 'notes', text)}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={true}
                />
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <TouchableOpacity style={[globalStyles.button, { flex: 1, backgroundColor: '#64748b' }]} onPress={() => setWabStep(2)}>
              <Text style={globalStyles.buttonText}>Kembali</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[globalStyles.button, { flex: 2 }]} onPress={() => setWabStep(4)}>
              <Text style={globalStyles.buttonText}>Selanjutnya &rarr;</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 4 */}
      {wabStep === 4 && (
        <View>
          <Text style={globalStyles.cardTitle}>Step 4: Inspeksi Bodi 360°</Text>

          {/* ── INSPEKSI 360° PREVIEW ── */}
          <View style={{ marginBottom: 14 }}>
            {/* ANGLE CHIPS */}
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
              {[
                { label: 'Depan 0°', frame: 1 },
                { label: 'Kanan 90°', frame: 9 },
                { label: 'Belakang 180°', frame: 18 },
                { label: 'Kiri 270°', frame: 27 },
              ].map(btn => (
                <TouchableOpacity
                  key={btn.frame}
                  style={{
                    flex: 1,
                    paddingVertical: 6,
                    paddingHorizontal: 4,
                    borderRadius: 6,
                    alignItems: 'center',
                    backgroundColor: frameIndex === btn.frame ? COLORS.primary : '#ffffff',
                    borderWidth: 1,
                    borderColor: frameIndex === btn.frame ? COLORS.primary : '#cbd5e1'
                  }}
                  onPress={() => setFrameIndex(btn.frame)}
                >
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{ fontSize: 10, fontWeight: 'bold', color: frameIndex === btn.frame ? '#ffffff' : '#334155' }}
                  >
                    {btn.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* PREVIEW IMAGE WITH SWIPE (PRE-MOUNTED FOR FLICKER-FREE SWIPING) */}
            <View
              {...panResponder360.panHandlers}
              onLayout={handleContainerLayout}
              style={{ width: '100%', height: 180, backgroundColor: '#f8fafc', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#cbd5e1', position: 'relative' }}
            >
              {Array.from({ length: 36 }, (_, i) => i + 1).map(num => {
                const fNum = num.toString().padStart(2, '0');
                const isCurrent = num === frameIndex;
                return (
                  <Image
                    key={num}
                    source={{ uri: `${currentAssetBase}/xl7/${fNum}.jpg` }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                      opacity: isCurrent ? 1 : 0,
                    }}
                    onError={() => {
                      if (assetPortIndex < assetPorts.length - 1) setAssetPortIndex(prev => prev + 1);
                    }}
                  />
                );
              })}

              {damages.filter(d => d.frame === frameIndex).map(d => {
                const dotColor = d.severity === 'High' ? '#be123c' : d.severity === 'Medium' ? '#d97706' : '#15803d';
                return (
                  <View
                    key={d.id}
                    style={{
                      position: 'absolute',
                      left: `${Math.max(6, Math.min(94, d.x))}%`,
                      top: `${Math.max(6, Math.min(94, d.y))}%`,
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: dotColor,
                      borderWidth: 2,
                      borderColor: '#ffffff',
                      marginLeft: -8,
                      marginTop: -8,
                      elevation: 5,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.35,
                      shadowRadius: 3,
                      zIndex: 99,
                      justify: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#ffffff' }} />
                  </View>
                );
              })}
              <View style={{ position: 'absolute', bottom: 6, left: 6, backgroundColor: 'rgba(15,23,42,0.8)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, zIndex: 10 }}>
                <Text style={{ color: 'white', fontSize: 10 }}>{Math.round((frameIndex / 36) * 360)}°</Text>
              </View>
            </View>

            {/* OPEN FULLSCREEN BUTTON - PERFECTLY CENTERED */}
            <TouchableOpacity
              onPress={handleOpen360Modal}
              style={{
                marginTop: 10,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 6,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                justify: 'center',
                width: '100%',
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 13, textAlign: 'center' }}>
                Inspeksi Bodi
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── DAFTAR TITIK KERUSAKAN DICATAT (MAKSIMAL ~3 ITEM KELIHATAN, SISANYA SCROLL) ── */}
          <View style={{ marginBottom: 16 }}>
            <Text style={[globalStyles.label, { marginTop: 0, marginBottom: 6 }]}>
              Titik Kerusakan Dicatat ({damages.length}):
            </Text>
            <View style={{ backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', padding: 10 }}>
              {damages.length === 0 ? (
                <Text style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
                  Belum ada titik kerusakan fisik yang ditandai.
                </Text>
              ) : (
                <ScrollView nestedScrollEnabled style={{ maxHeight: 125 }}>
                  {damages.map(d => {
                    const dotColor = d.severity === 'High' ? '#be123c' : d.severity === 'Medium' ? '#d97706' : '#15803d';
                    return (
                      <View
                        key={d.id}
                        style={{
                          flexDirection: 'row',
                          justify: 'space-between',
                          alignItems: 'center',
                          paddingVertical: 6,
                          paddingHorizontal: 4,
                          borderBottomWidth: 1,
                          borderBottomColor: '#f1f5f9',
                          gap: 4,
                          backgroundColor: 'transparent',
                          borderRadius: 4,
                        }}
                      >
                        {/* ROW TAP -> SHOW/POINT TO THE FRAME ANGLE ON CAR IMAGE */}
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => setFrameIndex(d.frame)}
                          style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                        >
                          <View style={{ flex: 1, paddingRight: 6 }}>
                            <Text style={{ fontSize: 12, fontWeight: '600', color: '#0f172a' }}>
                              <Text style={{ color: dotColor, fontWeight: 'bold' }}>● </Text>
                              Frame {d.frame} ({Math.round((d.frame / 36) * 360)}°): {d.damageType}
                            </Text>
                            {d.notes ? (
                              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 1 }} numberOfLines={1}>
                                {d.notes}
                              </Text>
                            ) : null}
                          </View>
                          <Text style={{
                            fontSize: 11,
                            fontWeight: 'bold',
                            color: dotColor,
                            marginRight: 4,
                          }}>
                            {d.severity || 'Low'}
                          </Text>
                        </TouchableOpacity>

                        {/* PHOTO EVIDENCE BADGE BUTTON */}
                        {d.photoUri ? (
                          <TouchableOpacity
                            onPress={() => setSelectedEvidencePhoto(d.photoUri)}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 3,
                              backgroundColor: '#eff6ff',
                              paddingHorizontal: 6,
                              paddingVertical: 3,
                              borderRadius: 4,
                              borderWidth: 1,
                              borderColor: '#bfdbfe',
                            }}
                          >
                            <Feather name="camera" size={11} color="#0284c7" />
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#0284c7' }}>Foto</Text>
                          </TouchableOpacity>
                        ) : null}

                        {/* EDIT DAMAGE BUTTON -> OPENS POPUP EDIT MODAL */}
                        {onEditDamageItem && (
                          <TouchableOpacity
                            onPress={() => onEditDamageItem(d)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={{
                              paddingHorizontal: 5,
                              paddingVertical: 4,
                              alignItems: 'center',
                              justify: 'center',
                            }}
                          >
                            <Feather name="edit-2" size={13} color="#0054a6" />
                          </TouchableOpacity>
                        )}

                        {/* CLEAN X BUTTON FOR DELETION WITH ALERT CONFIRMATION */}
                        {onDeleteDamageItem && (
                          <TouchableOpacity
                            onPress={() => onDeleteDamageItem(d)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            style={{
                              paddingHorizontal: 5,
                              paddingVertical: 4,
                              alignItems: 'center',
                              justify: 'center',
                            }}
                          >
                            <Text style={{ color: '#be123c', fontSize: 14, fontWeight: 'bold' }}>✕</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <TouchableOpacity style={[globalStyles.button, { flex: 1, backgroundColor: '#64748b' }]} onPress={() => setWabStep(3)}>
              <Text style={globalStyles.buttonText}>Kembali</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[globalStyles.button, { flex: 2 }]} onPress={() => setWabStep(5)}>
              <Text style={globalStyles.buttonText}>Selanjutnya &rarr;</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 5 */}
      {wabStep === 5 && (
        <View>
          <Text style={globalStyles.cardTitle}>Step 5: Ringkasan Workorder & Konfirmasi</Text>

          {/* SUMMARY HEADER CARD */}
          <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', padding: 12, marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 6, marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 'bold' }}>Nomor Antrian:</Text>
              <Text style={{ fontSize: 13, color: '#0f172a', fontWeight: 'bold' }}>{selectedTicket?.queueNumber || 'Non-Service'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 6, marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 'bold' }}>Nama Pelanggan:</Text>
              <Text style={{ fontSize: 12, color: '#0f172a', fontWeight: '600' }}>{saCustomerName || '-'}</Text>
            </View>
            {saDriverName ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 6, marginBottom: 6 }}>
                <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 'bold' }}>Nama Pengemudi:</Text>
                <Text style={{ fontSize: 12, color: '#0f172a', fontWeight: '600' }}>{saDriverName}</Text>
              </View>
            ) : null}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 6, marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 'bold' }}>No. Telepon / WA:</Text>
              <Text style={{ fontSize: 12, color: '#0f172a', fontWeight: '600' }}>{saCustomerPhone || '-'}</Text>
            </View>
            {saCustomerEmail ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 6, marginBottom: 6 }}>
                <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 'bold' }}>Email:</Text>
                <Text style={{ fontSize: 12, color: '#0f172a', fontWeight: '600' }}>{saCustomerEmail}</Text>
              </View>
            ) : null}
            {saIdentityNo ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 6, marginBottom: 6 }}>
                <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 'bold' }}>No. KTP:</Text>
                <Text style={{ fontSize: 12, color: '#0f172a', fontWeight: '600' }}>{saIdentityNo}</Text>
              </View>
            ) : null}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 6, marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 'bold' }}>Nomor Polisi:</Text>
              <Text style={{ fontSize: 12, color: '#0f172a', fontWeight: 'bold' }}>{saPoliceRegNo || selectedTicket?.licensePlate || '-'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 6, marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 'bold' }}>Model Kendaraan:</Text>
              <Text style={{ fontSize: 12, color: '#0f172a', fontWeight: '600' }}>{saVehicleModel || selectedTicket?.vehicleModel || '-'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 6, marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 'bold' }}>Odometer:</Text>
              <Text style={{ fontSize: 12, color: '#0f172a', fontWeight: '600' }}>{saOdometer ? `${Number(saOdometer).toLocaleString('id-ID')} KM` : '-'}</Text>
            </View>
            {saCustomerAddress ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 6, marginBottom: 6 }}>
                <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 'bold' }}>Alamat:</Text>
                <Text style={{ fontSize: 12, color: '#0f172a', fontWeight: '600' }}>{saCustomerAddress}</Text>
              </View>
            ) : null}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 2 }}>
              <Text style={{ fontSize: 12, color: '#64748b', fontWeight: 'bold' }}>Jenis Servis:</Text>
              <Text style={{ fontSize: 12, color: '#0054a6', fontWeight: 'bold' }}>{serviceType}</Text>
            </View>
          </View>

          {/* 1. TITIK KERUSAKAN BODI */}
          <Text style={globalStyles.label}>Catatan Kerusakan Bodi ({damages.length} Titik):</Text>
          <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', padding: 10, marginBottom: 14 }}>
            {damages.length === 0 ? (
              <Text style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', padding: 4 }}>Kondisi bodi luar mulus, tidak ada kerusakan tercatat.</Text>
            ) : (
              damages.map((d, idx) => (
                <View key={d.id || idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: idx === damages.length - 1 ? 0 : 1, borderBottomColor: '#f1f5f9' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0f172a' }}>
                      {d.damageType || d.type || 'Scratch'} &bull; Frame {d.frame || 1}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{d.notes || 'Catatan bodi'}</Text>
                  </View>
                  <View style={{ backgroundColor: (d.severity === 'High' || d.severity === 'Berat') ? '#fef2f2' : '#f0fdf4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: (d.severity === 'High' || d.severity === 'Berat') ? '#fca5a5' : '#86efac' }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: (d.severity === 'High' || d.severity === 'Berat') ? '#dc2626' : '#16a34a' }}>
                      {d.severity || 'Low'}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* 2. PEMERIKSAAN KOMPONEN & FUNGSI */}
          <Text style={globalStyles.label}>Pemeriksaan Komponen & Fungsi ({functionalInspectionsMobile ? functionalInspectionsMobile.length : 0} Item):</Text>
          <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', padding: 10, marginBottom: 14 }}>
            {(!functionalInspectionsMobile || functionalInspectionsMobile.length === 0) ? (
              <Text style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', padding: 4 }}>Pemeriksaan fungsional standar OK.</Text>
            ) : (
              functionalInspectionsMobile.map((item, idx) => (
                <View key={item.id || idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5, borderBottomWidth: idx === functionalInspectionsMobile.length - 1 ? 0 : 1, borderBottomColor: '#f1f5f9' }}>
                  <Text style={{ fontSize: 11.5, color: '#334155', fontWeight: '500' }}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Feather
                      name={item.status === 'OK' ? 'check-circle' : 'alert-circle'}
                      size={12}
                      color={item.status === 'OK' ? '#16a34a' : '#dc2626'}
                    />
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: item.status === 'OK' ? '#16a34a' : '#dc2626' }}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* 3. DUAL DIGITAL SIGNATURES (SA & CUSTOMER) */}
          <Text style={globalStyles.label}>Pengesahan & Tanda Tangan Digital:</Text>

          {/* TTD SA */}
          <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', padding: 12, marginBottom: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#0f172a' }}>1. Tanda Tangan SA (Service Advisor)</Text>
            <Text style={{ fontSize: 11, color: hasSaSigned ? '#16a34a' : '#64748b', fontWeight: '600', marginTop: 2, marginBottom: hasSaSigned ? 6 : 10 }}>
              {hasSaSigned ? '✓ TTD SA Terekam' : 'Belum Ditandatangani SA'}
            </Text>
            {hasSaSigned && (
              <View style={{ height: 110, backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1.5, borderColor: '#0f172a', position: 'relative', overflow: 'hidden', marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ position: 'absolute', top: 4, left: 8, fontSize: 9, color: '#94a3b8', fontStyle: 'italic', zIndex: 10 }}>Hasil TTD SA</Text>
                {saSignaturePaths && saSignaturePaths.length > 0 ? (
                  saSignaturePaths.map((path, pIdx) =>
                    path.map((pt, idx) => {
                      if (idx === 0) return null;
                      const prev = path[idx - 1];
                      const dx = pt.x - prev.x;
                      const dy = pt.y - prev.y;
                      const length = Math.sqrt(dx * dx + dy * dy);
                      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                      return (
                        <View
                          key={`sa-${pIdx}-${idx}`}
                          style={{
                            position: 'absolute',
                            left: prev.x * 0.7,
                            top: prev.y * 0.5,
                            width: length * 0.7,
                            height: 2,
                            backgroundColor: '#0f172a',
                            transformOrigin: '0% 50%',
                            transform: [{ rotate: `${angle}deg` }]
                          }}
                        />
                      );
                    })
                  )
                ) : (
                  <Text style={{ fontSize: 16, fontWeight: 'bold', fontStyle: 'italic', color: '#0f172a' }}>
                    Service Advisor
                  </Text>
                )}
              </View>
            )}
            <TouchableOpacity
              style={{ backgroundColor: hasSaSigned ? '#059669' : COLORS.primary, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6, alignItems: 'center' }}
              onPress={onOpenSaSignatureModal}
            >
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                {hasSaSigned ? 'Ubah TTD SA' : 'Tanda Tangan SA'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* TTD CUSTOMER */}
          <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', padding: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#0f172a' }}>2. Tanda Tangan Pelanggan (Customer)</Text>
            <Text style={{ fontSize: 11, color: hasCustomerSigned ? '#16a34a' : '#64748b', fontWeight: '600', marginTop: 2, marginBottom: hasCustomerSigned ? 6 : 10 }}>
              {hasCustomerSigned ? '✓ TTD Customer Terekam' : 'Belum Ditandatangani Customer'}
            </Text>
            {hasCustomerSigned && (
              <View style={{ height: 110, backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1.5, borderColor: '#0f172a', position: 'relative', overflow: 'hidden', marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ position: 'absolute', top: 4, left: 8, fontSize: 9, color: '#94a3b8', fontStyle: 'italic', zIndex: 10 }}>Hasil TTD Pelanggan</Text>
                {customerSignaturePaths && customerSignaturePaths.length > 0 ? (
                  customerSignaturePaths.map((path, pIdx) =>
                    path.map((pt, idx) => {
                      if (idx === 0) return null;
                      const prev = path[idx - 1];
                      const dx = pt.x - prev.x;
                      const dy = pt.y - prev.y;
                      const length = Math.sqrt(dx * dx + dy * dy);
                      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                      return (
                        <View
                          key={`cust-${pIdx}-${idx}`}
                          style={{
                            position: 'absolute',
                            left: prev.x * 0.7,
                            top: prev.y * 0.5,
                            width: length * 0.7,
                            height: 2,
                            backgroundColor: '#0f172a',
                            transformOrigin: '0% 50%',
                            transform: [{ rotate: `${angle}deg` }]
                          }}
                        />
                      );
                    })
                  )
                ) : (
                  <Text style={{ fontSize: 16, fontWeight: 'bold', fontStyle: 'italic', color: '#0f172a' }}>
                    {saCustomerName || 'Pelanggan Suzuki'}
                  </Text>
                )}
              </View>
            )}
            <TouchableOpacity
              style={{ backgroundColor: hasCustomerSigned ? '#059669' : COLORS.primary, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6, alignItems: 'center' }}
              onPress={onOpenCustomerSignatureModal}
            >
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                {hasCustomerSigned ? 'Ubah TTD Customer' : 'Tanda Tangan Customer'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* SUBMIT BUTTONS */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[globalStyles.button, { flex: 1, backgroundColor: '#64748b', marginTop: 0 }]} onPress={() => setWabStep(4)}>
              <Text style={globalStyles.buttonText}>Kembali</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[globalStyles.button, { flex: 2, backgroundColor: COLORS.primary, marginTop: 0 }]} onPress={onFinalizeWab}>
              <Text style={globalStyles.buttonText}>Submit WAB</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* HIGH-RES EVIDENCE PHOTO PREVIEW OVERLAY */}
      {selectedEvidencePhoto ? (
        <Modal
          visible={!!selectedEvidencePhoto}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedEvidencePhoto(null)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <View style={{ width: '100%', maxWidth: 360, backgroundColor: '#ffffff', borderRadius: 14, overflow: 'hidden', padding: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0f172a' }}>Bukti Foto Kerusakan (Evidence)</Text>
                <TouchableOpacity onPress={() => setSelectedEvidencePhoto(null)} style={{ padding: 4 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#64748b' }}>✕</Text>
                </TouchableOpacity>
              </View>
              <Image
                source={{ uri: selectedEvidencePhoto }}
                style={{ width: '100%', height: 260, borderRadius: 8, resizeMode: 'cover', backgroundColor: '#000000' }}
              />
            </View>
          </View>
        </Modal>
      ) : null}

      {/* SERVICE TYPE DROPDOWN PICKER MODAL */}
      <Modal
        visible={showServiceTypePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowServiceTypePicker(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 }}
          onPress={() => setShowServiceTypePicker(false)}
        >
          <TouchableOpacity activeOpacity={1} style={{ width: '100%', maxWidth: 360, backgroundColor: '#ffffff', borderRadius: 14, padding: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 }}>Pilih Jenis Paket Servis</Text>
            {[
              'Paket Servis Periodic (Berkala)',
              'Paket 10.000 KM',
              'Paket 20.000 KM',
              'Paket 40.000 KM',
              'Light Repair (Perbaikan Ringan)',
              'General Repair (Perbaikan Umum)',
              'Body & Paint (Perbaikan Bodi)',
              'Safety Check & Inspection',
            ].map(type => (
              <TouchableOpacity
                key={type}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: serviceType === type ? '#eff6ff' : '#f8fafc',
                  borderWidth: 1,
                  borderColor: serviceType === type ? '#0054a6' : '#e2e8f0',
                  marginBottom: 6,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onPress={() => {
                  setServiceType(type);
                  setShowServiceTypePicker(false);
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: serviceType === type ? 'bold' : '500', color: serviceType === type ? '#0054a6' : '#334155' }}>
                  {type}
                </Text>
                {serviceType === type && <Feather name="check" size={16} color="#0054a6" />}
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}
