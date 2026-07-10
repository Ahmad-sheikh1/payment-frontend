import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AdminHeader } from '../components/AdminHeader';
import { RestaurantAdminTheme as theme } from '../constants/theme';
import { getMerchantSession } from '../auth/session';
import { AdminRoutes } from '../constants/routes';
import { API_URL } from '../../apiConfig';

const ORDERS = [
  { id: 'RT-8821', customer: 'Bilal Ahmed', items: 'Chicken Biryani x2', total: 1800, status: 'New' },
  { id: 'RT-8820', customer: 'Zainab Khan', items: 'Mutton Karahi x1', total: 2200, status: 'Preparing' },
  { id: 'RT-8819', customer: 'Hamza Ali', items: 'Naan x4, Raita x1', total: 550, status: 'Ready' },
  { id: 'RT-8818', customer: 'Sana Sheikh', items: 'BBQ Platter x1', total: 3200, status: 'Delivered' },
];

const STATUS_FLOW = ['New', 'Preparing', 'Ready', 'Delivered'];
const STATUS_COLORS: Record<string, string> = {
  New: '#DC2626',
  Preparing: '#F59E0B',
  Ready: '#2563EB',
  Delivered: '#16A34A',
};

export default function RestaurantOrdersScreen() {
  const router = useRouter();
  const merchant = getMerchantSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!merchant || merchant.type !== 'restaurant') {
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
        
        if (combined.length === 0 && merchant.email === 'restaurant@haiderpay.com') {
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
              'New Kitchen Order Alert 📦',
              `Aapke paas ${newOrders.length} naya kitchen order(s) aaye hain! Cooking shuru karein.`
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

  const advanceOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== id) return order;
        const idx = STATUS_FLOW.indexOf(order.status);
        if (idx < STATUS_FLOW.length - 1) {
          return { ...order, status: STATUS_FLOW[idx + 1] };
        }
        return order;
      }),
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
      <AdminHeader title="Kitchen Orders" subtitle={merchant.businessName} headerBg={theme.headerBg} />

      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={{ color: theme.muted, marginTop: 8, fontSize: 13 }}>Orders loading...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 32 }}>📦</Text>
            <Text style={{ color: theme.muted, marginTop: 8, fontSize: 13 }}>Abhi tak koi orders nahi hain.</Text>
          </View>
        ) : (
          orders.map((order) => (
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

              {order.status !== 'Delivered' && (
                <TouchableOpacity style={styles.nextBtn} onPress={() => advanceOrder(order.id)}>
                  <Text style={styles.nextBtnText}>
                    {order.status === 'New'
                      ? 'Start Preparing'
                      : order.status === 'Preparing'
                        ? 'Mark Ready'
                        : 'Mark Delivered'}
                  </Text>
                </TouchableOpacity>
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
  content: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 14, fontWeight: '900', color: theme.text },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  customer: { fontSize: 14, fontWeight: '700', color: theme.text, marginTop: 8 },
  items: { fontSize: 12, color: theme.muted, marginTop: 2 },
  total: { fontSize: 16, fontWeight: '900', color: theme.primary, marginTop: 8 },
  nextBtn: {
    backgroundColor: theme.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  nextBtnText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
});
