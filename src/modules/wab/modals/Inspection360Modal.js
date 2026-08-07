import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, Modal, Image, TouchableOpacity,
  PanResponder, StatusBar, Dimensions, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../../theme/theme';
import Damage360Modal from './Damage360Modal';

const { width: SCREEN_W } = Dimensions.get('window');

export default function Inspection360Modal({
  visible,
  onClose,
  frameIndex,
  setFrameIndex,
  damages,
  currentAssetBase,
  assetPortIndex,
  setAssetPortIndex,
  assetPorts,
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
  const [selectedEvidencePhoto, setSelectedEvidencePhoto] = useState(null);
  const dragStartXRef = useRef(0);
  const startFrameRef = useRef(1);
  const frameIndexRef = useRef(frameIndex);
  const containerSizeRef = useRef({ w: SCREEN_W - 34, h: 260 });

  useEffect(() => {
    frameIndexRef.current = frameIndex;
  }, [frameIndex]);

  const handleContainerLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      containerSizeRef.current = { w: width, h: height };
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        dragStartXRef.current = gestureState.x0;
        startFrameRef.current = frameIndexRef.current;
      },
      onPanResponderMove: (evt, gestureState) => {
        const pixelsPerFrame = 6;
        const framesToMove = Math.floor(gestureState.dx / pixelsPerFrame);
        let newFrame = (startFrameRef.current - framesToMove) % 36;
        if (newFrame <= 0) newFrame += 36;
        setFrameIndex(newFrame);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) < 8 && Math.abs(gestureState.dy) < 8) {
          if (onCarImageTouch) {
            onCarImageTouch(evt, containerSizeRef.current.w, containerSizeRef.current.h, frameIndexRef.current);
          }
        }
      },
    })
  ).current;

  const handleClose = () => {
    if (setShowDamageModal) setShowDamageModal(false);
    if (onClose) onClose();
  };

  const angleDeg = Math.round((frameIndex / 36) * 360);

  const ANGLE_CHIPS = [
    { label: 'Depan 0°', frame: 1 },
    { label: 'Kanan 90°', frame: 9 },
    { label: 'Belakang 180°', frame: 18 },
    { label: 'Kiri 270°', frame: 27 },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent={false}
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc', position: 'relative' }}>
        
        {/* TOP HEADER */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justify: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary }}>
              Inspeksi 360° Bodi Kendaraan
            </Text>
            <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
              Rotasi: {angleDeg}° — Frame {frameIndex}/36
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              alignItems: 'center',
              justify: 'center',
            }}
          >
            <Text style={{ color: '#334155', fontWeight: 'bold', fontSize: 20 }}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* MAIN CONTAINER */}
        <View style={{ flex: 1, padding: 16, justifyContent: 'space-between' }}>

          {/* QUICK ANGLE CHIPS */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 6 }}>
            {ANGLE_CHIPS.map(btn => {
              const isActive = frameIndex === btn.frame;
              return (
                <TouchableOpacity
                  key={btn.frame}
                  onPress={() => setFrameIndex(btn.frame)}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 6,
                    alignItems: 'center',
                    backgroundColor: isActive ? COLORS.primary : '#ffffff',
                    borderWidth: 1,
                    borderColor: isActive ? COLORS.primary : '#cbd5e1',
                  }}
                >
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      color: isActive ? '#ffffff' : '#334155',
                    }}
                  >
                    {btn.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{
            flex: 1,
            marginVertical: 12,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#cbd5e1',
            overflow: 'hidden',
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
            position: 'relative',
          }}>
            <View
              {...panResponder.panHandlers}
              onLayout={handleContainerLayout}
              style={{
                flex: 1,
                width: '100%',
                height: 260,
                justify: 'center',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                position: 'relative',
              }}
            >
              {/* STACKED PRE-MOUNTED 36 FRAMES FOR SMOOTH 60FPS SWIPING WITHOUT FLICKER */}
              {Array.from({ length: 36 }, (_, i) => i + 1).map(num => {
                const fNum = num.toString().padStart(2, '0');
                const isCurrent = num === frameIndex;
                return (
                  <Image
                    key={num}
                    source={{ uri: `${currentAssetBase}/xl7/${fNum}.jpg` }}
                    style={{
                      position: 'absolute',
                      width: SCREEN_W - 34,
                      height: '85%',
                      resizeMode: 'contain',
                      opacity: isCurrent ? 1 : 0,
                    }}
                    onError={() => {
                      if (assetPortIndex < assetPorts.length - 1) {
                        setAssetPortIndex(prev => prev + 1);
                      }
                    }}
                  />
                );
              })}

              {/* DAMAGE HOTSPOT PINS - CLEAN CIRCULAR SEVERITY DOTS */}
              {damages.filter(d => d.frame === frameIndex).map(d => {
                const dotColor = d.severity === 'High' ? '#be123c' : d.severity === 'Medium' ? '#d97706' : '#15803d';
                return (
                  <View
                    key={d.id}
                    style={{
                      position: 'absolute',
                      left: `${Math.max(6, Math.min(94, d.x))}%`,
                      top: `${Math.max(6, Math.min(94, d.y))}%`,
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: dotColor,
                      borderWidth: 2,
                      borderColor: '#ffffff',
                      marginLeft: -9,
                      marginTop: -9,
                      elevation: 6,
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
            </View>
          </View>

          {/* LIST OF RECORDED DAMAGE HOTSPOTS */}
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#cbd5e1',
            padding: 12,
            maxHeight: 160,
          }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: COLORS.primary, marginBottom: 8 }}>
              Titik Kerusakan Dicatat ({damages.length})
            </Text>
            {damages.length === 0 ? (
              <Text style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
                Belum ada titik kerusakan yang ditandai pada bodi mobil.
              </Text>
            ) : (
              <ScrollView nestedScrollEnabled style={{ maxHeight: 110 }}>
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
                        borderBottomWidth: 1,
                        borderBottomColor: '#f1f5f9',
                        gap: 4,
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setFrameIndex(d.frame)}
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                      >
                        <View style={{ flex: 1, paddingRight: 6 }}>
                          <Text style={{ fontSize: 12, fontWeight: '600', color: '#0f172a' }} numberOfLines={1}>
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
                          fontSize: 12,
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

                      {/* EDIT DAMAGE BUTTON */}
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

        {/* OVERLAY DAMAGE INPUT MODAL FOR 360 VIEW */}
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

      </SafeAreaView>
    </Modal>
  );
}
