import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AdminHeader } from '../components/AdminHeader';
import { ShopAdminTheme as theme } from '../constants/theme';
import { getMerchantSession } from '../auth/session';
import { AdminRoutes } from '../constants/routes';

type Product = { id: string; name: string; price: number; stock: number; active: boolean };

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Mechanical Keyboard RGB', price: 2499, stock: 15, active: true },
  { id: '2', name: 'Leather Wallet Slim', price: 849, stock: 28, active: true },
  { id: '3', name: 'USB-C Hub 7-in-1', price: 1649, stock: 0, active: false },
  { id: '4', name: 'Bluetooth Speaker', price: 1999, stock: 9, active: true },
];

export default function ShopProductsScreen() {
  const router = useRouter();
  const merchant = getMerchantSession();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    if (!merchant || merchant.type !== 'shop') {
      router.replace(AdminRoutes.login);
    }
  }, [merchant, router]);

  if (!merchant) return null;

  const toggleActive = (id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  const addProduct = () => {
    if (!newName.trim() || !newPrice.trim()) {
      Alert.alert('Error', 'Product name aur price enter karein');
      return;
    }
    const price = Number(newPrice);
    if (Number.isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Valid price enter karein');
      return;
    }
    setProducts((prev) => [
      { id: String(Date.now()), name: newName.trim(), price, stock: 10, active: true },
      ...prev,
    ]);
    setNewName('');
    setNewPrice('');
    Alert.alert('Success', 'Product add ho gaya');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
      <AdminHeader title="Shop Products" subtitle={merchant.businessName} headerBg={theme.headerBg} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.addCard}>
          <Text style={styles.addTitle}>Add New Product</Text>
          <TextInput
            style={styles.input}
            placeholder="Product name"
            placeholderTextColor="#999"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={styles.input}
            placeholder="Price (PKR)"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={newPrice}
            onChangeText={setNewPrice}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addProduct}>
            <Text style={styles.addBtnText}>+ Add Product</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Your Products ({products.length})</Text>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productMeta}>
                ₨{product.price.toLocaleString()} • Stock: {product.stock}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.toggleBtn, product.active ? styles.toggleOn : styles.toggleOff]}
              onPress={() => toggleActive(product.id)}
            >
              <Text style={styles.toggleText}>{product.active ? 'Active' : 'Hidden'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 16, paddingBottom: 100 },
  addCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  addTitle: { fontSize: 15, fontWeight: '800', color: theme.text, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
    color: theme.text,
  },
  addBtn: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: { color: '#FFF', fontWeight: '800' },
  sectionTitle: { fontSize: 15, fontWeight: '900', color: theme.text, marginBottom: 10 },
  productCard: {
    backgroundColor: theme.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productInfo: { flex: 1, paddingRight: 10 },
  productName: { fontSize: 14, fontWeight: '800', color: theme.text },
  productMeta: { fontSize: 12, color: theme.muted, marginTop: 3 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  toggleOn: { backgroundColor: '#DCFCE7' },
  toggleOff: { backgroundColor: '#FEE2E2' },
  toggleText: { fontSize: 11, fontWeight: '800', color: theme.text },
});
