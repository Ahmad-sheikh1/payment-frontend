import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../apiConfig';

export default function ShopCheckoutScreen() {
  const router = useRouter();
  const { shopName } = useLocalSearchParams<{ shopName?: string }>();

  const [currentShopName, setCurrentShopName] = useState(shopName || 'Heaven Slice');
  const [merchantId, setMerchantId] = useState('');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'jazzcash'
  const [jazzcashNumber, setJazzcashNumber] = useState('');

  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        const raw = await AsyncStorage.getItem('@cart_data');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.items && parsed.items.length > 0) {
            setCartItems(parsed.items);
          }
          if (parsed.shopName) {
            setCurrentShopName(parsed.shopName);
          }
          if (parsed.merchantId) {
            setMerchantId(parsed.merchantId);
          }
        }
      } catch (err) {
        console.error("Failed to load cart for checkout:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryCharges = 0;
  const total = subtotal + deliveryCharges;

  const handlePlaceOrder = async () => {
    const orderId = 'RT-' + Math.floor(Math.random() * 9000 + 1000);
    const itemsSummary = cartItems.map(i => `${i.name} x${i.qty}`).join(', ');

    const newOrderObj = {
      id: 'ord_' + Date.now(),
      orderId,
      customer: 'Guest Customer',
      items: itemsSummary || 'No items',
      total,
      status: 'New',
      merchantId: merchantId || '',
      shopName: currentShopName,
      createdAt: new Date().toISOString()
    };

    // 1. Post order to backend
    try {
      await axios.post(`${API_URL}/api/orders`, {
        items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.qty })),
        subtotal,
        total,
        paymentMethod,
        address: {
          type: 'Home',
          details: 'House # 123, Street 5, Block A, Lahore'
        },
        merchantId: merchantId || '',
        shopName: currentShopName
      });
    } catch (apiErr) {
      console.log("Failed to post order to backend:", apiErr);
    }

    // 2. Save order locally in AsyncStorage for offline merchant notification
    try {
      const raw = await AsyncStorage.getItem('@all_orders');
      const existing = raw ? JSON.parse(raw) : [];
      existing.unshift(newOrderObj);
      await AsyncStorage.setItem('@all_orders', JSON.stringify(existing));
    } catch (storageErr) {
      console.error("Failed to save order locally:", storageErr);
    }

    // 3. Clear cart
    await AsyncStorage.removeItem('@cart_data');

    // 4. Go to success
    router.push({
      pathname: '/shop-success',
      params: {
        orderId,
        shopName: currentShopName
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Confirm - {currentShopName}</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
        
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <View>
              <Text style={styles.addressType}>Home</Text>
              <Text style={styles.addressText}>House # 123, Street 5, Block A,{'\n'}Lahore</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          {isLoading ? (
            <ActivityIndicator size="small" color="#D32F2F" />
          ) : (
            cartItems.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemQty}>x {item.qty}</Text>
                <Text style={styles.orderItemPrice}>PKR {(item.price * item.qty).toLocaleString()}</Text>
              </View>
            ))
          )}

          <View style={styles.subtotalContainer}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>PKR {subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Charges</Text>
              <Text style={styles.billValue}>PKR {deliveryCharges}</Text>
            </View>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>PKR {total.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <TouchableOpacity style={styles.paymentOption} onPress={() => setPaymentMethod('cod')} activeOpacity={0.8}>
            <View style={styles.paymentOptionLeft}>
              <Text style={styles.paymentIcon}>💵</Text>
              <Text style={styles.paymentName}>Cash on Delivery</Text>
            </View>
            <View style={[styles.radioOuter, paymentMethod === 'cod' && styles.radioOuterActive]}>
              {paymentMethod === 'cod' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentOption} onPress={() => setPaymentMethod('jazzcash')} activeOpacity={0.8}>
            <View style={styles.paymentOptionLeft}>
              <Text style={styles.paymentIcon}>📱</Text>
              <Text style={styles.paymentName}>JazzCash</Text>
            </View>
            <View style={[styles.radioOuter, paymentMethod === 'jazzcash' && styles.radioOuterActive]}>
              {paymentMethod === 'jazzcash' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          {paymentMethod === 'jazzcash' && (
            <View style={styles.jazzcashInputContainer}>
              <Text style={styles.inputLabel}>JazzCash Mobile Number</Text>
              <TextInput 
                style={styles.textInput}
                placeholder="03XXXXXXXXX"
                keyboardType="phone-pad"
                value={jazzcashNumber}
                onChangeText={setJazzcashNumber}
              />
            </View>
          )}
        </View>

        {/* Place Order Button */}
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.placeOrderBtn} activeOpacity={0.8} onPress={handlePlaceOrder}>
            <Text style={styles.placeOrderBtnText}>Place Order</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { label: 'Home', icon: '🏠', active: false },
          { label: 'Orders', icon: '📄', active: false },
          { label: 'Cart', icon: '🛒', active: false },
          { label: 'Account', icon: '👤', active: false },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navItem} activeOpacity={0.7}>
            <Text style={[styles.navIcon, tab.active && styles.navIconActive]}>{tab.icon}</Text>
            <Text style={[styles.navLabel, tab.active && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 44,
    paddingBottom: 14,
    paddingHorizontal: 14,
  },
  iconButton: {
    padding: 4,
  },
  iconText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  addressType: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  changeText: {
    fontSize: 13,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderItemName: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },
  orderItemQty: {
    width: 30,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  orderItemPrice: {
    width: 80,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  subtotalContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billLabel: {
    fontSize: 13,
    color: '#666',
  },
  billValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  paymentName: {
    fontSize: 14,
    color: '#333',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: '#D32F2F',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D32F2F',
  },
  jazzcashInputContainer: {
    marginTop: -4,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  btnContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  placeOrderBtn: {
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingBottom: 20,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 20,
    color: '#666',
    marginBottom: 4,
  },
  navIconActive: {
    color: '#D32F2F',
  },
  navLabel: {
    fontSize: 10,
    color: '#666',
  },
  navLabelActive: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
});
