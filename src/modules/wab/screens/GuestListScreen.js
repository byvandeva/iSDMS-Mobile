import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { globalStyles, COLORS } from '../../../theme/theme';
import { getPurposeString, getStatusString } from '../../../utils/helpers';

export default function GuestListScreen({
  tickets,
  userRole,
  searchQuery,
  setSearchQuery,
  filterPurpose,
  setFilterPurpose,
  onStartWab,
  onOpenEditModal,
  onOpenCheckOutModal,
  onViewWabHistory,
}) {
  const filteredTickets = tickets
    .filter(t => t.status !== 'CheckedOut')
    .filter(t => {
      const q = searchQuery.toLowerCase().trim();
      const plateMatch = (t.licensePlate || '').toLowerCase().includes(q);
      const modelMatch = (t.vehicleModel || '').toLowerCase().includes(q);
      const custMatch = (t.customerName || '').toLowerCase().includes(q);
      const queueMatch = (t.queueNumber || '').toLowerCase().includes(q);
      const matchesSearch = !q || plateMatch || modelMatch || custMatch || queueMatch;

      const purposeStr = getPurposeString(t.arrivalPurpose);
      const matchesPurpose = filterPurpose === 'All' || purposeStr.toLowerCase() === filterPurpose.toLowerCase();

      return matchesSearch && matchesPurpose;
    })
    .sort((a, b) => new Date(b.checkInTime || b.createdAt || 0) - new Date(a.checkInTime || a.createdAt || 0));

  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.cardTitle}>Daftar Tamu</Text>

      {/* SEARCH INPUT */}
      <TextInput
        style={[globalStyles.input, { marginBottom: 10 }]}
        placeholder="Cari Plat / Model / Customer..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* PURPOSE FILTER CHIPS */}
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

      {filteredTickets.length === 0 ? (
        <Text style={{ color: '#94a3b8', textAlign: 'center', padding: 20 }}>Tidak ada data tamu yang cocok.</Text>
      ) : (
        filteredTickets.map(t => {
          const isService = getPurposeString(t.arrivalPurpose) === 'Service';
          const isWabDone = t.status === 'Inspected' || t.status === 'WabDone' || t.wabSubmitted;
          const isWabInProgress = t.status === 'WabInProgress' || t.status === 'InProgress' || t.status === 'In Progress';

          return (
            <View key={t.ticketId} style={globalStyles.itemBox}>
              {/* TOP HEADER ROW WITH QUEUE BADGE, STATUS BADGE & PLATE */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={globalStyles.queueBadge}>{t.queueNumber || 'Non-Service'}</Text>
                  
                  {/* STATUS BADGE */}
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

              <Text style={globalStyles.customerText}>{(!t.customerName || t.customerName === 'Diisi oleh SA di WAB') ? '-' : t.customerName}</Text>
              <Text style={globalStyles.subDetailText}>Tujuan: {getPurposeString(t.arrivalPurpose)} &bull; Model: {t.vehicleModel}</Text>

              {/* ACTION BUTTONS SIDE-BY-SIDE IN ONE ROW */}
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                {/* WAB ACTION BUTTON (SA / ADMIN) */}
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
                      {isWabDone ? 'Lihat WAB' : isWabInProgress ? 'Lanjutkan WAB' : 'Mulai WAB'}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* EDIT BUTTON */}
                {(userRole === 'Security' || userRole === 'ServiceAdvisor' || userRole === 'Admin') && (
                  <TouchableOpacity
                    style={[globalStyles.actionBtn, { flex: 1, backgroundColor: '#64748b', marginTop: 0 }]}
                    onPress={() => onOpenEditModal(t)}
                  >
                    <Text style={globalStyles.actionBtnText}>Edit</Text>
                  </TouchableOpacity>
                )}

                {/* CHECK-OUT BUTTON */}
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
