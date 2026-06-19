import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AdminHeader } from '../components/AdminHeader';
import { StatCard } from '../components/StatCard';
import { RestaurantAdminTheme as theme } from '../constants/theme';
import { clearMerchantSession, getMerchantSession } from '../auth/session';
import { AdminRoutes } from '../constants/routes';

const LIVE_ORDERS = [
  { id: 'RT-8821', customer: 'Bilal Ahmed', items: 'Biryani x2', total: '₨1,800', status: 'Preparing' },
  { id: 'RT-8820', customer: 'Zainab Khan', items: 'Karahi x1', total: '₨2,200', status: 'Ready' },
  { id: 'RT-8819', customer: 'Hamza Ali', items: 'Naan x4', total: '₨400', status: 'Delivered' },
];

export default function RestaurantDashboardScreen() {
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
      <AdminHeader
        title="Restaurant Admin"
        subtitle={merchant.businessName}
        headerBg={theme.headerBg}
        onLogout={handleLogout}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Welcome, {merchant.ownerName} 🍽️</Text>
          <Text style={styles.welcomeSub}>Manage menu, kitchen orders & delivery</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Orders Today" value="32" icon="🍛" color={theme.primary} bg="#FEE2E2" />
          <StatCard label="Revenue Today" value="₨68,400" icon="💵" color="#15803D" bg="#DCFCE7" />
        </View>
        <View style={styles.statsRow}>
          <StatCard label="Menu Items" value="48" icon="📋" color={theme.primary} bg="#FEE2E2" />
          <StatCard label="In Kitchen" value="7" icon="👨‍🍳" color="#B45309" bg="#FEF3C7" />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(AdminRoutes.restaurant.orders)}>
            <Text style={styles.actionIcon}>🔥</Text>
            <Text style={styles.actionText}>Kitchen Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(AdminRoutes.restaurant.menu)}>
            <Text style={styles.actionIcon}>📖</Text>
            <Text style={styles.actionText}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(AdminRoutes.restaurant.settings)}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Live Orders</Text>
        {LIVE_ORDERS.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.orderCustomer}>{order.customer} • {order.items}</Text>
            </View>
            <View style={styles.orderRight}>
              <Text style={styles.orderTotal}>{order.total}</Text>
              <Text style={styles.orderStatus}>{order.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 16, paddingBottom: 100 },
  welcomeCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  welcomeText: { fontSize: 17, fontWeight: '800', color: theme.text },
  welcomeSub: { fontSize: 13, color: theme.muted, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.text,
    marginTop: 20,
    marginBottom: 12,
  },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  actionIcon: { fontSize: 24, marginBottom: 6 },
  actionText: { fontSize: 11, fontWeight: '700', color: theme.primary, textAlign: 'center' },
  orderCard: {
    backgroundColor: theme.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: { fontSize: 14, fontWeight: '800', color: theme.text },
  orderCustomer: { fontSize: 12, color: theme.muted, marginTop: 2 },
  orderRight: { alignItems: 'flex-end' },
  orderTotal: { fontSize: 14, fontWeight: '800', color: theme.primary },
  orderStatus: { fontSize: 11, color: theme.muted, marginTop: 2 },
});
