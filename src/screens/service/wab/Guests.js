import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { globalStyles, COLORS } from '../../../config/theme';
import { getPurposeString } from '../../../utils/helpers';
import { interleavePriorityQueue } from '../../../utils/queuePriority';

export default function Guests({
  tickets,
  userRole,
  onStartWab,
  onOpenCheckOutModal,
  onOpenEditModal,
  onViewWabHistory
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('All');

  const filteredTickets = tickets.filter(t => t.status !== 'CheckedOut').filter(t => {
    const purposeMatch = filterPurpose === 'All' || getPurposeString(t.arrivalPurpose) === filterPurpose;
    const plate = (t.licensePlate || '').toLowerCase();
    const model = (t.vehicleModel || '').toLowerCase();
    const cust = (t.customerName || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    const searchMatch = !q || plate.includes(q) || model.includes(q) || cust.includes(q);
    return purposeMatch && searchMatch;
  });

  const interleavedTickets = interleavePriorityQueue(filteredTickets);

  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.cardTitle}>Daftar Tamu</Text>

      <TextInput
        style={[globalStyles.input, { marginBottom: 10 }]}
        placeholder="Cari Plat / Model / Customer..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14, flexDirection: 'row' }}>
        {['All', 'Service', 'Sales', 'BodyRepair', 'SparePart'].map(p => (
          <TouchableOpacity
            key={p}
            style={{
              backgroundColor: filterPurpose === p ? COLORS.primary : '#f1f5f9',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              marginRight: 6
            }}
            onPress={() => setFilterPurpose(p)}
          >
            <Text style={{ color: filterPurpose === p ? '#ffffff' : COLORS.textDarkLabel, fontSize: 12, fontWeight: 'bold' }}>
              {p === 'All' ? 'Semua' : p}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {interleavedTickets.length === 0 ? (
        <Text style={{ color: '#94a3b8', textAlign: 'center', padding: 20 }}>Tidak ada data tamu yang cocok.</Text>
      ) : (
        interleavedTickets.map((t, idx) => {
          const isService = getPurposeString(t.arrivalPurpose) === 'Service';
          const statusStr = String(t.status || '');
          const isWabDone = Boolean(t.wabSubmitted) || ['Inspected', 'WabDone', '1', 'AssignedToStall', '2', 'InService', '3', 'PendingAdditionalApproval', '4', 'ServiceCompleted', '5', 'PreHandoverReady', '6', 'HandoverCompleted', '7', 'CheckedOut', '8'].includes(statusStr);
          const isWabInProgress = statusStr === 'WabInProgress' || statusStr === 'InProgress' || statusStr === 'In Progress';

          return (
            <View key={t.ticketId || idx} style={globalStyles.itemBox}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={globalStyles.queueBadge}>{t.queueNumber || 'Non-Service'}</Text>

                  {isWabDone && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#059669', borderWidth: 1, borderColor: '#059669', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Feather name="check-circle" size={11} color="#ffffff" />
                      <Text style={{ fontSize: 11, color: '#ffffff', fontWeight: 'bold' }}>Completed</Text>
                    </View>
                  )}
                  {isWabInProgress && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#0054a6', borderWidth: 1, borderColor: '#0054a6', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Feather name="clock" size={11} color="#ffffff" />
                      <Text style={{ fontSize: 11, color: '#ffffff', fontWeight: 'bold' }}>On Progress</Text>
                    </View>
                  )}
                  {!isWabDone && !isWabInProgress && (
                    <View style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 10, color: '#475569', fontWeight: 'bold' }}>Check-In</Text>
                    </View>
                  )}
                </View>
                <Text style={globalStyles.plateText}>{t.licensePlate}</Text>
              </View>

              <Text style={globalStyles.subDetailText}>
                Booking: {t.reservasiTime || t.bookingTime || '-'} &bull; Check-In: {t.checkInTime ? new Date(t.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
              </Text>
              <Text style={globalStyles.subDetailText}>
                Tujuan: {getPurposeString(t.arrivalPurpose)} &bull; Tipe: {t.groupCode || t.vehicleModel}
              </Text>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                {userRole === 'ServiceAdvisor' && isService && (
                  <TouchableOpacity
                    style={[
                      globalStyles.actionBtn,
                      {
                        flex: 1.5,
                        backgroundColor: isWabDone ? '#0f172a' : '#0054a6',
                        marginTop: 0
                      }
                    ]}
                    onPress={() => isWabDone ? (onViewWabHistory && onViewWabHistory(t)) : onStartWab(t)}
                  >
                    <Text style={globalStyles.actionBtnText}>
                      {isWabDone ? 'Lihat' : isWabInProgress ? 'Lanjutkan' : 'Mulai'}
                    </Text>
                  </TouchableOpacity>
                )}

                {(userRole === 'Security' || userRole === 'ServiceAdvisor' || userRole === 'Admin') && (
                  <TouchableOpacity
                    style={[globalStyles.actionBtn, { flex: 1, backgroundColor: '#64748b', marginTop: 0 }]}
                    onPress={() => onOpenEditModal(t)}
                  >
                    <Text style={globalStyles.actionBtnText}>Edit</Text>
                  </TouchableOpacity>
                )}

                {(userRole === 'Security' || userRole === 'Admin') && (
                  <TouchableOpacity
                    style={[globalStyles.actionBtn, { flex: 1, backgroundColor: COLORS.primary, marginTop: 0 }]}
                    onPress={() => onOpenCheckOutModal(t)}
                  >
                    <Text style={globalStyles.actionBtnText}>Check-Out</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
