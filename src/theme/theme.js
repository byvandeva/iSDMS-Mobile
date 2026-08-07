import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#0f172a',        
  primaryHover: '#1e293b',
  accentBlue: '#0054a6',
  accentLightBlue: '#0284c7',
  
  background: '#f8fafc',    
  cardBg: '#ffffff',
  
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  textDarkLabel: '#334155',
  
  border: '#cbd5e1',
  borderLight: '#e2e8f0',
  
  success: '#16a34a',
  successDark: '#15803d',
  successBg: '#f0fdf4',
  successBorder: '#bbf7d0',
  
  danger: '#be123c',
  dangerBg: '#ffe4e6',
  dangerBorder: '#fecdd3',
  
  warning: '#f59e0b',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 0,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  itemBox: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: COLORS.cardBg,
  },
  queueBadge: {
    backgroundColor: COLORS.primary,
    color: '#ffffff',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  plateText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  customerText: {
    fontWeight: '600',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  subDetailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDarkLabel,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    borderRadius: 6,
    fontSize: 14,
    backgroundColor: COLORS.background,
  },
  purposeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 6,
  },
  purposeChip: {
    width: '48.5%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardBg,
  },
  purposeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  purposeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDarkLabel,
  },
  purposeTextActive: {
    color: '#ffffff',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 18,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
