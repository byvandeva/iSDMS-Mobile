import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../../theme/theme';

export default function LoginScreen({
  mobileEmailInput,
  setMobileEmailInput,
  mobilePasswordInput,
  setMobilePasswordInput,
  mobileShowPassword,
  setMobileShowPassword,
  mobileSelectedRole,
  setMobileSelectedRole,
  onLogin,
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#002b5c" />

      <View style={styles.topHeader}>
        <Image
          source={require('../../../../assets/suzuki_white_logo.svg')}
          style={styles.logoImage}
          contentFit="contain"
        />
      </View>

      <View style={styles.bottomCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email / Username</Text>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={18} color="#0f172a" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="user@suzuki.co.id"
                placeholderTextColor="#94a3b8"
                value={mobileEmailInput}
                onChangeText={setMobileEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Kata Sandi (Password)</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={18} color="#0f172a" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { paddingRight: 40 }]}
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                value={mobilePasswordInput}
                onChangeText={setMobilePasswordInput}
                secureTextEntry={!mobileShowPassword}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setMobileShowPassword(!mobileShowPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather
                  name={mobileShowPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.roleBox}>
            <Text style={styles.roleBoxTitle}>
              Pilih Role (Bypass Login Cepat):
            </Text>
            <View style={styles.roleChipsRow}>
              {[
                { role: 'Security', label: 'Security', email: 'security@suzuki.co.id' },
                { role: 'ServiceAdvisor', label: 'Service Advisor', email: 'sa@suzuki.co.id' },
                { role: 'Foreman', label: 'Foreman', email: 'foreman@suzuki.co.id' },
              ].map(item => {
                const isSelected = mobileSelectedRole === item.role;
                return (
                  <TouchableOpacity
                    key={item.role}
                    style={[
                      styles.roleChip,
                      isSelected && styles.roleChipActive
                    ]}
                    onPress={() => {
                      setMobileSelectedRole(item.role);
                      setMobileEmailInput(item.email);
                      setMobilePasswordInput('suzuki2026');
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={[
                        styles.roleChipText,
                        isSelected && styles.roleChipTextActive
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => onLogin(mobileSelectedRole)}
            activeOpacity={0.85}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002b5c',
  },
  topHeader: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002b5c',
    paddingTop: 10,
  },
  logoImage: {
    width: 210,
    height: 85,
    resizeMode: 'contain',
    tintColor: '#ffffff',
  },
  bottomCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    paddingTop: 28,
    paddingHorizontal: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 28,
  },
  fieldContainer: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    height: '100%',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  roleBox: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 4,
    marginBottom: 18,
  },
  roleBoxTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleChipsRow: {
    flexDirection: 'row',
    gap: 5,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleChipActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  roleChipText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#334155',
    textAlign: 'center',
  },
  roleChipTextActive: {
    color: '#ffffff',
  },
  signInButton: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
