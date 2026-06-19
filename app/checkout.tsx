import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// ── SAVED ADDRESSES INITIAL DATA ─────────────────────────────────────────────
const INITIAL_ADDRESSES = [
  {
    id: '1',
    name: 'Ahmed Khan',
    phone: '0311-1234567',
    city: 'Karachi',
    area: 'Gulshan-e-Iqbal',
    address: 'House #12, Block 5, Gulshan-e-Iqbal, Karachi',
  },
  {
    id: '2',
    name: 'Ahmed Khan',
    phone: '0311-1234567',
    city: 'Lahore',
    area: 'DHA Phase 6',
    address: 'Plot #45, Street 8, DHA Phase 6, Lahore',
  },
];

// ── DUMMY PRODUCT DB FOR PARAM RESOLUTION ──────────────────────────────────────
const MOCK_PRODUCTS_DB: Record<string, any> = {
  '1': { name: 'Premium Mechanical Keyboard RGB Backlit Gaming', price: 2499, image: 'https://picsum.photos/seed/kbd1/400/400' },
  '2': { name: 'Minimalist Leather Wallet RFID Blocking Slim', price: 849, image: 'https://picsum.photos/seed/wal1/400/400' },
  '3': { name: 'Stainless Steel Water Bottle Insulated 1L', price: 1199, image: 'https://picsum.photos/seed/bot1/400/400' },
  '4': { name: 'USB-C Hub 7-in-1 Multi-port Adapter for Laptop', price: 1649, image: 'https://picsum.photos/seed/hub1/400/400' },
  '5': { name: 'Yoga Mat Non-Slip Thick Exercise Fitness', price: 1399, image: 'https://picsum.photos/seed/mat1/400/400' },
  '6': { name: 'Wireless Charging Pad 15W Fast Charge', price: 799, image: 'https://picsum.photos/seed/chg1/400/400' },
  '7': { name: 'Portable Bluetooth Speaker Waterproof IPX7', price: 1999, image: 'https://picsum.photos/seed/spk1/400/400' },
  '8': { name: 'Resistance Bands Set Workout Exercise Home Gym', price: 599, image: 'https://picsum.photos/seed/bnd1/400/400' },
  'deal_1': { name: 'Wireless Earbuds Pro', price: 999, image: 'https://picsum.photos/seed/deal1/400/400' },
  'deal_2': { name: 'Smart Watch Ultra', price: 1999, image: 'https://picsum.photos/seed/deal2/400/400' },
  'deal_3': { name: 'LED Desk Lamp', price: 799, image: 'https://picsum.photos/seed/deal3/400/400' },
  'deal_4': { name: 'Portable Charger 20000mAh', price: 1299, image: 'https://picsum.photos/seed/deal4/400/400' },
  'default': { name: 'Premium Wireless Headphones Pro Max', price: 9600, image: 'https://picsum.photos/seed/hp1a/400/400' },
};

// ── DEFAULT FALLBACK ITEMS ───────────────────────────────────────────────────
const DEFAULT_ORDER_ITEMS = [
  {
    id: 'default_1',
    name: 'Premium Wireless Headphones Pro Max',
    image: 'https://picsum.photos/seed/hp1a/400/400',
    price: 9600,
    quantity: 1,
    size: 'M',
    color: '#FF4010',
  },
  {
    id: 'default_2',
    name: 'Smart Watch Pro',
    image: 'https://picsum.photos/seed/p2/80/80',
    price: 8999,
    quantity: 2,
    size: 'L',
    color: '#333333',
  },
];

