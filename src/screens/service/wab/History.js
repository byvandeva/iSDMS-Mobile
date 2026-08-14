import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { globalStyles, COLORS } from '../../../config/theme';
import { getPurposeString } from '../../../utils/helpers';

function formatDateTime(iso) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return iso;
  }
}

const SEVERITY_COLOR = { Low: '#059669', Medium: '#d97706', High: '#dc2626' };
const DAMAGE_ICON = { Scratch: 'minus', Dent: 'circle', Crack: 'alert-triangle', Paint: 'droplet' };

function VehicleDetailModal({ visible, entry, onClose }) {
  if (!entry) return null;
  const t = entry;

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* HEADER */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Detail Check-Out Kendaraan</Text>
              <Text style={styles.modalSubtitle}>{t.licensePlate} · {t.vehicleModel || '-'}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={{ marginBottom: 14, backgroundColor: '#ffffff' }}>
              <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Informasi Kendaraan & Kedatangan</Text>
              
              <View style={styles.infoRowUnderlined}>
                <Feather name="truck" size={15} color="#64748b" />
                <Text style={styles.infoText}>Plat Nomor: <Text style={{ fontWeight: 'bold', color: COLORS.text }}>{t.licensePlate}</Text></Text>
              </View>

              <View style={styles.infoRowUnderlined}>
                <Feather name="info" size={15} color="#64748b" />
                <Text style={styles.infoText}>Model Kendaraan: {t.vehicleModel || '-'}</Text>
              </View>

              <View style={styles.infoRowUnderlined}>
                <Feather name="list" size={15} color="#64748b" />
                <Text style={styles.infoText}>No. Antrian: {t.queueNumber || 'Non-Service'}</Text>
              </View>

              <View style={styles.infoRowUnderlined}>
                <Feather name="compass" size={15} color="#64748b" />
                <Text style={styles.infoText}>Tujuan Kedatangan: {getPurposeString(t.arrivalPurpose)}</Text>
              </View>

              <View style={styles.infoRowUnderlined}>
                <Feather name="user" size={15} color="#64748b" />
                <Text style={styles.infoText}>Nama Customer: {t.customerName || '-'}</Text>
              </View>

              <View style={styles.infoRowUnderlined}>
                <Feather name="phone" size={15} color="#64748b" />
                <Text style={styles.infoText}>Nomor Telepon: {t.customerPhone || '-'}</Text>
              </View>

              <View style={styles.infoRowUnderlined}>
                <Feather name="calendar" size={15} color="#64748b" />
                <Text style={styles.infoText}>Waktu Check-In: {formatDateTime(t.checkInTime)}</Text>
              </View>

              <View style={styles.infoRowUnderlined}>
                <Feather name="clock" size={15} color="#64748b" />
                <Text style={styles.infoText}>Jam Keluar Gerbang: {formatDateTime(t.checkOutTime || t.updatedAt)}</Text>
              </View>

              <View style={[styles.infoRowUnderlined, { borderBottomWidth: 0 }]}>
                <Feather name="check-circle" size={15} color="#059669" />
                <Text style={[styles.infoText, { color: '#059669', fontWeight: 'bold' }]}>Status: Checked-Out</Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={[globalStyles.button, { backgroundColor: COLORS.primary, marginTop: 8 }]} onPress={onClose}>
            <Text style={globalStyles.buttonText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function WabDetailModal({ visible, wabEntry, onClose }) {
  if (!wabEntry) return null;
  const t = wabEntry;
  const damages = t.wabDamages || t.damages || [];
  const inspections = t.wabInspections || t.functionalInspections || [];

  const custName = t.wabCustomerName || t.customerName || '-';
  const driverName = t.driverName || t.saDriverName || '';
  const custPhone = t.wabCustomerPhone || t.customerPhone || t.telponNo || '-';
  const custEmail = t.customerEmail || t.saCustomerEmail || '';
  const identityNo = t.identityNo || t.saIdentityNo || '';
  const licensePlate = (t.licensePlate || t.policeRegNo || '-').toUpperCase();
  const vehicleModel = t.vehicleModel || t.groupCode || '-';
  const odometerVal = t.odometer ? `${Number(t.odometer).toLocaleString('id-ID')} KM` : '-';
  const addressVal = t.customerAddress || t.saCustomerAddress || '';
  const complaintsVal = t.wabComplaints || t.customerComplaints || 'Tidak ada keluhan khusus.';
  const serviceTypeVal = t.wabServiceType || t.serviceType || t.jobType || '-';
  const queueNo = t.queueNumber || 'Non-Service';

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* HEADER */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Detail Form WAB SA</Text>
              <Text style={styles.modalSubtitle}>{licensePlate} · Antrian: {queueNo}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* 1. PELANGGAN & KENDARAAN */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0054a6', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
                Data Pelanggan & Kendaraan
              </Text>
              
              <View style={styles.infoRowUnderlined}>
                <Text style={{ fontSize: 12, color: '#64748b', width: 130 }}>Nama Pelanggan:</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#0f172a', flex: 1 }}>{custName}</Text>
              </View>

              {driverName ? (
                <View style={styles.infoRowUnderlined}>
                  <Text style={{ fontSize: 12, color: '#64748b', width: 130 }}>Nama Pengemudi:</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#0f172a', flex: 1 }}>{driverName}</Text>
                </View>
              ) : null}

              <View style={styles.infoRowUnderlined}>
                <Text style={{ fontSize: 12, color: '#64748b', width: 130 }}>No. Telepon / WA:</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#0f172a', flex: 1 }}>{custPhone}</Text>
              </View>

              {custEmail ? (
                <View style={styles.infoRowUnderlined}>
                  <Text style={{ fontSize: 12, color: '#64748b', width: 130 }}>Email Pelanggan:</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#0f172a', flex: 1 }}>{custEmail}</Text>
                </View>
              ) : null}

              {identityNo ? (
                <View style={styles.infoRowUnderlined}>
                  <Text style={{ fontSize: 12, color: '#64748b', width: 130 }}>No. KTP / Identitas:</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#0f172a', flex: 1 }}>{identityNo}</Text>
                </View>
              ) : null}

              <View style={styles.infoRowUnderlined}>
                <Text style={{ fontSize: 12, color: '#64748b', width: 130 }}>Nomor Polisi:</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0f172a', flex: 1 }}>{licensePlate}</Text>
              </View>

              <View style={styles.infoRowUnderlined}>
                <Text style={{ fontSize: 12, color: '#64748b', width: 130 }}>Model Kendaraan:</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#0f172a', flex: 1 }}>{vehicleModel}</Text>
              </View>

              <View style={styles.infoRowUnderlined}>
                <Text style={{ fontSize: 12, color: '#64748b', width: 130 }}>Odometer Saat Ini:</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#0f172a', flex: 1 }}>{odometerVal}</Text>
              </View>

              {addressVal ? (
                <View style={styles.infoRowUnderlined}>
                  <Text style={{ fontSize: 12, color: '#64748b', width: 130 }}>Alamat Domisili:</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#0f172a', flex: 1 }}>{addressVal}</Text>
                </View>
              ) : null}
            </View>

            {/* 2. PEKERJAAN SERVIS & KELUHAN */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0054a6', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
                Pekerjaan Servis & Keluhan
              </Text>

              <View style={styles.infoRowUnderlined}>
                <Text style={{ fontSize: 12, color: '#64748b', width: 130 }}>Keluhan Utama:</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#0f172a', flex: 1, lineHeight: 18 }}>{complaintsVal}</Text>
              </View>

              <View style={styles.infoRowUnderlined}>
                <Text style={{ fontSize: 12, color: '#64748b', width: 130 }}>Jenis Paket Servis:</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0054a6', flex: 1 }}>{serviceTypeVal}</Text>
              </View>

              <View style={styles.infoRowUnderlined}>
                <Text style={{ fontSize: 12, color: '#64748b', width: 130 }}>Waktu Submit:</Text>
                <Text style={{ fontSize: 12, color: '#334155', flex: 1 }}>{formatDateTime(t.wabSubmittedAt || t.inspectionTime || t.checkInTime)}</Text>
              </View>
            </View>

            {/* 3. CATATAN KERUSAKAN BODI */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0054a6', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
                Catatan Kerusakan Bodi ({damages.length} Titik)
              </Text>
              {damages.length === 0 ? (
                <Text style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', paddingVertical: 4 }}>
                  Kondisi bodi mulus, tidak ada titik kerusakan tercatat.
                </Text>
              ) : (
                damages.map((d, idx) => {
                  const dotColor = d.severity === 'High' ? '#be123c' : d.severity === 'Medium' ? '#d97706' : '#15803d';
                  return (
                    <View key={d.id || idx} style={styles.infoRowUnderlined}>
                      <Text style={{ color: dotColor, fontWeight: 'bold', fontSize: 14 }}>●</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0f172a' }}>
                          {d.damageType || d.type || 'Scratch'} &bull; Frame {d.frame || 1}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{d.notes || '-'}</Text>
                      </View>
                      <Text style={{ fontSize: 11, fontWeight: 'bold', color: dotColor }}>
                        {d.severity || 'Low'}
                      </Text>
                    </View>
                  );
                })
              )}
            </View>

            {/* 4. PEMERIKSAAN KOMPONEN & FUNGSI */}
            {inspections.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0054a6', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
                  Pemeriksaan Komponen & Fungsi ({inspections.length} Item)
                </Text>
                {inspections.map((ins, idx) => (
                  <View key={ins.id || idx} style={styles.infoRowUnderlined}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#0f172a', flex: 1 }}>
                      {ins.name}
                    </Text>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: ins.status === 'OK' ? '#15803d' : '#be123c' }}>
                      {ins.status === 'OK' ? '✓ Baik' : '⚠ Perbaikan'}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <TouchableOpacity style={[globalStyles.button, { backgroundColor: COLORS.primary, marginTop: 8 }]} onPress={onClose}>
            <Text style={globalStyles.buttonText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function WabHistoryScreen({ userRole = 'Admin', wabHistory = [], historyTickets = [], allTickets = [], initialTicketId = null, onClearInitialTicket }) {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [modalType, setModalType] = useState('vehicle');
  const [modalVisible, setModalVisible] = useState(false);
  
  const [activeTabSegment, setActiveTabSegment] = useState(
    userRole === 'Security' ? 'security' :
    userRole === 'ServiceAdvisor' ? 'sa' :
    userRole === 'Foreman' ? 'foreman' : 'security'
  );

  const effectiveSegment = (userRole === 'Admin') ? activeTabSegment : (
    userRole === 'Security' ? 'security' :
    userRole === 'ServiceAdvisor' ? 'sa' :
    userRole === 'Foreman' ? 'foreman' : 'security'
  );

  const foremanDoneTickets = (allTickets || []).filter(t => 
    t.status === 'ServiceCompleted' || 
    t.status === 'PreHandoverReady' || 
    t.status === 'HandoverCompleted' || 
    t.status === 'CheckedOut'
  );

  const saDoneTickets = (allTickets || []).filter(t => 
    t.status === 'Inspected' || 
    t.status === 'WabDone' || 
    t.status === 'AssignedToStall' || 
    t.status === 'InService' || 
    t.status === 'ServiceCompleted' || 
    t.status === 'PreHandoverReady' || 
    t.status === 'HandoverCompleted' || 
    t.status === 'CheckedOut'
  );

  const checkoutTickets = historyTickets.length > 0 
    ? historyTickets 
    : (allTickets || []).filter(t => t.status === 'CheckedOut');

  React.useEffect(() => {
    if (initialTicketId && (wabHistory.length > 0 || allTickets.length > 0)) {
      const found = wabHistory.find(w => w.ticketId === initialTicketId) || allTickets.find(t => t.ticketId === initialTicketId);
      if (found) {
        setSelectedEntry(found);
        setModalType('wab');
        setModalVisible(true);
        if (onClearInitialTicket) onClearInitialTicket();
      }
    }
  }, [initialTicketId, wabHistory, allTickets]);

  const cardTitle = userRole === 'Security' ? 'Riwayat Check-Out' :
                    userRole === 'ServiceAdvisor' ? 'Riwayat Form WAB' :
                    userRole === 'Foreman' ? 'Riwayat Pengerjaan Bengkel' : 'Riwayat Transaksi & Pengerjaan';

  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.cardTitle}>{cardTitle}</Text>

      {/* SEGMENTED TAB CONTROL FOR ADMIN */}
      {userRole === 'Admin' && (
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTabSegment === 'security' && styles.segmentBtnActive]}
            onPress={() => setActiveTabSegment('security')}
          >
            <Text style={[styles.segmentText, activeTabSegment === 'security' && styles.segmentTextActive]}>
              Security ({checkoutTickets.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTabSegment === 'sa' && styles.segmentBtnActive]}
            onPress={() => setActiveTabSegment('sa')}
          >
            <Text style={[styles.segmentText, activeTabSegment === 'sa' && styles.segmentTextActive]}>
              SA ({saDoneTickets.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTabSegment === 'foreman' && styles.segmentBtnActive]}
            onPress={() => setActiveTabSegment('foreman')}
          >
            <Text style={[styles.segmentText, activeTabSegment === 'foreman' && styles.segmentTextActive]}>
              Foreman ({foremanDoneTickets.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* TAB CONTENT 1: SECURITY CHECKOUT HISTORY (SHOWS VEHICLE DETAIL MODAL ONLY) */}
      {effectiveSegment === 'security' && (
        checkoutTickets.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 32 }}>
            <Feather name="shield" size={40} color="#cbd5e1" />
            <Text style={{ color: '#94a3b8', textAlign: 'center', marginTop: 12, fontSize: 14 }}>
              Belum ada riwayat kendaraan check-out gerbang.
            </Text>
          </View>
        ) : (
          checkoutTickets.map(entry => (
            <TouchableOpacity
              key={entry.ticketId}
              activeOpacity={0.8}
              style={styles.historyCard}
              onPress={() => { setSelectedEntry(entry); setModalType('vehicle'); setModalVisible(true); }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text style={globalStyles.queueBadge}>{entry.queueNumber || 'Non-Queue'}</Text>
                <View style={[styles.wabDoneBadge, { backgroundColor: '#475569', borderColor: '#475569' }]}>
                  <Feather name="check" size={11} color="#ffffff" />
                  <Text style={styles.wabDoneText}>Checked-Out</Text>
                </View>
              </View>

              <Text style={globalStyles.plateText}>{entry.licensePlate}</Text>
              <Text style={globalStyles.customerText}>{entry.customerName || '-'}</Text>
              <Text style={globalStyles.subDetailText}>
                {entry.vehicleModel} · {getPurposeString(entry.arrivalPurpose)}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                <Feather name="clock" size={10} /> Keluar: {formatDateTime(entry.checkOutTime || entry.updatedAt)}
              </Text>
            </TouchableOpacity>
          ))
        )
      )}

      {/* TAB CONTENT 2: SERVICE ADVISOR WAB HISTORY (SHOWS WAB DETAIL MODAL) */}
      {effectiveSegment === 'sa' && (
        saDoneTickets.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 32 }}>
            <Feather name="file-text" size={40} color="#cbd5e1" />
            <Text style={{ color: '#94a3b8', textAlign: 'center', marginTop: 12, fontSize: 14 }}>
              Belum ada riwayat form WAB yang disubmit.
            </Text>
          </View>
        ) : (
          saDoneTickets.map(entry => (
            <TouchableOpacity
              key={entry.ticketId}
              activeOpacity={0.8}
              style={styles.historyCard}
              onPress={() => { setSelectedEntry(entry); setModalType('wab'); setModalVisible(true); }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text style={globalStyles.queueBadge}>{entry.queueNumber || 'Non-Queue'}</Text>
                <View style={styles.wabDoneBadge}>
                  <Feather name="check-circle" size={11} color="#ffffff" />
                  <Text style={styles.wabDoneText}>WAB Completed</Text>
                </View>
              </View>

              <Text style={globalStyles.plateText}>{entry.licensePlate}</Text>
              <Text style={globalStyles.customerText}>{entry.customerName || '-'}</Text>
              <Text style={globalStyles.subDetailText}>
                {entry.vehicleModel} · {entry.serviceType || 'Periodic Service'}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                <Feather name="clock" size={10} /> Submit WAB: {formatDateTime(entry.inspectionTime || entry.checkInTime)}
              </Text>
            </TouchableOpacity>
          ))
        )
      )}

      {/* TAB CONTENT 3: FOREMAN WORKSHOP HISTORY (SHOWS VEHICLE DETAIL MODAL) */}
      {effectiveSegment === 'foreman' && (
        foremanDoneTickets.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 32 }}>
            <Feather name="tool" size={40} color="#cbd5e1" />
            <Text style={{ color: '#94a3b8', textAlign: 'center', marginTop: 12, fontSize: 14 }}>
              Belum ada riwayat pengerjaan bengkel yang selesai.
            </Text>
          </View>
        ) : (
          foremanDoneTickets.map(entry => (
            <TouchableOpacity
              key={entry.ticketId}
              activeOpacity={0.8}
              style={styles.historyCard}
              onPress={() => { setSelectedEntry(entry); setModalType('vehicle'); setModalVisible(true); }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text style={globalStyles.queueBadge}>{entry.queueNumber || 'Non-Queue'}</Text>
                <View style={styles.wabDoneBadge}>
                  <Feather name="check-circle" size={11} color="#ffffff" />
                  <Text style={styles.wabDoneText}>Service Completed</Text>
                </View>
              </View>

              <Text style={globalStyles.plateText}>{entry.licensePlate}</Text>
              <Text style={globalStyles.customerText}>{entry.customerName || '-'}</Text>
              <Text style={globalStyles.subDetailText}>
                Stall: {entry.stallName || '-'} · Teknisi: {entry.technicianName || '-'}
              </Text>
            </TouchableOpacity>
          ))
        )
      )}

      {/* RENDER MODAL BASED ON TYPE */}
      {modalType === 'wab' ? (
        <WabDetailModal
          visible={modalVisible}
          wabEntry={selectedEntry}
          onClose={() => setModalVisible(false)}
        />
      ) : (
        <VehicleDetailModal
          visible={modalVisible}
          entry={selectedEntry}
          onClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 3,
    marginBottom: 14
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6
  },
  segmentBtnActive: {
    backgroundColor: COLORS.primary
  },
  segmentText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b'
  },
  segmentTextActive: {
    color: '#ffffff'
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10
  },
  wabDoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    borderColor: '#059669',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  wabDoneText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    width: '100%',
    maxWidth: 520,
    maxHeight: '85%',
    padding: 18
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    paddingBottom: 12,
    marginBottom: 12
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2
  },
  section: {
    marginBottom: 14,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  infoText: {
    fontSize: 12,
    color: '#334155'
  },
  emptyText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic'
  },
  damageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1'
  },
  damageTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text
  },
  damageNotes: {
    fontSize: 11,
    color: '#64748b'
  },
  severityBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  inspRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  inspName: {
    fontSize: 12,
    color: COLORS.text,
    flex: 1,
    marginLeft: 6
  },
  inspStatus: {
    fontSize: 11,
    fontWeight: 'bold'
  },
  infoRowUnderlined: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  }
});
