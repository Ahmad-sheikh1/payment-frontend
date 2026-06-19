import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AdminHeader } from '../components/AdminHeader';
import { RestaurantAdminTheme as theme } from '../constants/theme';
import { clearMerchantSession, getMerchantSession } from '../auth/session';
import { AdminRoutes } from '../constants/routes';

export default function RestaurantSettingsScreen() {
  const router = useRouter();
  const merchant = getMerchantSession();

  useEffect(() => {
    if (!merchant || merchant.type !== 'restaurant') {
      router.replace(AdminRoutes.login);
    }
  }, [merchant, router]);

  if (!merchant) return null;

  const handleLogout = () => {
    Alert.alert('Logout', 'Restaurant admin se logout karein?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          clearMerchantSession();
          router.replace(AdminRoutes.login);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
      <AdminHeader title="Restaurant Settings" subtitle={merchant.businessName} headerBg={theme.headerBg} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Restaurant Profile</Text>
          <InfoRow label="Restaurant Name" value={merchant.businessName} />
          <InfoRow label="Owner" value={merchant.ownerName} />
          <InfoRow label="Email" value={merchant.email} />
          <InfoRow label="Phone" value={merchant.phone} />
          <InfoRow label="Address" value={merchant.address} />
          <InfoRow label="Account Type" value="Restaurant Merchant" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Operating Hours</Text>
          <InfoRow label="Opening" value="11:00 AM" />
          <InfoRow label="Closing" value="12:00 AM" />
          <InfoRow label="Delivery Radius" value="5 km" />
          <InfoRow label="Min Order" value="₨300" />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout from Restaurant Admin</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cardTitle: { fontSize: 15, fontWeight: '900', color: theme.text, marginBottom: 12 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: { fontSize: 13, color: theme.muted, fontWeight: '600' },
  infoValue: { fontSize: 13, color: theme.text, fontWeight: '700', maxWidth: '58%', textAlign: 'right' },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: { color: '#DC2626', fontWeight: '900', fontSize: 14 },
});
