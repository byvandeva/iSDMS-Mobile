import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert,
  Modal, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { globalStyles, COLORS } from '../../../config/theme';
import { getPurposeString } from '../../../utils/helpers';

const MOCK_TECHNICIANS = [
  { id: 't1', name: 'Budi Santoso', specialty: 'Mesin & Transmisi' },
  { id: 't2', name: 'Agus Pratama', specialty: 'Elektrikal & AC' },
  { id: 't3', name: 'Dedi Kurniawan', specialty: 'Body & Cat' },
  { id: 't4', name: 'Rudi Hermawan', specialty: 'Rem & Suspensi' },
  { id: 't5', name: 'Wahyu Setiawan', specialty: 'General Service' },
];

const MOCK_FOREMEN = [
  { id: 'f1', name: 'Foreman A' },
  { id: 'f2', name: 'Foreman B' },
  { id: 'f3', name: 'Foreman C' },
];

function pad(n) { return String(n).padStart(2, '0'); }

function formatDateTime(iso) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch { return '-'; }
}

function formatDate(iso) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return `${days[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  } catch { return '-'; }
}

function getDateFromOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function addMinutesToNow(minutes) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

function AssignTechnicianModal({ visible, ticket, onAssign, onClose }) {
  const [selectedTech, setSelectedTech] = useState(null);
  const [stallName, setStallName] = useState('');

  React.useEffect(() => {
    if (visible) { setSelectedTech(null); setStallName(''); }
  }, [visible]);

  const handleAssign = () => {
    if (!selectedTech) { Alert.alert('Perhatian', 'Pilih teknisi terlebih dahulu.'); return; }
    if (!stallName.trim()) { Alert.alert('Perhatian', 'Isi nama stall bengkel.'); return; }
    Alert.alert(
      'Konfirmasi Distribusi',
      `Distribusikan ${ticket?.licensePlate} ke ${selectedTech.name} di ${stallName.trim()}?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Distribusikan', onPress: () => onAssign({ tech: selectedTech, stallName: stallName.trim() }) },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={ms.overlay}
      >
        <View style={ms.sheet}>
          <View style={ms.sheetHeader}>
            <View style={{ flex: 1 }}>
              <Text style={ms.sheetTitle}>Assign Teknisi</Text>
              {ticket && <Text style={ms.sheetSub}>{ticket.licensePlate} · {ticket.vehicleModel}</Text>}
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 16 }}>
            <Text style={[globalStyles.label, { marginTop: 4 }]}>Pilih Teknisi:</Text>
            {MOCK_TECHNICIANS.map(tech => {
              const isSelected = selectedTech?.id === tech.id;
              return (
                <TouchableOpacity key={tech.id} activeOpacity={0.75}
                  style={[ms.techRow, isSelected && ms.techRowActive]}
                  onPress={() => setSelectedTech(tech)}>
                  <View style={[ms.techAvatar, isSelected && { backgroundColor: COLORS.accentBlue }]}>
                    <Text style={[ms.techAvatarText, isSelected && { color: '#fff' }]}>{tech.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[ms.techName, isSelected && { color: COLORS.accentBlue }]}>{tech.name}</Text>
                    <Text style={ms.techSpec}>{tech.specialty}</Text>
                  </View>
                  {isSelected && <Feather name="check-circle" size={18} color={COLORS.accentBlue} />}
                </TouchableOpacity>
              );
            })}

            <Text style={globalStyles.label}>Stall Bengkel:</Text>
            <TextInput style={globalStyles.input} placeholder="Misal: Stall 01" value={stallName} onChangeText={setStallName} />

            <TouchableOpacity style={[globalStyles.button, { backgroundColor: COLORS.accentBlue, marginTop: 18 }]} onPress={handleAssign}>
              <Text style={globalStyles.buttonText}>Assign & Distribusikan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[globalStyles.button, { backgroundColor: '#64748b', marginTop: 8 }]} onPress={onClose}>
              <Text style={globalStyles.buttonText}>Batal</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const DATE_CHIPS = [
  { label: 'Hari ini', offset: 0 },
  { label: '+1 Hari', offset: 1 },
  { label: '+2 Hari', offset: 2 },
  { label: '+3 Hari', offset: 3 },
  { label: '+1 Minggu', offset: 7 },
];

