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
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AdminHeader } from '../components/AdminHeader';
import { RestaurantAdminTheme as theme } from '../constants/theme';
import { getMerchantSession } from '../auth/session';
import { AdminRoutes } from '../constants/routes';
import { API_URL } from '../../apiConfig';
import * as ImagePicker from 'expo-image-picker';

type MenuItem = { id: string; name: string; category: string; price: number; available: boolean; image?: string };

const RESTAURANT_MENU_KEY = '@restaurant_menu';

export default function RestaurantMenuScreen() {
  const router = useRouter();
  const merchant = getMerchantSession();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need storage permission to pick images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setNewImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  // Load menu from API + AsyncStorage
  useEffect(() => {
    if (!merchant || merchant.type !== 'restaurant') {
      router.replace(AdminRoutes.login);
      return;
    }
    const loadMenu = async () => {
      setIsLoading(true);
      try {
        // Load from API
        let apiItems: MenuItem[] = [];
        try {
          const res = await axios.get(`${API_URL}/api/products`);
          apiItems = res.data
            .filter((p: any) => p.merchantId === merchant.id || p.merchantId === String(merchant.id))
            .map((p: any): MenuItem => ({
              id: p.id || p._id,
              name: p.name,
              category: p.category || 'General',
              price: p.discountedPrice || p.price || 0,
              available: p.inStock !== false,
              image: p.images?.[0] || p.image,
            }));
        } catch {
          console.log('API offline, loading local menu');
        }

        // Load locally stored menu items
        let localItems: MenuItem[] = [];
        try {
          const raw = await AsyncStorage.getItem(RESTAURANT_MENU_KEY + '_' + merchant.id);
          if (raw) localItems = JSON.parse(raw);
        } catch {}

        // Merge (local first, deduplicate by id)
        const merged = [...localItems];
        for (const item of apiItems) {
          if (!merged.find((x) => x.id === item.id)) merged.push(item);
        }
        setMenu(merged);
      } finally {
        setIsLoading(false);
      }
    };
    loadMenu();
  }, [merchant?.id]);

  if (!merchant) return null;

  const toggleAvailable = (id: string) => {
    setMenu((prev) => prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m)));
  };

  const addMenuItem = async () => {
    if (!newName.trim() || !newPrice.trim() || !newCategory.trim()) {
      Alert.alert('Error', 'Name, category aur price enter karein');
      return;
    }
    const price = Number(newPrice);
    if (Number.isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Valid price enter karein');
      return;
    }

    const newItem: MenuItem = {
      id: String(Date.now()),
      name: newName.trim(),
      category: newCategory.trim(),
      price,
      available: true,
      image: newImage || undefined,
    };

    // Show immediately in UI
    setMenu((prev) => [newItem, ...prev]);
    setNewName('');
    setNewPrice('');
    setNewCategory('');
    setNewImage(null);

    // Try to save to backend API
    try {
      await axios.post(`${API_URL}/api/products`, {
        name: newItem.name,
        price: newItem.price,
        image: newItem.image,
        merchantId: merchant.id,
        category: newItem.category,
        description: `${newItem.category} item from ${merchant.businessName}`,
      });
      Alert.alert('Success', 'Menu item add ho gaya aur backend pe save ho gaya!');
    } catch {
      // Fallback: save to local AsyncStorage
      try {
        const key = RESTAURANT_MENU_KEY + '_' + merchant.id;
        const raw = await AsyncStorage.getItem(key);
        const existing: MenuItem[] = raw ? JSON.parse(raw) : [];
        existing.unshift(newItem);
        await AsyncStorage.setItem(key, JSON.stringify(existing));
        Alert.alert('Success', 'Menu item add ho gaya (Offline mode - locally saved)');
      } catch {
        Alert.alert('Success', 'Menu item add ho gaya (screen pe)');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
      <AdminHeader title="Restaurant Menu" subtitle={merchant.businessName} headerBg={theme.headerBg} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.addCard}>
          <Text style={styles.addTitle}>Add Menu Item</Text>
          
          <View style={styles.imagePickerContainer}>
            {newImage ? (
              <View style={styles.imagePreviewWrapper}>
                <Image source={{ uri: newImage }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageBtn} onPress={() => setNewImage(null)}>
                  <Text style={styles.removeImageText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
                <Text style={styles.imagePickerIcon}>📷</Text>
                <Text style={styles.imagePickerText}>Pick Menu Item Image</Text>
              </TouchableOpacity>
            )}
          </View>

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
        {isLoading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={{ color: theme.muted, marginTop: 8, fontSize: 13 }}>Menu load ho raha hai...</Text>
          </View>
        ) : menu.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 32 }}>🍔</Text>
            <Text style={{ color: theme.muted, marginTop: 8, fontSize: 13 }}>Menu khali hai. Upar se item add karein!</Text>
          </View>
        ) : (
          menu.map((item) => (
            <View key={item.id} style={styles.menuCard}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.menuImage} />
              ) : (
                <View style={[styles.menuImage, styles.menuImagePlaceholder]}>
                  <Text style={{ fontSize: 18 }}>🍔</Text>
                </View>
              )}
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
          ))
        )}
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
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePickerBtn: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  imagePickerIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  imagePickerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  imagePreviewWrapper: {
    position: 'relative',
    width: 90,
    height: 90,
  },
  imagePreview: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  removeImageText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F1F5F9',
  },
  menuImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuInfo: { flex: 1, paddingRight: 10 },
  menuName: { fontSize: 14, fontWeight: '800', color: theme.text },
  menuMeta: { fontSize: 12, color: theme.muted, marginTop: 3 },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  toggleOn: { backgroundColor: '#DCFCE7' },
  toggleOff: { backgroundColor: '#FEE2E2' },
  toggleText: { fontSize: 10, fontWeight: '800', color: theme.text },
});
