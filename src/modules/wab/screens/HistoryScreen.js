import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { globalStyles, COLORS } from '../../../theme/theme';
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

function WabDetailModal({ visible, wabEntry, onClose }) {
  if (!wabEntry) return null;
  const t = wabEntry;
  const damages = t.wabDamages || [];
  const inspections = t.wabInspections || [];

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* HEADER */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Detail WAB</Text>
              <Text style={styles.modalSubtitle}>{t.licensePlate} · {t.vehicleModel}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x" size={22} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* CUSTOMER INFO */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informasi Pelanggan</Text>
              <View style={styles.infoRow}>
                <Feather name="user" size={14} color="#64748b" />
                <Text style={styles.infoText}>{t.wabCustomerName || t.customerName || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="phone" size={14} color="#64748b" />
                <Text style={styles.infoText}>{t.wabCustomerPhone || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="message-square" size={14} color="#64748b" />
                <Text style={styles.infoText}>Keluhan: {t.wabComplaints || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="tool" size={14} color="#64748b" />
                <Text style={styles.infoText}>Jenis Servis: {t.wabServiceType || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="clock" size={14} color="#64748b" />
                <Text style={styles.infoText}>Selesai WAB: {formatDateTime(t.wabSubmittedAt)}</Text>
              </View>
            </View>

            {/* DAMAGE LIST */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Titik Kerusakan ({damages.length})</Text>
              {damages.length === 0 ? (
                <Text style={styles.emptyText}>Tidak ada titik kerusakan tercatat.</Text>
              ) : (
                damages.map((d, idx) => (
                  <View key={d.id || idx} style={styles.damageRow}>
                    <Feather name={DAMAGE_ICON[d.damageType] || 'alert-circle'} size={14} color={SEVERITY_COLOR[d.severity] || '#64748b'} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.damageTitle}>{d.damageType} · Frame {d.frame}</Text>
                      <Text style={styles.damageNotes}>{d.notes || '-'}</Text>
                    </View>
                    <View style={[styles.severityBadge, { backgroundColor: SEVERITY_COLOR[d.severity] + '20', borderColor: SEVERITY_COLOR[d.severity] }]}>
                      <Text style={[styles.severityText, { color: SEVERITY_COLOR[d.severity] }]}>{d.severity}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* FUNCTIONAL INSPECTION */}
            {inspections.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Inspeksi Fungsional</Text>
                {inspections.map((ins, idx) => (
                  <View key={ins.id || idx} style={styles.inspRow}>
                    <Feather
                      name={ins.status === 'OK' ? 'check-circle' : ins.status === 'Perlu Perbaikan' ? 'alert-circle' : 'minus-circle'}
                      size={14}
                      color={ins.status === 'OK' ? '#059669' : ins.status === 'Perlu Perbaikan' ? '#dc2626' : '#94a3b8'}
                    />
                    <Text style={styles.inspName}>{ins.name}</Text>
                    <Text style={[styles.inspStatus, {
                      color: ins.status === 'OK' ? '#059669' : ins.status === 'Perlu Perbaikan' ? '#dc2626' : '#64748b'
                    }]}>{ins.status}</Text>
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

export default function WabHistoryScreen({ wabHistory = [], historyTickets = [], initialTicketId = null, onClearInitialTicket }) {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Auto-open if navigated from "Lihat WAB"
  React.useEffect(() => {
    if (initialTicketId && wabHistory.length > 0) {
      const found = wabHistory.find(w => w.ticketId === initialTicketId);
      if (found) {
        setSelectedEntry(found);
        setModalVisible(true);
        if (onClearInitialTicket) onClearInitialTicket();
      }
    }
  }, [initialTicketId, wabHistory]);

  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.cardTitle}>Riwayat WAB</Text>

      {wabHistory.length === 0 ? (
        <View style={{ alignItems: 'center', padding: 32 }}>
          <Feather name="file-text" size={40} color="#cbd5e1" />
          <Text style={{ color: '#94a3b8', textAlign: 'center', marginTop: 12, fontSize: 14 }}>
            Belum ada WAB yang diselesaikan.
          </Text>
        </View>
      ) : (
        wabHistory.map(entry => (
          <TouchableOpacity
            key={entry.ticketId}
            activeOpacity={0.8}
            style={styles.historyCard}
            onPress={() => { setSelectedEntry(entry); setModalVisible(true); }}
          >
            {/* TOP ROW */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={globalStyles.queueBadge}>{entry.queueNumber || 'Non-Queue'}</Text>
              <View style={styles.wabDoneBadge}>
                <Feather name="check-circle" size={11} color="#ffffff" />
                <Text style={styles.wabDoneText}>Completed</Text>
              </View>
            </View>

            <Text style={globalStyles.plateText}>{entry.licensePlate}</Text>
            <Text style={globalStyles.customerText}>{entry.wabCustomerName || entry.customerName || '-'}</Text>
            <Text style={globalStyles.subDetailText}>
              {entry.vehicleModel} · {getPurposeString(entry.arrivalPurpose)}
            </Text>
            <Text style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
              <Feather name="clock" size={10} /> {formatDateTime(entry.wabSubmittedAt)}
            </Text>

            {/* SUMMARY CHIPS */}
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {(entry.wabDamages || []).length > 0 && (
                <View style={styles.chip}>
                  <Feather name="alert-circle" size={11} color="#dc2626" />
                  <Text style={[styles.chipText, { color: '#dc2626' }]}>{entry.wabDamages.length} Kerusakan</Text>
                </View>
              )}
              {entry.wabServiceType && (
                <View style={styles.chip}>
                  <Feather name="tool" size={11} color="#0054a6" />
                  <Text style={[styles.chipText, { color: '#0054a6' }]}>{entry.wabServiceType}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))
      )}

      <WabDetailModal
        visible={modalVisible}
        wabEntry={selectedEntry}
        onClose={() => { setModalVisible(false); setSelectedEntry(null); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 10,
  },
  wabDoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    borderWidth: 1,
    borderColor: '#059669',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  wabDoneText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 7,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  damageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  damageTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  damageNotes: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  severityBadge: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  severityText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  inspRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  inspName: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
  },
  inspStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
});