function RecommendationModal({ visible, existingRec, onSave, onClose }) {
  const [description, setDescription] = useState('');
  const [dateOffset, setDateOffset] = useState(1);

  React.useEffect(() => {
    if (visible) {
      setDescription(existingRec?.description || '');
      setDateOffset(1);
    }
  }, [visible, existingRec]);

  const handleSave = () => {
    if (!description.trim()) { Alert.alert('Perhatian', 'Isi deskripsi rekomendasi.'); return; }
    onSave({ description: description.trim(), beforeDate: getDateFromOffset(dateOffset) });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={ms.centeredOverlay}>
        <View style={ms.centeredCard}>
          <Text style={ms.cardTitle}>{existingRec ? '✏ Edit Rekomendasi' : '+ Rekomendasi'}</Text>

          <Text style={globalStyles.label}>Deskripsi:</Text>
          <TextInput
            style={[globalStyles.input, { height: 80, textAlignVertical: 'top', marginBottom: 2 }]}
            placeholder="Contoh: Ganti Ban Depan, Ganti Aki, Flush Radiator..."
            value={description} onChangeText={setDescription}
            multiline numberOfLines={3} autoFocus
          />

          <Text style={globalStyles.label}>Dilakukan Sebelum:</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            {DATE_CHIPS.map(c => (
              <TouchableOpacity key={c.offset}
                style={[ms.chip, dateOffset === c.offset && ms.chipActive]}
                onPress={() => setDateOffset(c.offset)}>
                <Text style={[ms.chipText, dateOffset === c.offset && { color: '#fff' }]}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={ms.dateHint}>→ {formatDate(getDateFromOffset(dateOffset))}</Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
            <TouchableOpacity style={[globalStyles.button, { flex: 1, backgroundColor: '#64748b', marginTop: 0 }]} onPress={onClose}>
              <Text style={globalStyles.buttonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[globalStyles.button, { flex: 2, backgroundColor: COLORS.accentBlue, marginTop: 0 }]} onPress={handleSave}>
              <Text style={globalStyles.buttonText}>{existingRec ? 'Update' : 'Simpan'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function ConfirmDeleteModal({ visible, itemLabel, onConfirm, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={ms.centeredOverlay}>
        <View style={[ms.centeredCard, { maxWidth: 320 }]}>
          <View style={{ alignItems: 'center', marginBottom: 14 }}>
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#ffe4e6', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
              <Feather name="trash-2" size={24} color="#be123c" />
            </View>
            <Text style={[ms.cardTitle, { textAlign: 'center', marginBottom: 4 }]}>Hapus Rekomendasi?</Text>
            <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 18 }}>{itemLabel}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[globalStyles.button, { flex: 1, backgroundColor: '#64748b', marginTop: 0 }]} onPress={onClose}>
              <Text style={globalStyles.buttonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[globalStyles.button, { flex: 1, backgroundColor: '#be123c', marginTop: 0 }]} onPress={onConfirm}>
              <Text style={globalStyles.buttonText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const TIME_CHIPS = [
  { label: '+30m', minutes: 30 },
  { label: '+1j', minutes: 60 },
  { label: '+1.5j', minutes: 90 },
  { label: '+2j', minutes: 120 },
  { label: '+3j', minutes: 180 },
];

function TrackingModal({ visible, onSave, onClose }) {
  const [label, setLabel] = useState('');
  const [selectedMinutes, setSelectedMinutes] = useState(60);

  React.useEffect(() => {
    if (visible) { setLabel(''); setSelectedMinutes(60); }
  }, [visible]);

  const handleSave = () => {
    if (!label.trim()) { Alert.alert('Perhatian', 'Isi keterangan pekerjaan tracking.'); return; }
    onSave({ label: label.trim(), estimatedDoneTime: addMinutesToNow(selectedMinutes) });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={ms.centeredOverlay}>
        <View style={ms.centeredCard}>
          <Text style={ms.cardTitle}>➕ Request Tracking Pekerjaan</Text>
          <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
            Tracking tambahan akan mempengaruhi status di TV Monitor pelanggan.
          </Text>

          <Text style={globalStyles.label}>Keterangan Pekerjaan:</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Contoh: Ganti Radiator, Kuras Minyak Rem..."
            value={label} onChangeText={setLabel} autoFocus
          />

          <Text style={globalStyles.label}>Estimasi Selesai:</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {TIME_CHIPS.map(c => (
              <TouchableOpacity key={c.minutes}
                style={[ms.chip, selectedMinutes === c.minutes && ms.chipActive]}
                onPress={() => setSelectedMinutes(c.minutes)}>
                <Text style={[ms.chipText, selectedMinutes === c.minutes && { color: '#fff' }]}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={ms.dateHint}>→ Est. selesai: {formatDateTime(addMinutesToNow(selectedMinutes))}</Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
            <TouchableOpacity style={[globalStyles.button, { flex: 1, backgroundColor: '#64748b', marginTop: 0 }]} onPress={onClose}>
              <Text style={globalStyles.buttonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[globalStyles.button, { flex: 2, backgroundColor: '#15803d', marginTop: 0 }]} onPress={handleSave}>
              <Text style={globalStyles.buttonText}>Tambah Tracking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function DelegateModal({ visible, ticket, job, currentForeman, onChangeTechnician, onDelegateForeman, onClose }) {
  const [subTab, setSubTab] = useState('tech');
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedForeman, setSelectedForeman] = useState(null);
  const [stallName, setStallName] = useState('');

  React.useEffect(() => {
    if (visible) {
      setSubTab('tech');
      setSelectedTech(null);
      setSelectedForeman(null);
      setStallName(job?.assignedTechnician?.stallName || '');
    }
  }, [visible, job]);

  const currentTechId = job?.assignedTechnician?.id;
  const availableTechs = MOCK_TECHNICIANS.filter(t => t.id !== currentTechId);
  const availableForemen = MOCK_FOREMEN.filter(f => f.name !== currentForeman);

  const handleChangeTech = () => {
    if (!selectedTech) { Alert.alert('Perhatian', 'Pilih teknisi baru.'); return; }
    if (!stallName.trim()) { Alert.alert('Perhatian', 'Isi nama stall.'); return; }
    Alert.alert(
      'Ganti Teknisi?',
      `Pindahkan ke ${selectedTech.name} (${selectedTech.specialty})?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Konfirmasi', onPress: () => onChangeTechnician({ tech: selectedTech, stallName: stallName.trim() }) },
      ]
    );
  };

  const handleDelegateForeman = () => {
    if (!selectedForeman) { Alert.alert('Perhatian', 'Pilih Foreman tujuan.'); return; }
    Alert.alert(
      'Pindahkan Tugas?',
      `Delegasikan ke ${selectedForeman.name}?\n\nPekerjaan akan masuk ke antrian "Belum Terdistribusi" ${selectedForeman.name} dan teknisi harus di-assign ulang.`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Konfirmasi', onPress: () => onDelegateForeman(selectedForeman) },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={ms.overlay}
      >
        <View style={ms.sheet}>
          <View style={ms.sheetHeader}>
            <View style={{ flex: 1 }}>
              <Text style={ms.sheetTitle}>Pindahkan Tugas</Text>
              {ticket && <Text style={ms.sheetSub}>{ticket.licensePlate} · {ticket.vehicleModel}</Text>}
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
            <TouchableOpacity style={[ms.subTabBtn, subTab === 'tech' && ms.subTabActive]} onPress={() => setSubTab('tech')}>
              <Feather name="user" size={13} color={subTab === 'tech' ? '#fff' : '#64748b'} />
              <Text style={[ms.subTabText, subTab === 'tech' && { color: '#fff' }]}>Ganti Teknisi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[ms.subTabBtn, subTab === 'foreman' && { ...ms.subTabActive, backgroundColor: '#7c3aed', borderColor: '#7c3aed' }]} onPress={() => setSubTab('foreman')}>
              <Feather name="users" size={13} color={subTab === 'foreman' ? '#fff' : '#64748b'} />
              <Text style={[ms.subTabText, subTab === 'foreman' && { color: '#fff' }]}>Foreman Lain</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 16 }}>
            {subTab === 'tech' ? (
              <>
                {job?.assignedTechnician && (
                  <View style={ms.infoBox}>
                    <Feather name="info" size={13} color="#0054a6" />
                    <Text style={{ fontSize: 12, color: '#0054a6', flex: 1 }}>
                      Teknisi saat ini: <Text style={{ fontWeight: 'bold' }}>{job.assignedTechnician.name}</Text>
                    </Text>
                  </View>
                )}
                <Text style={[globalStyles.label, { marginTop: 8 }]}>Pilih Teknisi Baru:</Text>
                {availableTechs.map(tech => {
                  const isSel = selectedTech?.id === tech.id;
                  return (
                    <TouchableOpacity key={tech.id} activeOpacity={0.75}
                      style={[ms.techRow, isSel && ms.techRowActive]} onPress={() => setSelectedTech(tech)}>
                      <View style={[ms.techAvatar, isSel && { backgroundColor: COLORS.accentBlue }]}>
                        <Text style={[ms.techAvatarText, isSel && { color: '#fff' }]}>{tech.name.charAt(0)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[ms.techName, isSel && { color: COLORS.accentBlue }]}>{tech.name}</Text>
                        <Text style={ms.techSpec}>{tech.specialty}</Text>
                      </View>
                      {isSel && <Feather name="check-circle" size={18} color={COLORS.accentBlue} />}
                    </TouchableOpacity>
                  );
                })}
                <Text style={globalStyles.label}>Stall Bengkel (opsional update):</Text>
                <TextInput style={globalStyles.input} placeholder="Stall 01" value={stallName} onChangeText={setStallName} />
                <TouchableOpacity style={[globalStyles.button, { backgroundColor: COLORS.accentBlue, marginTop: 16 }]} onPress={handleChangeTech}>
                  <Text style={globalStyles.buttonText}>Ganti Teknisi</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={[ms.infoBox, { borderColor: '#ddd6fe', backgroundColor: '#f5f3ff' }]}>
                  <Feather name="alert-circle" size={13} color="#7c3aed" />
                  <Text style={{ fontSize: 12, color: '#5b21b6', flex: 1, lineHeight: 17 }}>
                    Pekerjaan akan masuk ke "Belum Terdistribusi" Foreman tujuan. Foreman penerima wajib assign ulang teknisi dari awal.
                  </Text>
                </View>
                <Text style={[globalStyles.label, { marginTop: 10 }]}>Pilih Foreman Tujuan:</Text>
                {availableForemen.map(fm => {
                  const isSel = selectedForeman?.id === fm.id;
                  return (
                    <TouchableOpacity key={fm.id} activeOpacity={0.75}
                      style={[ms.techRow, isSel && { ...ms.techRowActive, borderColor: '#7c3aed', backgroundColor: '#f5f3ff' }]}
                      onPress={() => setSelectedForeman(fm)}>
                      <View style={[ms.techAvatar, isSel && { backgroundColor: '#7c3aed' }]}>
                        <Feather name="user" size={16} color={isSel ? '#fff' : '#64748b'} />
                      </View>
                      <Text style={[ms.techName, { flex: 1 }, isSel && { color: '#7c3aed' }]}>{fm.name}</Text>
                      {isSel && <Feather name="check-circle" size={18} color="#7c3aed" />}
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity style={[globalStyles.button, { backgroundColor: '#7c3aed', marginTop: 16 }]} onPress={handleDelegateForeman}>
                  <Text style={globalStyles.buttonText}>Pindahkan ke Foreman</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={[globalStyles.button, { backgroundColor: '#94a3b8', marginTop: 8 }]} onPress={onClose}>
              <Text style={globalStyles.buttonText}>Batal</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function MetricCard({ label, value, color, icon }) {
  return (
    <View style={[fs.metricCard, { borderTopColor: color, borderTopWidth: 3 }]}>
      <Feather name={icon} size={15} color={color} style={{ marginBottom: 5 }} />
      <Text style={[fs.metricValue, { color }]}>{value}</Text>
      <Text style={fs.metricLabel}>{label}</Text>
    </View>
  );
}

function JobCard({ ticket, job, isUndistributed, onAssign, onEditRec, onDeleteRec, onAddTracking, onDelegate, onFinishJob }) {
  const [recExpanded, setRecExpanded] = useState(false);
  const [trackExpanded, setTrackExpanded] = useState(false);
  const [damageExpanded, setDamageExpanded] = useState(false);
  const isCompleted = job.status === 'Completed';

  const damages = ticket.wabDamages || ticket.damages || [];
  const inspections = ticket.wabInspections || ticket.functionalInspections || [];
  const odometerVal = ticket.odometer || ticket.saOdometer;
  const complaintsVal = ticket.wabComplaints || ticket.customerComplaints;
  const serviceTypeVal = ticket.wabServiceType || ticket.serviceType || getPurposeString(ticket.arrivalPurpose);

  return (
    <View style={fs.jobCard}>
      {/* CARD HEADER */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={globalStyles.queueBadge}>{ticket.queueNumber || 'Non-Q'}</Text>
        {isUndistributed ? (
          <View style={[fs.pill, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
            <Text style={[fs.pillText, { color: '#0054a6' }]}>Belum Distribusi</Text>
          </View>
        ) : isCompleted ? (
          <View style={[fs.pill, { backgroundColor: '#f0fdf4', borderColor: '#86efac' }]}>
            <Text style={[fs.pillText, { color: '#15803d' }]}>✓ Selesai</Text>
          </View>
        ) : (
          <View style={[fs.pill, { backgroundColor: '#fffbe6', borderColor: '#fef08a' }]}>
            <Text style={[fs.pillText, { color: '#b45309' }]}>Dikerjakan</Text>
          </View>
        )}
      </View>

      {/* VEHICLE & CUSTOMER HEADLINE */}
      <Text style={globalStyles.plateText}>{ticket.licensePlate}</Text>
      <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a', marginTop: 2 }}>
        {ticket.wabCustomerName || ticket.customerName || '-'}
      </Text>

      {/* VEHICLE SUB-DETAILS */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
        <Text style={{ fontSize: 11, color: '#475569', fontWeight: '500' }}>
          {ticket.vehicleModel || ticket.groupCode || '-'}
        </Text>
        {odometerVal ? (
          <Text style={{ fontSize: 11, color: '#475569', fontWeight: '500' }}>
            &bull; {Number(odometerVal).toLocaleString('id-ID')} KM
          </Text>
        ) : null}
        <Text style={{ fontSize: 11, color: '#0054a6', fontWeight: 'bold' }}>
          &bull; {serviceTypeVal}
        </Text>
      </View>

      {/* DELEGATION BADGE */}
      {ticket.delegatedFrom && (
        <View style={fs.delegateBadge}>
          <Feather name="corner-down-right" size={11} color="#64748b" />
          <Text style={fs.delegateText}>Diterima dari: {ticket.delegatedFrom}</Text>
        </View>
      )}

      {/* KELUHAN UTAMA */}
      {complaintsVal ? (
        <View style={fs.complaintBox}>
          <Feather name="message-square" size={12} color="#0054a6" style={{ marginTop: 2 }} />
          <Text style={fs.complaintText} numberOfLines={2}>{complaintsVal}</Text>
        </View>
      ) : null}

      {/* CATATAN KERUSAKAN BODI 360° */}
      {damages.length > 0 && (
        <View style={{ marginTop: 6 }}>
          <TouchableOpacity style={fs.expandRow} onPress={() => setDamageExpanded(v => !v)}>
            <Feather name="alert-triangle" size={12} color="#b45309" />
            <Text style={[fs.expandText, { color: '#b45309' }]}>
              Bodi 360° ({damages.length} Catatan Kerusakan)
            </Text>
            <Feather name={damageExpanded ? 'chevron-up' : 'chevron-down'} size={12} color="#94a3b8" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          {damageExpanded && (
            <View style={{ marginTop: 4, paddingLeft: 4 }}>
              {damages.map((d, idx) => {
                const dotColor = d.severity === 'High' ? '#be123c' : d.severity === 'Medium' ? '#d97706' : '#15803d';
                return (
                  <View key={d.id || idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 6 }}>
                    <Text style={{ color: dotColor, fontWeight: 'bold', fontSize: 12 }}>●</Text>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0f172a', flex: 1 }}>
                      Frame {d.frame || 1}: {d.damageType || d.type || 'Scratch'}
                    </Text>
                    <Text style={{ fontSize: 10, color: '#64748b' }}>{d.notes || '-'}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}

      {/* TECHNICIAN ASSIGNED BADGE */}
      {!isUndistributed && job.assignedTechnician && (
        <View style={fs.techAssigned}>
          <Feather name="tool" size={12} color="#059669" />
          <Text style={fs.techAssignedText}>
            {job.assignedTechnician.stallName} &bull; <Text style={{ fontWeight: 'bold' }}>{job.assignedTechnician.name}</Text>
            <Text style={{ color: '#64748b' }}> ({job.assignedTechnician.specialty})</Text>
          </Text>
        </View>
      )}

      {/* REKOMENDASI LIST */}
      {!isUndistributed && job.recommendations.length > 0 && (
        <View style={{ marginTop: 4 }}>
          <TouchableOpacity style={fs.expandRow} onPress={() => setRecExpanded(v => !v)}>
            <Feather name="file-text" size={12} color="#0054a6" />
            <Text style={[fs.expandText, { color: '#0054a6' }]}>{job.recommendations.length} Rekomendasi</Text>
            <Feather name={recExpanded ? 'chevron-up' : 'chevron-down'} size={12} color="#94a3b8" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          {recExpanded && job.recommendations.map(rec => (
            <View key={rec.id} style={fs.recItem}>
              <View style={{ flex: 1 }}>
                <Text style={fs.recDesc}>{rec.description}</Text>
                <Text style={fs.recDate}>Sebelum: {formatDate(rec.beforeDate)}</Text>
              </View>
              {!isCompleted && (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity onPress={() => onEditRec(rec)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Feather name="edit-2" size={14} color="#0054a6" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDeleteRec(rec)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Feather name="trash-2" size={14} color="#be123c" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* TRACKING PEKERJAAN */}
      {!isUndistributed && job.trackingEntries.length > 0 && (
        <View style={{ marginTop: 4 }}>
          <TouchableOpacity style={fs.expandRow} onPress={() => setTrackExpanded(v => !v)}>
            <Feather name="clock" size={12} color="#d97706" />
            <Text style={[fs.expandText, { color: '#d97706' }]}>{job.trackingEntries.length} Tracking Pekerjaan</Text>
            <Feather name={trackExpanded ? 'chevron-up' : 'chevron-down'} size={12} color="#94a3b8" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          {trackExpanded && job.trackingEntries.map(entry => (
            <View key={entry.id} style={fs.trackItem}>
              <Feather name="circle" size={8} color="#d97706" style={{ marginTop: 3 }} />
              <View style={{ flex: 1 }}>
                <Text style={fs.trackLabel}>{entry.label}</Text>
                <Text style={fs.trackTime}>Est. selesai: {formatDateTime(entry.estimatedDoneTime)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ACTION BUTTONS */}
      {isUndistributed ? (
        <TouchableOpacity style={[globalStyles.actionBtn, { backgroundColor: '#0054a6', flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 }]} onPress={onAssign}>
          <Feather name="user-plus" size={14} color="#fff" />
          <Text style={globalStyles.actionBtnText}>Assign Teknisi & Distribusikan</Text>
        </TouchableOpacity>
      ) : !isCompleted ? (
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <TouchableOpacity
              style={[fs.actionChip, { borderColor: '#0054a6' }]}
              onPress={() => onEditRec(null)}>
              <Feather name="file-text" size={13} color="#0054a6" />
              <Text style={[fs.actionChipText, { color: '#0054a6' }]}>+ Rekomendasi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[fs.actionChip, { borderColor: '#d97706' }]}
              onPress={onAddTracking}>
              <Feather name="plus-circle" size={13} color="#d97706" />
              <Text style={[fs.actionChipText, { color: '#d97706' }]}>+ Tracking</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={[globalStyles.actionBtn, { flex: 1, backgroundColor: '#64748b', marginTop: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 }]} onPress={onDelegate}>
              <Feather name="corner-up-right" size={13} color="#fff" />
              <Text style={globalStyles.actionBtnText}>Pindahkan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[globalStyles.actionBtn, { flex: 1, backgroundColor: '#059669', marginTop: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 }]} onPress={onFinishJob}>
              <Feather name="check-circle" size={13} color="#fff" />
              <Text style={globalStyles.actionBtnText}>Finish Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={fs.completedRow}>
          <Feather name="check-circle" size={16} color="#059669" />
          <Text style={fs.completedText}>Pekerjaan Selesai</Text>
        </View>
      )}
    </View>
  );
}

const DEFAULT_JOB = { assignedTechnician: null, status: 'Undistributed', recommendations: [], trackingEntries: [] };

export default function ForemanScreen({
  tickets = [],
  wabHistory = [],
  foremanCurrentName = 'Foreman A',
  onFinishJob,
  onUpdateTracking,
}) {
  const [activeTab, setActiveTab] = useState('undistributed');
  const [jobs, setJobs] = useState({});
  const [assignModal, setAssignModal] = useState({ visible: false, ticket: null });
  const [recModal, setRecModal] = useState({ visible: false, ticketId: null, existingRec: null });
  const [delRecModal, setDelRecModal] = useState({ visible: false, ticketId: null, rec: null });
  const [trackModal, setTrackModal] = useState({ visible: false, ticketId: null });
  const [delegModal, setDelegModal] = useState({ visible: false, ticketId: null });

  const getJob = useCallback((ticketId) =>
    jobs[ticketId] || { ...DEFAULT_JOB, ticketId },
    [jobs]);

  const updateJob = useCallback((ticketId, updates) => {
    setJobs(prev => ({
      ...prev,
      [ticketId]: { ...(prev[ticketId] || { ...DEFAULT_JOB, ticketId }), ...updates },
    }));
  }, []);

  const eligibleTickets = tickets.filter(t => {
    const s = String(t.status || '');
    return s === 'Inspected' || s === 'WabDone' || s === 'InService' || s === 'ServiceCompleted';
  });

  const undistributedTickets = eligibleTickets.filter(t => getJob(t.ticketId).status === 'Undistributed');
  const distributedTickets = eligibleTickets.filter(t => {
    const js = getJob(t.ticketId).status;
    return js === 'InProgress' || js === 'Completed';
  });
  const inProgressCount = distributedTickets.filter(t => getJob(t.ticketId).status === 'InProgress').length;
  const completedCount = distributedTickets.filter(t => getJob(t.ticketId).status === 'Completed').length;

  const handleAssign = (ticket, { tech, stallName }) => {
    updateJob(ticket.ticketId, { assignedTechnician: { ...tech, stallName }, status: 'InProgress' });
    onUpdateTracking?.({ ticketId: ticket.ticketId, stallName, technicianName: tech.name, foremanRecommendation: '', addExtraMinutes: 0 });
    setAssignModal({ visible: false, ticket: null });
    setActiveTab('distributed');
    Alert.alert('✓ Distribusi Berhasil', `${ticket.licensePlate} → ${tech.name} @ ${stallName}`);
  };

  const handleSaveRec = (ticketId, { description, beforeDate }, existingRec) => {
    const job = getJob(ticketId);
    const recs = existingRec
      ? job.recommendations.map(r => r.id === existingRec.id ? { ...r, description, beforeDate } : r)
      : [...job.recommendations, { id: Date.now().toString(), description, beforeDate, createdAt: new Date().toISOString() }];
    updateJob(ticketId, { recommendations: recs });
    setRecModal({ visible: false, ticketId: null, existingRec: null });
    Alert.alert('✓ Rekomendasi Disimpan', `"${description}"`);
  };

  const handleDeleteRec = (ticketId, rec) => {
    const job = getJob(ticketId);
    updateJob(ticketId, { recommendations: job.recommendations.filter(r => r.id !== rec.id) });
    setDelRecModal({ visible: false, ticketId: null, rec: null });
    Alert.alert('Rekomendasi Dihapus');
  };

  const handleAddTracking = (ticketId, { label, estimatedDoneTime }) => {
    const job = getJob(ticketId);
    const entry = { id: Date.now().toString(), label, estimatedDoneTime, addedAt: new Date().toISOString() };
    updateJob(ticketId, { trackingEntries: [...job.trackingEntries, entry] });
    setTrackModal({ visible: false, ticketId: null });
    Alert.alert('✓ Tracking Dicatat', `"${label}"\nEst. selesai: ${formatDateTime(estimatedDoneTime)}`);
  };

  const handleChangeTech = (ticketId, { tech, stallName }) => {
    updateJob(ticketId, { assignedTechnician: { ...tech, stallName } });
    onUpdateTracking?.({ ticketId, stallName, technicianName: tech.name, foremanRecommendation: '', addExtraMinutes: 0 });
    setDelegModal({ visible: false, ticketId: null });
    Alert.alert('✓ Teknisi Diganti', `Pekerjaan dipindahkan ke ${tech.name}`);
  };

  const handleDelegateForeman = (ticketId, foreman) => {
    updateJob(ticketId, { status: 'Delegated', delegatedTo: foreman.name });
    setDelegModal({ visible: false, ticketId: null });
    Alert.alert('✓ Tugas Didelegasikan', `Berhasil dipindahkan ke ${foreman.name}.\nPekerjaan masuk ke antrian "Belum Terdistribusi" ${foreman.name}.`);
  };

  const handleFinishJob = (ticket) => {
    Alert.alert(
      'Selesaikan Pekerjaan?',
      `Tandai ${ticket.licensePlate} sebagai Selesai Servis?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Selesai', onPress: () => {
            updateJob(ticket.ticketId, { status: 'Completed' });
            onFinishJob?.(ticket.ticketId);
          }
        },
      ]
    );
  };

  const assignTicket = assignModal.ticket;
  const recTicketId = recModal.ticketId;
  const trackTicketId = trackModal.ticketId;
  const delegTicketId = delegModal.ticketId;
  const delegTicket = eligibleTickets.find(t => t.ticketId === delegTicketId) || null;
  const delegJob = delegTicketId ? getJob(delegTicketId) : null;

  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.cardTitle}>Foreman Workshop Board</Text>
      <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
        Masuk sebagai: <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>{foremanCurrentName}</Text>
      </Text>

      <View style={fs.metricsRow}>
        <MetricCard label="Antri" value={undistributedTickets.length} color="#0054a6" icon="inbox" />
        <MetricCard label="Dikerjakan" value={inProgressCount} color="#d97706" icon="tool" />
        <MetricCard label="Selesai" value={completedCount} color="#15803d" icon="check-circle" />
      </View>

      <View style={fs.tabRow}>
        {[
          { id: 'undistributed', label: 'Belum Terdistribusi', icon: 'inbox' },
          { id: 'distributed', label: 'Distribusi Pekerjaan', icon: 'layers' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity key={tab.id}
              style={[fs.tabBtn, isActive && fs.tabBtnActive]}
              onPress={() => setActiveTab(tab.id)}>
              <Feather name={tab.icon} size={13} color={isActive ? '#fff' : '#64748b'} />
              <Text style={[fs.tabBtnText, isActive && { color: '#fff' }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {activeTab === 'undistributed' && (
        <View style={{ marginTop: 4 }}>
          {undistributedTickets.length === 0 ? (
            <View style={fs.emptyState}>
              <Feather name="inbox" size={38} color="#cbd5e1" />
              <Text style={fs.emptyText}>Tidak ada pekerjaan baru.{'\n'}Tunggu SA menyelesaikan Form WAB.</Text>
            </View>
          ) : (
            undistributedTickets.map(t => (
              <JobCard key={t.ticketId} ticket={t} job={getJob(t.ticketId)} isUndistributed
                onAssign={() => setAssignModal({ visible: true, ticket: t })}
                onEditRec={() => { }} onDeleteRec={() => { }} onAddTracking={() => { }} onDelegate={() => { }} onFinishJob={() => { }}
              />
            ))
          )}
        </View>
      )}

      {activeTab === 'distributed' && (
        <View style={{ marginTop: 4 }}>
          {distributedTickets.length === 0 ? (
            <View style={fs.emptyState}>
              <Feather name="layers" size={38} color="#cbd5e1" />
              <Text style={fs.emptyText}>Belum ada pekerjaan terdistribusi.{'\n'}Assign teknisi dari tab "Belum Terdistribusi".</Text>
            </View>
          ) : (
            distributedTickets.map(t => {
              const job = getJob(t.ticketId);
              return (
                <JobCard key={t.ticketId} ticket={t} job={job} isUndistributed={false}
                  onAssign={() => { }}
                  onEditRec={rec => setRecModal({ visible: true, ticketId: t.ticketId, existingRec: rec })}
                  onDeleteRec={rec => setDelRecModal({ visible: true, ticketId: t.ticketId, rec })}
                  onAddTracking={() => setTrackModal({ visible: true, ticketId: t.ticketId })}
                  onDelegate={() => setDelegModal({ visible: true, ticketId: t.ticketId })}
                  onFinishJob={() => handleFinishJob(t)}
                />
              );
            })
          )}
        </View>
      )}

      <AssignTechnicianModal
        visible={assignModal.visible}
        ticket={assignTicket}
        onAssign={data => assignTicket && handleAssign(assignTicket, data)}
        onClose={() => setAssignModal({ visible: false, ticket: null })}
      />

      <RecommendationModal
        visible={recModal.visible}
        existingRec={recModal.existingRec}
        onSave={data => recTicketId && handleSaveRec(recTicketId, data, recModal.existingRec)}
        onClose={() => setRecModal({ visible: false, ticketId: null, existingRec: null })}
      />

      <ConfirmDeleteModal
        visible={delRecModal.visible}
        itemLabel={delRecModal.rec?.description || ''}
        onConfirm={() => delRecModal.ticketId && handleDeleteRec(delRecModal.ticketId, delRecModal.rec)}
        onClose={() => setDelRecModal({ visible: false, ticketId: null, rec: null })}
      />

      <TrackingModal
        visible={trackModal.visible}
        onSave={data => trackTicketId && handleAddTracking(trackTicketId, data)}
        onClose={() => setTrackModal({ visible: false, ticketId: null })}
      />

      <DelegateModal
        visible={delegModal.visible}
        ticket={delegTicket}
        job={delegJob}
        currentForeman={foremanCurrentName}
        onChangeTechnician={data => delegTicketId && handleChangeTech(delegTicketId, data)}
        onDelegateForeman={fm => delegTicketId && handleDelegateForeman(delegTicketId, fm)}
        onClose={() => setDelegModal({ visible: false, ticketId: null })}
      />
    </View>
  );
}

const ms = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '88%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sheetTitle: { fontSize: 17, fontWeight: 'bold', color: '#0f172a' },
  sheetSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  centeredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centeredCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    marginTop: 8,
  },
  techRowActive: { borderColor: COLORS.accentBlue, backgroundColor: '#eff6ff' },
  techAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center', alignItems: 'center',
  },
  techAvatarText: { fontSize: 16, fontWeight: 'bold', color: '#64748b' },
  techName: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  techSpec: { fontSize: 11, color: '#64748b', marginTop: 1 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  chipActive: { backgroundColor: COLORS.accentBlue, borderColor: COLORS.accentBlue },
  chipText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  dateHint: { fontSize: 11, color: '#64748b', marginTop: 6, fontStyle: 'italic' },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe',
    borderRadius: 8, padding: 10,
  },
  subTabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 9, borderRadius: 8, borderWidth: 1,
    borderColor: '#e2e8f0', backgroundColor: '#f8fafc',
  },
  subTabActive: { backgroundColor: COLORS.accentBlue, borderColor: COLORS.accentBlue },
  subTabText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
});

/** Foreman screen styles */
const fs = StyleSheet.create({
  metricsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  metricCard: {
    flex: 1, backgroundColor: '#ffffff',
    borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  metricValue: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  metricLabel: { fontSize: 10, fontWeight: '600', color: '#64748b', marginTop: 2, textAlign: 'center' },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 9, paddingHorizontal: 6,
    borderRadius: 9, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#ffffff',
  },
  tabBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabBtnText: { fontSize: 11, fontWeight: '600', color: '#64748b' },
  tabCount: {
    minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 5,
    justifyContent: 'center', alignItems: 'center', marginLeft: 3,
  },
  tabCountText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
  jobCard: {
    backgroundColor: '#ffffff', borderRadius: 12,
    borderWidth: 1, borderColor: '#cbd5e1',
    padding: 14, marginBottom: 12,
  },
  pill: {
    borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  pillText: { fontSize: 10, fontWeight: 'bold' },
  delegateBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginTop: 6, backgroundColor: '#f8fafc',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  delegateText: { fontSize: 11, color: '#475569', fontWeight: '600' },
  complaintBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    marginTop: 7, backgroundColor: '#f8fafc',
    borderRadius: 7, paddingHorizontal: 9, paddingVertical: 6,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  complaintText: { flex: 1, fontSize: 12, color: '#334155', lineHeight: 17 },
  techAssigned: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 7, backgroundColor: '#f0fdf4',
    borderRadius: 7, paddingHorizontal: 9, paddingVertical: 6,
    borderWidth: 1, borderColor: '#bbf7d0',
  },
  techAssignedText: { flex: 1, fontSize: 12, color: '#15803d' },
  expandRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 8, paddingVertical: 4,
    borderTopWidth: 1, borderTopColor: '#f1f5f9',
  },
  expandText: { fontSize: 12, fontWeight: '600' },
  recItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 8, paddingHorizontal: 10,
    backgroundColor: '#fffbe6', borderRadius: 7,
    borderWidth: 1, borderColor: '#fef08a', marginTop: 4,
  },
  recDesc: { fontSize: 12, fontWeight: '600', color: '#92400e' },
  recDate: { fontSize: 11, color: '#b45309', marginTop: 1 },
  trackItem: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    paddingVertical: 6, paddingHorizontal: 8,
    backgroundColor: '#f8fafc', borderRadius: 6, borderWidth: 1, borderColor: '#e2e8f0',
    marginTop: 4,
  },
  trackLabel: { fontSize: 12, fontWeight: '600', color: '#0f172a' },
  trackTime: { fontSize: 11, color: '#64748b', marginTop: 1 },
  actionChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: 8, borderRadius: 8,
    borderWidth: 1, backgroundColor: '#ffffff',
  },
  actionChipText: { fontSize: 12, fontWeight: '600' },
  completedRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 10, paddingVertical: 10,
    backgroundColor: '#f0fdf4', borderRadius: 8,
    borderWidth: 1, borderColor: '#86efac',
  },
  completedText: { fontSize: 13, fontWeight: 'bold', color: '#15803d' },
  emptyState: { alignItems: 'center', padding: 28 },
  emptyText: { color: '#94a3b8', textAlign: 'center', marginTop: 12, fontSize: 13, lineHeight: 20 },
});
