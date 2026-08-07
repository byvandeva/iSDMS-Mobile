import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Services & Helpers
import { API_BASE, HOST_IP } from './src/services/api.js';
import { getPurposeString } from './src/utils/helpers.js';
import { globalStyles } from './src/theme/theme.js';

// Layout & Reusable UI Components
import SplashScreen from './src/components/SplashScreen.js';
import Header from './src/components/Header.js';
import BottomNav from './src/components/BottomNav.js';
import SignatureModal from './src/components/SignatureModal.js';
import SuccessCheckInModal from './src/components/SuccessCheckInModal.js';

// Screens
import LoginScreen from './src/modules/auth/screens/LoginScreen.js';
import AccountScreen from './src/modules/auth/screens/AccountScreen.js';
import BookingListScreen from './src/modules/wab/screens/BookingListScreen.js';
import GuestListScreen from './src/modules/wab/screens/GuestListScreen.js';
import WabFormScreen from './src/modules/wab/screens/WabFormScreen.js';
import HistoryScreen from './src/modules/wab/screens/HistoryScreen.js';
import ForemanScreen from './src/modules/wab/screens/ForemanScreen.js';

// Modals
import WalkInModal from './src/modules/wab/modals/WalkInModal.js';
import EditTicketModal from './src/modules/wab/modals/EditTicketModal.js';
import CheckOutModal from './src/modules/wab/modals/CheckOutModal.js';
import PendingCheckInModal from './src/modules/wab/modals/PendingCheckInModal.js';
import Damage360Modal from './src/modules/wab/modals/Damage360Modal.js';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('Security');
  const [mobileEmailInput, setMobileEmailInput] = useState('sa@suzuki.co.id');
  const [mobilePasswordInput, setMobilePasswordInput] = useState('suzuki2026');
  const [mobileShowPassword, setMobileShowPassword] = useState(false);
  const [mobileSelectedRole, setMobileSelectedRole] = useState('ServiceAdvisor');

  const [activeTab, setActiveTab] = useState('bookings');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('All');

  const [bookings, setBookings] = useState([
    { sdmsBookingId: 'B-001', customerName: 'Budi Santoso', arrivalPurpose: 'Service', licensePlate: 'B 1234 ABC', bookingTime: '09:00', categoryPassComm: 'Passenger', vehicleModel: 'Suzuki XL7 Alpha' },
    { sdmsBookingId: 'B-002', customerName: 'Siti Rahma', arrivalPurpose: 'Service', licensePlate: 'B 5678 XYZ', bookingTime: '10:30', categoryPassComm: 'Passenger', vehicleModel: 'Suzuki All New Ertiga' },
    { sdmsBookingId: 'B-003', customerName: 'PT Trans Jaya', arrivalPurpose: 'Service', licensePlate: 'B 9999 SZK', bookingTime: '11:00', categoryPassComm: 'Commercial', vehicleModel: 'Suzuki Carry Pick Up' }
  ]);
  const [tickets, setTickets] = useState([]);
  const [historyTickets, setHistoryTickets] = useState([]);
  const [wabHistory, setWabHistory] = useState([]);
  const [viewWabHistoryTicketId, setViewWabHistoryTicketId] = useState(null);

  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [arrivalPurpose, setArrivalPurpose] = useState('');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [pendingCheckInMobile, setPendingCheckInMobile] = useState(null);
  const [successCheckInModalMobile, setSuccessCheckInModalMobile] = useState(null);

  const [showEditTicketModal, setShowEditTicketModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editForm, setEditForm] = useState({
    licensePlate: '',
    vehicleModel: '',
    arrivalPurpose: 'Service'
  });

  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [checkingOutTicket, setCheckingOutTicket] = useState(null);

  const [assetPortIndex, setAssetPortIndex] = useState(0);
  const assetPorts = ['5173', '5174', '5000'];
  const currentAssetBase = `http://${HOST_IP}:${assetPorts[assetPortIndex]}`;

  const [showSigModal, setShowSigModal] = useState(false);
  const [sigType, setSigType] = useState('customer');
  const [hasSaSigned, setHasSaSigned] = useState(false);
  const [hasCustomerSigned, setHasCustomerSigned] = useState(false);
  const [saSignaturePaths, setSaSignaturePaths] = useState([]);
  const [customerSignaturePaths, setCustomerSignaturePaths] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [wabStep, setWabStep] = useState(1);
  const [saCustomerName, setSaCustomerName] = useState('');
  const [saCustomerPhone, setSaCustomerPhone] = useState('');
  const [customerComplaints, setCustomerComplaints] = useState('');
  const [serviceType, setServiceType] = useState('Periodic Service 10.000 KM');

  const [frameIndex, setFrameIndex] = useState(1);
  const [damages, setDamages] = useState([
    { id: '1', frame: 1, x: 45, y: 55, damageType: 'Scratch', severity: 'Low', notes: 'Baret halus di bumper depan' }
  ]);
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [pendingTap, setPendingTap] = useState(null);
  const [damageType, setDamageType] = useState('Scratch');
  const [severity, setSeverity] = useState('Low');
  const [damageNotes, setDamageNotes] = useState('');
  const [damagePhoto, setDamagePhoto] = useState(null);
  const [editingDamageItem, setEditingDamageItem] = useState(null);
  const [functionalInspectionsMobile, setFunctionalInspectionsMobile] = useState([
    { id: 'horn', name: 'Klakson / Horn', status: 'OK', notes: '' },
    { id: 'wiper', name: 'Wiper & Air Washer', status: 'OK', notes: '' },
    { id: 'ac', name: 'Sistem AC / Pendingin', status: 'OK', notes: '' },
    { id: 'tires', name: 'Kondisi Ban & Tekanan Angin', status: 'OK', notes: '' },
    { id: 'radiator', name: 'Cairan Radiator / Coolant', status: 'OK', notes: '' },
    { id: 'lights', name: 'Sistem Lampu (Headlamp/Tail/Sein)', status: 'OK', notes: '' },
    { id: 'battery', name: 'Aki / Baterai', status: 'OK', notes: '' },
    { id: 'brake', name: 'Sistem Rem / Minyak Rem', status: 'OK', notes: '' }
  ]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setBookings(data);
      }
    } catch (e) { }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE}/tickets`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setTickets(data);
      }
    } catch (e) { }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBookings();
      fetchTickets();
      const interval = setInterval(() => {
        fetchBookings();
        fetchTickets();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchBookings(), fetchTickets()]);
    setRefreshing(false);
  };

  const handleLogin = (role) => {
    const targetRole = role || mobileSelectedRole;
    setUserRole(targetRole);
    if (targetRole === 'Security') setActiveTab('bookings');
    if (targetRole === 'ServiceAdvisor') setActiveTab('daftar-tamu');
    if (targetRole === 'Foreman') setActiveTab('foreman');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    Alert.alert("Logout Berhasil", "Anda telah keluar dari akun.");
  };

  const handleOpenWalkInModal = () => {
    setLicensePlate('');
    setVehicleModel('');
    setArrivalPurpose('Service');
    setShowWalkInModal(true);
  };

  const handleCheckInBooking = (b) => {
    setPendingCheckInMobile({ type: 'booking', data: b });
  };

  const handleSecurityCheckInSubmit = () => {
    if (!licensePlate || !licensePlate.trim()) {
      Alert.alert("Perhatian", "Mohon isi Nomor Polisi kendaraan terlebih dahulu.");
      return;
    }
    const targetPurpose = arrivalPurpose || 'Service';
    setShowWalkInModal(false);

    executeCheckInProcess('walkin', {
      licensePlate: licensePlate.toUpperCase().trim(),
      vehicleModel: vehicleModel || 'Suzuki Vehicle',
      arrivalPurpose: targetPurpose
    });
  };

  const handleExecuteConfirmedCheckInMobile = () => {
    if (!pendingCheckInMobile) return;
    const { type, data } = pendingCheckInMobile;
    setPendingCheckInMobile(null);
    executeCheckInProcess(type, data);
  };

  const executeCheckInProcess = async (type, data) => {
    const selectedPurposeStr = getPurposeString(data.arrivalPurpose || 'Service');
    const isService = selectedPurposeStr.toLowerCase() === 'service';
    const purposeEnum = selectedPurposeStr === 'Service' ? 0 : selectedPurposeStr === 'Sales' ? 1 : selectedPurposeStr === 'BodyRepair' ? 2 : 3;
    const inputPlate = (data.licensePlate || '').toUpperCase().trim();

    const newTicket = {
      ticketId: 't-' + Date.now(),
      queueNumber: isService ? 'W-' + Math.floor(100 + Math.random() * 900) : null,
      licensePlate: inputPlate,
      vehicleModel: data.vehicleModel || 'Suzuki Vehicle',
      arrivalPurpose: selectedPurposeStr,
      customerName: data.customerName || '',
      status: 'CheckedIn',
      checkInTime: new Date().toISOString()
    };

    setTickets(prev => [newTicket, ...prev]);

    if (type === 'booking' && data.sdmsBookingId) {
      setBookings(prev => prev.filter(item => item.sdmsBookingId !== data.sdmsBookingId));
    }
    if (type === 'walkin') {
      setLicensePlate('');
      setVehicleModel('');
      setArrivalPurpose('Service');
    }

    setSuccessCheckInModalMobile({
      queueNumber: newTicket.queueNumber,
      licensePlate: inputPlate,
      purpose: selectedPurposeStr
    });

    setTimeout(() => {
      setSuccessCheckInModalMobile(null);
    }, 2500);

    try {
      await fetch(`${API_BASE}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licensePlate: inputPlate,
          vehicleModel: data.vehicleModel || 'Suzuki Vehicle',
          arrivalPurpose: purposeEnum,
          sdmsBookingId: data.sdmsBookingId || null
        })
      });
    } catch (e) { }
  };

  const handleOpenEditModal = (t) => {
    setEditingTicket(t);
    setEditForm({
      licensePlate: t.licensePlate || '',
      vehicleModel: t.vehicleModel || 'Suzuki XL7 Alpha',
      arrivalPurpose: t.arrivalPurpose || 'Service'
    });
    setShowEditTicketModal(true);
  };

  const handleSaveEditTicket = () => {
    if (!editingTicket) return;
    if (!editForm.licensePlate) {
      Alert.alert("Form Belum Lengkap", "Mohon isi Nomor Polisi kendaraan.");
      return;
    }
    const isService = editForm.arrivalPurpose === 'Service';
    setTickets(tickets.map(item => {
      if (item.ticketId === editingTicket.ticketId) {
        return {
          ...item,
          licensePlate: editForm.licensePlate.toUpperCase(),
          vehicleModel: editForm.vehicleModel,
          arrivalPurpose: editForm.arrivalPurpose,
          queueNumber: isService ? (item.queueNumber || 'W-' + Math.floor(100 + Math.random() * 900)) : null
        };
      }
      return item;
    }));
    setShowEditTicketModal(false);
    Alert.alert("✓ Edit Berhasil!", `Data kendaraan ${editForm.licensePlate.toUpperCase()} berhasil diperbarui.`);
  };

  const handleOpenCheckOutModal = (t) => {
    setCheckingOutTicket(t);
    setShowCheckOutModal(true);
  };

  const handleConfirmCheckOut = async () => {
    if (!checkingOutTicket) return;
    const target = checkingOutTicket;
    setShowCheckOutModal(false);

    const checkedOutItem = {
      ...target,
      status: 'CheckedOut',
      checkOutTime: new Date().toISOString()
    };
    setHistoryTickets(prev => [checkedOutItem, ...prev]);
    setTickets(prev => prev.filter(item => item.ticketId !== target.ticketId));

    setSuccessCheckInModalMobile({
      title: 'Check-Out Berhasil!',
      licensePlate: target.licensePlate,
      details: `Kendaraan ${target.licensePlate} telah rilis dari gerbang & dipindahkan ke Riwayat.`
    });

    setTimeout(() => {
      setSuccessCheckInModalMobile(null);
    }, 2500);

    setCheckingOutTicket(null);

    try {
      await fetch(`${API_BASE}/security/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: target.ticketId })
      });
    } catch (e) { }
  };

  const handleStartWab = async (t) => {
    setSelectedTicket(t);
    setSaCustomerName(t.customerName === 'Diisi oleh SA di WAB' ? '' : (t.customerName || ''));
    setSaCustomerPhone(t.customerPhone || '');
    setWabStep(1);
    setActiveTab('wab-form');

    setTickets(prev => prev.map(item => item.ticketId === t.ticketId ? { ...item, status: 'WabInProgress' } : item));
    try {
      await fetch(`${API_BASE}/tickets/wab`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: t.ticketId, customerName: t.customerName || 'Pelanggan' })
      });
    } catch (e) { }
  };

  const handleFinalizeWabMobile = () => {
    if (!saCustomerName) {
      Alert.alert("Form Belum Lengkap", "Mohon lengkapi Nama Pelanggan di Step 1!");
      return;
    }

    // Save WAB snapshot to history
    const wabEntry = {
      ...selectedTicket,
      status: 'WabDone',
      wabSubmitted: true,
      wabSubmittedAt: new Date().toISOString(),
      wabCustomerName: saCustomerName,
      wabCustomerPhone: saCustomerPhone,
      wabComplaints: customerComplaints,
      wabServiceType: serviceType,
      wabDamages: damages,
      wabInspections: functionalInspectionsMobile,
    };
    setWabHistory(prev => [wabEntry, ...prev]);

    // Update ticket status in guest list
    setTickets(prev => prev.map(item =>
      item.ticketId === selectedTicket.ticketId
        ? { ...item, status: 'WabDone', wabSubmitted: true, wabCustomerName: saCustomerName }
        : item
    ));

    Alert.alert("Form WAB Berhasil!", `Data WAB & Inspeksi 360° untuk kendaraan ${selectedTicket.licensePlate} telah diteruskan ke Foreman.`);
    setSelectedTicket(null);
    setActiveTab('daftar-tamu');
  };

  const handleViewWabHistory = (ticket) => {
    setViewWabHistoryTicketId(ticket.ticketId);
    setActiveTab('history');
  };

  const handleForemanFinishJob = (ticketId) => {
    setTickets(prev => prev.map(item =>
      item.ticketId === ticketId
        ? { ...item, status: 'ServiceCompleted' }
        : item
    ));
    setWabHistory(prev => prev.map(item =>
      item.ticketId === ticketId
        ? { ...item, status: 'ServiceCompleted' }
        : item
    ));
  };

  const handleForemanUpdateTracking = ({ ticketId, stallName, technicianName, foremanRecommendation, addExtraMinutes }) => {
    setTickets(prev => prev.map(item =>
      item.ticketId === ticketId
        ? { ...item, status: 'InService', stallName, technicianName, foremanRecommendation, foremanExtraMinutes: addExtraMinutes }
        : item
    ));
    setWabHistory(prev => prev.map(item =>
      item.ticketId === ticketId
        ? { ...item, status: 'InService', stallName, technicianName, foremanRecommendation, foremanExtraMinutes: addExtraMinutes }
        : item
    ));
  };

  const handleFunctionalChangeMobile = (id, field, value) => {
    setFunctionalInspectionsMobile(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleCarImageTouch = (evt, targetW = 300, targetH = 180, activeFrame = null) => {
    const { locationX, locationY } = evt.nativeEvent;
    const width = (targetW && targetW > 0) ? targetW : 300;
    const height = (targetH && targetH > 0) ? targetH : 180;
    const xPct = Math.max(5, Math.min(95, Math.round((locationX / width) * 100)));
    const yPct = Math.max(5, Math.min(95, Math.round((locationY / height) * 100)));
    const targetFrame = (activeFrame !== null && activeFrame !== undefined) ? activeFrame : frameIndex;
    setPendingTap({ x: xPct, y: yPct, frame: targetFrame });
    setEditingDamageItem(null);
    setDamageType('Scratch');
    setSeverity('Low');
    setDamageNotes('');
    setDamagePhoto(null);
    setShowDamageModal(true);
  };

  const handleOpenEditDamageModal = (item) => {
    setEditingDamageItem(item);
    setDamageType(item.damageType || 'Scratch');
    setSeverity(item.severity || 'Low');
    setDamageNotes(item.notes || '');
    setDamagePhoto(item.photoUri || null);
    setShowDamageModal(true);
  };

  const handleSaveDamageItem = () => {
    if (editingDamageItem) {
      setDamages(prev => prev.map(d => {
        if (d.id === editingDamageItem.id) {
          return {
            ...d,
            damageType,
            severity,
            notes: damageNotes,
            photoUri: damagePhoto,
          };
        }
        return d;
      }));
      setShowDamageModal(false);
      setEditingDamageItem(null);
      setDamageNotes('');
      setDamagePhoto(null);
      Alert.alert("Kerusakan Diperbarui", `Titik kerusakan ${damageType} (${severity}) berhasil diperbarui!`);
      return;
    }

    if (!pendingTap) return;
    const newDamage = {
      id: Date.now().toString(),
      frame: pendingTap.frame,
      x: pendingTap.x,
      y: pendingTap.y,
      damageType,
      severity,
      notes: damageNotes || `${damageType} pada frame ${pendingTap.frame}`,
      photoUri: damagePhoto || null,
    };
    setDamages([...damages, newDamage]);
    setShowDamageModal(false);
    setDamageNotes('');
    setDamagePhoto(null);
    Alert.alert("Kerusakan Dicatat", `Titik kerusakan ${damageType} (${severity}) berhasil ditambahkan!`);
  };

  const handleDeleteDamageItem = (targetItem) => {
    Alert.alert(
      "Hapus Titik Kerusakan",
      `Apakah Anda yakin ingin menghapus catatan kerusakan ${targetItem.damageType} (Frame ${targetItem.frame})?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            setDamages(prev => prev.filter(item => item.id !== targetItem.id));
          }
        }
      ]
    );
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#002b5c' }}>
          <SafeAreaView edges={['top']} style={{ backgroundColor: '#002b5c' }} />
          <View style={{ flex: 1, backgroundColor: '#002b5c' }}>
            <LoginScreen
              mobileEmailInput={mobileEmailInput}
              setMobileEmailInput={setMobileEmailInput}
              mobilePasswordInput={mobilePasswordInput}
              setMobilePasswordInput={setMobilePasswordInput}
              mobileShowPassword={mobileShowPassword}
              setMobileShowPassword={setMobileShowPassword}
              mobileSelectedRole={mobileSelectedRole}
              setMobileSelectedRole={setMobileSelectedRole}
              onLogin={handleLogin}
            />
          </View>
          <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#ffffff' }} />

          {/* ABSOLUTE OVERLAY SPLASH FOR 100% ZERO-BLINK SEAMLESS HANDOVER */}
          {showSplash && (
            <View style={[StyleSheet.absoluteFillObject, { zIndex: 99999 }]}>
              <SplashScreen onFinish={() => setShowSplash(false)} />
            </View>
          )}
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.container}>
      <Header />

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1e40af']}
            tintColor={'#1e40af'}
          />
        }
      >
        {activeTab === 'bookings' && userRole === 'Security' && (
          <BookingListScreen
            bookings={bookings}
            bookingSearchQuery={bookingSearchQuery}
            setBookingSearchQuery={setBookingSearchQuery}
            onOpenWalkInModal={handleOpenWalkInModal}
            onCheckInBooking={handleCheckInBooking}
          />
        )}

        {activeTab === 'daftar-tamu' && (
          <GuestListScreen
            tickets={tickets}
            userRole={userRole}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterPurpose={filterPurpose}
            setFilterPurpose={setFilterPurpose}
            onStartWab={handleStartWab}
            onOpenEditModal={handleOpenEditModal}
            onOpenCheckOutModal={handleOpenCheckOutModal}
            onViewWabHistory={handleViewWabHistory}
          />
        )}

        {activeTab === 'wab-form' && userRole === 'ServiceAdvisor' && (
          <WabFormScreen
            selectedTicket={selectedTicket}
            wabStep={wabStep}
            setWabStep={setWabStep}
            saCustomerName={saCustomerName}
            setSaCustomerName={setSaCustomerName}
            saCustomerPhone={saCustomerPhone}
            setSaCustomerPhone={setSaCustomerPhone}
            customerComplaints={customerComplaints}
            setCustomerComplaints={setCustomerComplaints}
            serviceType={serviceType}
            setServiceType={setServiceType}
            frameIndex={frameIndex}
            setFrameIndex={setFrameIndex}
            damages={damages}
            currentAssetBase={currentAssetBase}
            assetPortIndex={assetPortIndex}
            setAssetPortIndex={setAssetPortIndex}
            assetPorts={assetPorts}
            functionalInspectionsMobile={functionalInspectionsMobile}
            onFunctionalChangeMobile={handleFunctionalChangeMobile}
            hasSaSigned={hasSaSigned}
            hasCustomerSigned={hasCustomerSigned}
            saSignaturePaths={saSignaturePaths}
            customerSignaturePaths={customerSignaturePaths}
            onOpenSaSignatureModal={() => { setSigType('sa'); setShowSigModal(true); }}
            onOpenCustomerSignatureModal={() => { setSigType('customer'); setShowSigModal(true); }}
            onFinalizeWab={handleFinalizeWabMobile}
            onNavigateToGuestList={() => setActiveTab('daftar-tamu')}
            onCarImageTouch={handleCarImageTouch}
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
            isEditingDamage={!!editingDamageItem}
            onEditDamageItem={handleOpenEditDamageModal}
            onSaveDamageItem={handleSaveDamageItem}
            onDeleteDamageItem={handleDeleteDamageItem}
          />
        )}

        {activeTab === 'foreman' && userRole === 'Foreman' && (
          <ForemanScreen
            tickets={tickets}
            wabHistory={wabHistory}
            foremanCurrentName="Foreman A"
            onFinishJob={handleForemanFinishJob}
            onUpdateTracking={handleForemanUpdateTracking}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            wabHistory={wabHistory}
            historyTickets={historyTickets}
            initialTicketId={viewWabHistoryTicketId}
            onClearInitialTicket={() => setViewWabHistoryTicketId(null)}
          />
        )}

        {activeTab === 'account' && (
          <AccountScreen userRole={userRole} onLogout={handleLogout} />
        )}
      </ScrollView>

      <BottomNav
        userRole={userRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <SignatureModal
        visible={showSigModal}
        onClose={() => setShowSigModal(false)}
        onSave={(drawnPaths) => {
          if (sigType === 'sa') {
            setHasSaSigned(true);
            setSaSignaturePaths(drawnPaths || []);
          } else {
            setHasCustomerSigned(true);
            setCustomerSignaturePaths(drawnPaths || []);
          }
        }}
        title={sigType === 'sa' ? 'Tanda Tangan Service Advisor (SA)' : 'Tanda Tangan Digital Pelanggan'}
        subtitle={sigType === 'sa' ? 'Silakan tanda tangan SA untuk pengesahan WAB.' : 'Silakan tanda tangan pelanggan untuk persetujuan WAB.'}
      />

      <WalkInModal
        visible={showWalkInModal}
        onClose={() => setShowWalkInModal(false)}
        licensePlate={licensePlate}
        setLicensePlate={setLicensePlate}
        vehicleModel={vehicleModel}
        setVehicleModel={setVehicleModel}
        showModelDropdown={showModelDropdown}
        setShowModelDropdown={setShowModelDropdown}
        arrivalPurpose={arrivalPurpose}
        setArrivalPurpose={setArrivalPurpose}
        onSubmit={handleSecurityCheckInSubmit}
      />

      <EditTicketModal
        visible={showEditTicketModal}
        onClose={() => setShowEditTicketModal(false)}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleSaveEditTicket}
      />

      <CheckOutModal
        visible={showCheckOutModal}
        checkingOutTicket={checkingOutTicket}
        onClose={() => setShowCheckOutModal(false)}
        onConfirm={handleConfirmCheckOut}
      />

      <PendingCheckInModal
        pendingCheckIn={pendingCheckInMobile}
        onClose={() => setPendingCheckInMobile(null)}
        onConfirm={handleExecuteConfirmedCheckInMobile}
      />

      <SuccessCheckInModal
        data={successCheckInModalMobile}
        onClose={() => setSuccessCheckInModalMobile(null)}
      />
    </SafeAreaView>
    </SafeAreaProvider>
  );
}
