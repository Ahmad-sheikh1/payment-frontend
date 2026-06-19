import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AdminHeader } from '../components/AdminHeader';
import { StatCard } from '../components/StatCard';
import { ShopAdminTheme as theme } from '../constants/theme';
import { clearMerchantSession, getMerchantSession } from '../auth/session';
import { AdminRoutes } from '../constants/routes';

const RECENT_ORDERS = [
  { id: 'SH-1042', customer: 'Ali Raza', total: '₨2,499', status: 'Pending' },
  { id: 'SH-1041', customer: 'Hina Malik', total: '₨849', status: 'Shipped' },
  { id: 'SH-1040', customer: 'Usman Tariq', total: '₨4,998', status: 'Delivered' },
];

export default function ShopDashboardScreen() {
  const router = useRouter();
  const merchant = getMerchantSession();

  useEffect(() => {
    if (!merchant || merchant.type !== 'shop') {
      router.replace(AdminRoutes.login);
    }
  }, [merchant, router]);

  if (!merchant) return null;

  const handleLogout = () => {
    Alert.alert('Logout', 'Shop admin se logout karein?', [
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
        title="Shop Admin"
        subtitle={merchant.businessName}
        headerBg={theme.headerBg}
        onLogout={handleLogout}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Welcome, {merchant.ownerName} 👋</Text>
          <Text style={styles.welcomeSub}>Manage your shop products & orders</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Today's Orders" value="18" icon="📦" color={theme.primary} bg="#DBEAFE" />
          <StatCard label="Revenue Today" value="₨42,500" icon="💰" color="#15803D" bg="#DCFCE7" />
        </View>
        <View style={styles.statsRow}>
          <StatCard label="Active Products" value="124" icon="🏷️" color={theme.primary} bg="#DBEAFE" />
          <StatCard label="Pending Orders" value="5" icon="⏳" color="#B45309" bg="#FEF3C7" />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(AdminRoutes.shop.orders)}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(AdminRoutes.shop.products)}>
            <Text style={styles.actionIcon}>🛍️</Text>
            <Text style={styles.actionText}>Products</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(AdminRoutes.shop.settings)}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {RECENT_ORDERS.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.orderCustomer}>{order.customer}</Text>
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
    borderColor: '#DBEAFE',
  },
  actionIcon: { fontSize: 24, marginBottom: 6 },
  actionText: { fontSize: 12, fontWeight: '700', color: theme.primary },
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
