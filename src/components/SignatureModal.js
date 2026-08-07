import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, PanResponder } from 'react-native';

export default function SignatureModal({ visible, onClose, onSave, title, subtitle }) {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  useEffect(() => {
    if (visible) {
      setPaths([]);
      setCurrentPath([]);
    }
  }, [visible, title]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(prev => [...prev, { x: locationX, y: locationY }]);
      },
      onPanResponderRelease: () => {
        setCurrentPath(prevPath => {
          if (prevPath.length > 0) {
            setPaths(allPaths => [...allPaths, prevPath]);
          }
          return [];
        });
      }
    })
  ).current;

  const handleClear = () => {
    setPaths([]);
    setCurrentPath([]);
  };

  const handleSaveSignature = () => {
    const isSigned = paths.length > 0 || currentPath.length > 0;
    if (isSigned) {
      if (onSave) onSave(paths);
    }
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.75)', justifyContent: 'center', padding: 20 }}>
        <View style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#cbd5e1' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 2 }}>
            {title || 'Tanda Tangan Digital'}
          </Text>
          <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
            {subtitle || 'Silakan tanda tangan di dalam area berikut untuk persetujuan WAB.'}
          </Text>

          {/* SIGNATURE CANVAS BOX (PREVENTS SCROLLING) */}
          <View
            {...panResponder.panHandlers}
            style={{
              height: 180,
              backgroundColor: '#ffffff',
              borderWidth: paths.length > 0 ? 2 : 1.5,
              borderColor: paths.length > 0 ? '#0f172a' : '#cbd5e1',
              borderStyle: paths.length > 0 ? 'solid' : 'dashed',
              borderRadius: 8,
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 14
            }}
          >
            {paths.map((path, pIdx) =>
              path.map((pt, idx) => {
                if (idx === 0) return null;
                const prev = path[idx - 1];
                const dx = pt.x - prev.x;
                const dy = pt.y - prev.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                return (
                  <View
                    key={`${pIdx}-${idx}`}
                    style={{
                      position: 'absolute',
                      left: prev.x,
                      top: prev.y,
                      width: length,
                      height: 2.5,
                      backgroundColor: '#0f172a',
                      transformOrigin: '0% 50%',
                      transform: [{ rotate: `${angle}deg` }]
                    }}
                  />
                );
              })
            )}

            {currentPath.map((pt, idx) => {
              if (idx === 0) return null;
              const prev = currentPath[idx - 1];
              const dx = pt.x - prev.x;
              const dy = pt.y - prev.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              return (
                <View
                  key={`curr-${idx}`}
                  style={{
                    position: 'absolute',
                    left: prev.x,
                    top: prev.y,
                    width: length,
                    height: 2.5,
                    backgroundColor: '#0f172a',
                    transformOrigin: '0% 50%',
                    transform: [{ rotate: `${angle}deg` }]
                  }}
                />
              );
            })}

            {paths.length === 0 && currentPath.length === 0 && (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
                <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '500' }}>
                  Area Tanda Tangan Pelanggan
                </Text>
              </View>
            )}
          </View>

          {/* ACTION BUTTONS (HAPUS, BATAL, SIMPAN) */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleClear} style={{ paddingVertical: 6, paddingHorizontal: 10 }}>
              <Text style={{ fontSize: 13, color: '#be123c', fontWeight: 'bold' }}>Hapus</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1' }}
                onPress={onClose}
              >
                <Text style={{ fontSize: 13, color: '#334155', fontWeight: 'bold' }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, backgroundColor: '#0f172a' }}
                onPress={handleSaveSignature}
              >
                <Text style={{ fontSize: 13, color: '#ffffff', fontWeight: 'bold' }}>Simpan TTD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
