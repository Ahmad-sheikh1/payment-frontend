import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Retrieve parameters
  const orderId = (params.orderId as string) || 'ORD-000000';
  const total = (params.total as string) || '0';
  const paymentMethod = (params.paymentMethod as string) || 'cod';
  
  // Format payment display
  const getPaymentName = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Cash on Delivery 💵';
      case 'jazzcash':
        return 'JazzCash Wallet 🔴';
      case 'easypaisa':
        return 'Easypaisa Wallet 🟢';
      case 'card':
        return 'Credit / Debit Card 💳';
      default:
        return 'Paid';
    }
  };

  const addressSummary = params.addressCity
    ? `${params.addressArea}, ${params.addressCity}`
    : 'Lahore, Pakistan';

  const handleTrackOrder = () => {
    router.push({
      pathname: '/order-tracking',
      params: { orderId },
    });
  };

  const handleContinueShopping = () => {
    // Navigate back to home
    router.dismissAll();
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* SUCCESS ANIMATION SHIELD */}
      <View style={styles.successWrapper}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        <Text style={styles.successTitle}>Order Placed!</Text>
        <Text style={styles.successSubtitle}>Your order has been placed successfully.</Text>
      </View>

      {/* ORDER DETAILS CARD */}
      <View style={styles.card}>
        <View style={styles.infoLine}>
          <Text style={styles.infoLabel}>Order ID</Text>
          <Text style={styles.infoVal}>{orderId}</Text>
        </View>

        <View style={styles.infoLine}>
          <Text style={styles.infoLabel}>Total Amount</Text>
          <Text style={[styles.infoVal, { color: '#FF4010', fontWeight: '800' }]}>₨{parseInt(total, 10).toLocaleString()}</Text>
        </View>

        <View style={styles.infoLine}>
          <Text style={styles.infoLabel}>Payment</Text>
          <Text style={styles.infoValLight}>{getPaymentName(paymentMethod)}</Text>
        </View>

        <View style={styles.infoLine}>
          <Text style={styles.infoLabel}>Delivery</Text>
          <Text style={styles.infoValLight}>2-3 Business Days</Text>
        </View>

        <View style={styles.infoLine}>
          <Text style={styles.infoLabel}>Address</Text>
          <Text style={styles.infoValLight} numberOfLines={2}>{addressSummary}</Text>
        </View>
      </View>

      {/* ESTIMATED DELIVERY BLOCK */}
      <View style={styles.deliveryEstimate}>
        <Text style={styles.deliveryEstimateText}>
          🚚 <Text style={{ fontWeight: '700' }}>Estimated Delivery:</Text> Mon, Jun 16 - Wed, Jun 18
        </Text>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.btnGroup}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleTrackOrder} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>📦 Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={handleContinueShopping} activeOpacity={0.85}>
          <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 24,
    justifyContent: 'center',
  },
  successWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 48,
    color: '#00A650',
    fontWeight: '900',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333333',
    marginTop: 20,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 16,
    elevation: 2,
    marginBottom: 16,
  },
  infoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: '#888888',
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },
  infoValLight: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  deliveryEstimate: {
    backgroundColor: '#FFF5F2',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFEBE5',
  },
  deliveryEstimateText: {
    fontSize: 13,
    color: '#555555',
  },
  btnGroup: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#FF4010',
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryBtn: {
    borderWidth: 2,
    borderColor: '#FF4010',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#FF4010',
    fontWeight: '700',
    fontSize: 15,
  },
});