// ── PAYMENT METHODS ──────────────────────────────────────────────────────────
const PAYMENT_OPTIONS = [
  { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when you receive', icon: '💵' },
  { id: 'jazzcash', name: 'JazzCash', desc: 'Pay via JazzCash wallet', icon: '🔴' },
  { id: 'easypaisa', name: 'Easypaisa', desc: 'Pay via Easypaisa wallet', icon: '🟢' },
  { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, Mastercard accepted', icon: '💳' },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Load passed product details if navigated via Buy Now, otherwise show default items
  let orderItems = DEFAULT_ORDER_ITEMS;
  if (params.productId) {
    const matchedProduct = MOCK_PRODUCTS_DB[params.productId as string] || MOCK_PRODUCTS_DB['default'];
    orderItems = [
      {
        id: params.productId as string,
        name: matchedProduct.name,
        image: matchedProduct.image,
        price: matchedProduct.price,
        quantity: parseInt((params.quantity as string) || '1', 10),
        size: (params.size as string) || 'M',
        color: (params.color as string) || '#FF4010',
      },
    ];
  }

  // States
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newAddress, setNewAddress] = useState('');

  // Calculations
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = 0; // Free delivery
  const discount = 500; // Flat discount
  const total = Math.max(0, subtotal + deliveryCharge - discount);

  const handleSaveAddress = () => {
    if (!newName.trim() || !newPhone.trim() || !newCity.trim() || !newArea.trim() || !newAddress.trim()) {
      Alert.alert('Missing Info', 'Please fill all address fields.');
      return;
    }

    const newAddrObj = {
      id: Date.now().toString(),
      name: newName.trim(),
      phone: newPhone.trim(),
      city: newCity.trim(),
      area: newArea.trim(),
      address: newAddress.trim(),
    };

    setAddresses([...addresses, newAddrObj]);
    setSelectedAddress(newAddrObj.id);
    setShowAddressForm(false);

    // Clear fields
    setNewName('');
    setNewPhone('');
    setNewCity('');
    setNewArea('');
    setNewAddress('');
  };

  const handlePlaceOrder = () => {
    const activeAddressObj = addresses.find((a) => a.id === selectedAddress);
    if (!activeAddressObj) {
      Alert.alert('Address Required', 'Please select a delivery address.');
      return;
    }

    const generatedOrderId = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);

    router.push({
      pathname: '/order-confirmation',
      params: {
        orderId: generatedOrderId,
        total: total.toString(),
        paymentMethod: selectedPayment,
        addressName: activeAddressObj.name,
        addressPhone: activeAddressObj.phone,
        addressCity: activeAddressObj.city,
        addressArea: activeAddressObj.area,
        addressDetails: activeAddressObj.address,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4010" />

      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Checkout</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>

        {/* SECTION 1 ── DELIVERY ADDRESS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={() => setShowAddressForm(!showAddressForm)}>
              <Text style={styles.addBtnText}>{showAddressForm ? 'Cancel' : '+ Add New'}</Text>
            </TouchableOpacity>
          </View>

          {/* Saved Addresses List */}
          {!showAddressForm && addresses.map((addr) => {
            const isSelected = selectedAddress === addr.id;
            return (
              <TouchableOpacity
                key={addr.id}
                style={[
                  styles.addressRow,
                  {
                    borderColor: isSelected ? '#FF4010' : '#E5E5E5',
                    backgroundColor: isSelected ? '#FFF5F2' : '#FFFFFF',
                  },
                ]}
                onPress={() => setSelectedAddress(addr.id)}
                activeOpacity={0.9}
              >
                {/* Radio button */}
                <View style={[styles.radioCircle, { borderColor: isSelected ? '#FF4010' : '#CCCCCC' }]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>

                {/* Details */}
                <View style={styles.addressInfo}>
                  <Text style={styles.addressName}>{addr.name}</Text>
                  <Text style={styles.addressPhone}>{addr.phone}</Text>
                  <Text style={styles.addressText}>{addr.address}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Add New Address Form */}
          {showAddressForm && (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={newName}
                onChangeText={setNewName}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={newCity}
                onChangeText={setNewCity}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Area / Block"
                value={newArea}
                onChangeText={setNewArea}
                placeholderTextColor="#999"
              />
              <TextInput
                style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
                placeholder="Full Address Details"
                value={newAddress}
                onChangeText={setNewAddress}
                multiline
                numberOfLines={3}
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.saveAddrBtn} onPress={handleSaveAddress} activeOpacity={0.85}>
                <Text style={styles.saveAddrText}>Save Address</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* SECTION 2 ── ORDER SUMMARY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <View style={{ marginTop: 12 }}>
            {orderItems.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Image source={{ uri: item.image }} style={styles.itemImg} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.specsRow}>
                    <Text style={styles.specsText}>Size: {item.size}</Text>
                    <View style={styles.specsSeparator} />
                    <Text style={styles.specsText}>Color: </Text>
                    <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                  </View>
                  <View style={styles.qtyPriceRow}>
                    <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                    <Text style={styles.itemPrice}>₨{(item.price * item.quantity).toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Pricing Breakdown */}
          <View style={styles.priceBreakdown}>
            <View style={styles.breakdownLine}>
              <Text style={styles.breakdownLabel}>Subtotal</Text>
              <Text style={styles.breakdownVal}>₨{subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.breakdownLine}>
              <Text style={styles.breakdownLabel}>Delivery</Text>
              <Text style={[styles.breakdownVal, { color: '#00A650', fontWeight: '700' }]}>Free</Text>
            </View>
            <View style={styles.breakdownLine}>
              <Text style={styles.breakdownLabel}>Discount</Text>
              <Text style={[styles.breakdownVal, { color: '#00A650', fontWeight: '700' }]}>-₨{discount.toLocaleString()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalVal}>₨{total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* SECTION 3 ── PAYMENT METHOD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <View style={{ marginTop: 12 }}>
            {PAYMENT_OPTIONS.map((opt) => {
              const isSelected = selectedPayment === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.paymentRow,
                    {
                      borderColor: isSelected ? '#FF4010' : '#E5E5E5',
                      backgroundColor: isSelected ? '#FFF5F2' : '#FFFFFF',
                    },
                  ]}
                  onPress={() => setSelectedPayment(opt.id)}
                  activeOpacity={0.9}
                >
                  <View style={[styles.radioCircle, { borderColor: isSelected ? '#FF4010' : '#CCCCCC' }]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentName}>{opt.name}</Text>
                    <Text style={styles.paymentDesc}>{opt.desc}</Text>
                  </View>
                  <Text style={styles.paymentIcon}>{opt.icon}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bottom spacing for fixed button */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── FIXED BOTTOM PLACE ORDER BAR ── */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInfo}>
          <Text style={styles.bottomBarLabel}>Total Amount</Text>
          <Text style={styles.bottomBarPrice}>₨{total.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder} activeOpacity={0.85}>
          <Text style={styles.placeOrderText}>Place Order →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topBar: {
    backgroundColor: '#FF4010',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 44,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backBtn: {
    padding: 4,
  },
  backBtnText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 4,
    padding: 16,
    elevation: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },
  addBtnText: {
    color: '#FF4010',
    fontSize: 13,
    fontWeight: '700',
  },
  // Address row
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1.5,
    marginTop: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF4010',
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontWeight: '700',
    fontSize: 14,
    color: '#333333',
  },
  addressPhone: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  addressText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
    lineHeight: 17,
  },
  // New address form
  formContainer: {
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: '#FAFAFA',
    color: '#333333',
  },
  saveAddrBtn: {
    backgroundColor: '#FF4010',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  saveAddrText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  // Item summary
  itemRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImg: {
    width: 70,
    height: 70,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    lineHeight: 18,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  specsText: {
    fontSize: 12,
    color: '#888888',
  },
  specsSeparator: {
    width: 1,
    height: 10,
    backgroundColor: '#DDD',
    marginHorizontal: 8,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#CCC',
  },
  qtyPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemQty: {
    fontSize: 12,
    color: '#888888',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF4010',
  },
  // Pricing
  priceBreakdown: {
    marginTop: 8,
  },
  breakdownLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#666666',
  },
  breakdownVal: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 8,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF4010',
  },
  // Payments
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333333',
  },
  paymentDesc: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  paymentIcon: {
    fontSize: 20,
  },
  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    elevation: 10,
  },
  bottomBarInfo: {
    flex: 1,
  },
  bottomBarLabel: {
    fontSize: 12,
    color: '#888888',
  },
  bottomBarPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF4010',
    marginTop: 2,
  },
  placeOrderBtn: {
    flex: 1.2,
    backgroundColor: '#FF4010',
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
