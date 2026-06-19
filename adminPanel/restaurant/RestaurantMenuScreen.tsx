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
import { RestaurantAdminTheme as theme } from '../constants/theme';
import { getMerchantSession } from '../auth/session';
import { AdminRoutes } from '../constants/routes';

type MenuItem = { id: string; name: string; category: string; price: number; available: boolean };

const INITIAL_MENU: MenuItem[] = [
  { id: '1', name: 'Chicken Biryani', category: 'Biryani', price: 450, available: true },
  { id: '2', name: 'Mutton Karahi', category: 'Karahi', price: 2200, available: true },
  { id: '3', name: 'Chicken Tikka', category: 'BBQ', price: 850, available: true },
  { id: '4', name: 'Naan', category: 'Bread', price: 80, available: false },
  { id: '5', name: 'Mango Lassi', category: 'Drinks', price: 250, available: true },
];

export default function RestaurantMenuScreen() {
  const router = useRouter();
  const merchant = getMerchantSession();
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (!merchant || merchant.type !== 'restaurant') {
      router.replace(AdminRoutes.login);
    }
  }, [merchant, router]);

  if (!merchant) return null;

  const toggleAvailable = (id: string) => {
    setMenu((prev) => prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m)));
  };

  const addMenuItem = () => {
    if (!newName.trim() || !newPrice.trim() || !newCategory.trim()) {
      Alert.alert('Error', 'Name, category aur price enter karein');
      return;
    }
    const price = Number(newPrice);
    if (Number.isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Valid price enter karein');
      return;
    }
    setMenu((prev) => [
      {
        id: String(Date.now()),
        name: newName.trim(),
        category: newCategory.trim(),
        price,
        available: true,
      },
      ...prev,
    ]);
    setNewName('');
    setNewPrice('');
    setNewCategory('');
    Alert.alert('Success', 'Menu item add ho gaya');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
      <AdminHeader title="Restaurant Menu" subtitle={merchant.businessName} headerBg={theme.headerBg} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.addCard}>
          <Text style={styles.addTitle}>Add Menu Item</Text>
          <TextInput
            style={styles.input}
            placeholder="Item name (e.g. Chicken Biryani)"
            placeholderTextColor="#999"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={styles.input}
            placeholder="Category (e.g. Biryani)"
            placeholderTextColor="#999"
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <TextInput
            style={styles.input}
            placeholder="Price (PKR)"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={newPrice}
            onChangeText={setNewPrice}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addMenuItem}>
            <Text style={styles.addBtnText}>+ Add to Menu</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Menu ({menu.length} items)</Text>
        {menu.map((item) => (
          <View key={item.id} style={styles.menuCard}>
            <View style={styles.menuInfo}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuMeta}>
                {item.category} • ₨{item.price.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.toggleBtn, item.available ? styles.toggleOn : styles.toggleOff]}
              onPress={() => toggleAvailable(item.id)}
            >
              <Text style={styles.toggleText}>{item.available ? 'Available' : 'Sold Out'}</Text>
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
    borderColor: '#FECACA',
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
  menuCard: {
    backgroundColor: theme.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuInfo: { flex: 1, paddingRight: 10 },
  menuName: { fontSize: 14, fontWeight: '800', color: theme.text },
  menuMeta: { fontSize: 12, color: theme.muted, marginTop: 3 },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  toggleOn: { backgroundColor: '#DCFCE7' },
  toggleOff: { backgroundColor: '#FEE2E2' },
  toggleText: { fontSize: 10, fontWeight: '800', color: theme.text },
});
