import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AdminHeader } from '../components/AdminHeader';
import { ShopAdminTheme as theme } from '../constants/theme';
import { getMerchantSession } from '../auth/session';
import { AdminRoutes } from '../constants/routes';
import { API_URL } from '../../apiConfig';

const ORDERS = [
  { id: 'SH-1042', customer: 'Ali Raza', items: 'Keyboard x1', total: 2499, status: 'Pending' },
  { id: 'SH-1041', customer: 'Hina Malik', items: 'Wallet x1', total: 849, status: 'Shipped' },
  { id: 'SH-1040', customer: 'Usman Tariq', items: 'Speaker x2', total: 4998, status: 'Delivered' },
  { id: 'SH-1039', customer: 'Ayesha Noor', items: 'USB Hub x1', total: 1649, status: 'Cancelled' },
];

const STATUS_COLORS: Record<string, string> = {
  Pending: '#F59E0B',
  Shipped: '#2563EB',
  Delivered: '#16A34A',
  Cancelled: '#DC2626',
};

export default function ShopOrdersScreen() {
  const router = useRouter();
  const merchant = getMerchantSession();
  const [filter, setFilter] = useState('All');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!merchant || merchant.type !== 'shop') {
      router.replace(AdminRoutes.login);
      return;
    }
    const loadMerchantOrders = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch from API
        let apiOrders: any[] = [];
        try {
          const res = await axios.get(`${API_URL}/api/orders/merchant/${merchant.id}`);
          apiOrders = res.data;
        } catch (apiErr) {
          console.log("Failed to fetch merchant orders from API:", apiErr);
        }

        // 2. Fetch from AsyncStorage (@all_orders)
        let localOrders: any[] = [];
        try {
          const raw = await AsyncStorage.getItem('@all_orders');
          if (raw) {
            const parsed = JSON.parse(raw);
            localOrders = parsed.filter((o: any) => o.merchantId === merchant.id || o.merchantId === 'bus_' + merchant.id || o.shopName === merchant.businessName);
          }
        } catch (storageErr) {
          console.error("Failed to load local offline orders:", storageErr);
        }

        // 3. Merge and sort
        const combined = [...localOrders, ...apiOrders];
        
        if (combined.length === 0 && merchant.email === 'shop@haiderpay.com') {
          setOrders(ORDERS);
        } else {
          const unique: any[] = [];
          const seen = new Set();
          for (const o of combined) {
            const key = o.orderId || o.id;
            if (!seen.has(key)) {
              seen.add(key);
              unique.push(o);
            }
          }
          setOrders(unique);
          
          const newOrders = unique.filter(o => o.status === 'New' || o.status === 'Pending');
          if (newOrders.length > 0) {
            Alert.alert(
              'New Order Alert 📦',
              `Aapke paas ${newOrders.length} naya order(s) aaye hain! Products packing shuru karein.`
            );
          }
        }
      } catch (err) {
        console.error("Failed to process orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMerchantOrders();
  }, [merchant?.id]);

  if (!merchant) return null;

  const filtered = filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
      <AdminHeader title="Shop Orders" subtitle={merchant.businessName} headerBg={theme.headerBg} />

      <View style={styles.filterRow}>
        {['All', 'Pending', 'Shipped', 'Delivered'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterBtn, filter === tab && styles.filterBtnActive]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={{ color: theme.muted, marginTop: 8, fontSize: 13 }}>Orders loading...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 32 }}>📦</Text>
            <Text style={{ color: theme.muted, marginTop: 8, fontSize: 13 }}>Abhi tak koi orders nahi hain.</Text>
          </View>
        ) : (
          filtered.map((order) => (
            <View key={order.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.orderId}>{order.id}</Text>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[order.status] + '22' }]}>
                  <Text style={[styles.badgeText, { color: STATUS_COLORS[order.status] }]}>{order.status}</Text>
                </View>
              </View>
              <Text style={styles.customer}>{order.customer}</Text>
              <Text style={styles.items}>{order.items}</Text>
              <Text style={styles.total}>₨{order.total.toLocaleString()}</Text>

              {order.status === 'Pending' && (
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.shipBtn} onPress={() => updateStatus(order.id, 'Shipped')}>
                    <Text style={styles.shipBtnText}>Mark Shipped</Text>
                  </TouchableOpacity>
                </View>
              )}
              {order.status === 'Shipped' && (
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.deliverBtn} onPress={() => updateStatus(order.id, 'Delivered')}>
                    <Text style={styles.deliverBtnText}>Mark Delivered</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  filterBtnActive: { backgroundColor: theme.primary },
  filterText: { fontSize: 12, fontWeight: '700', color: theme.muted },
  filterTextActive: { color: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 14, fontWeight: '900', color: theme.text },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  customer: { fontSize: 14, fontWeight: '700', color: theme.text, marginTop: 8 },
  items: { fontSize: 12, color: theme.muted, marginTop: 2 },
  total: { fontSize: 16, fontWeight: '900', color: theme.primary, marginTop: 8 },
  actions: { marginTop: 12 },
  shipBtn: {
    backgroundColor: theme.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  shipBtnText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  deliverBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deliverBtnText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
});
