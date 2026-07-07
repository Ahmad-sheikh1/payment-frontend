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
} from 'react-native';
import { useRouter } from 'expo-router';
import { AdminHeader } from '../components/AdminHeader';
import { RestaurantAdminTheme as theme } from '../constants/theme';
import { getMerchantSession } from '../auth/session';
import { AdminRoutes } from '../constants/routes';
import * as ImagePicker from 'expo-image-picker';

type MenuItem = { id: string; name: string; category: string; price: number; available: boolean; image?: string };

const INITIAL_MENU: MenuItem[] = [
  { id: '1', name: 'Chicken Biryani', category: 'Biryani', price: 450, available: true, image: 'https://picsum.photos/200/200?sig=11' },
  { id: '2', name: 'Mutton Karahi', category: 'Karahi', price: 2200, available: true, image: 'https://picsum.photos/200/200?sig=12' },
  { id: '3', name: 'Chicken Tikka', category: 'BBQ', price: 850, available: true, image: 'https://picsum.photos/200/200?sig=13' },
  { id: '4', name: 'Naan', category: 'Bread', price: 80, available: false, image: 'https://picsum.photos/200/200?sig=14' },
  { id: '5', name: 'Mango Lassi', category: 'Drinks', price: 250, available: true, image: 'https://picsum.photos/200/200?sig=15' },
];

export default function RestaurantMenuScreen() {
  const router = useRouter();
  const merchant = getMerchantSession();
  const [menu, setMenu] = useState(INITIAL_MENU);
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
        image: newImage || undefined,
      },
      ...prev,
    ]);
    setNewName('');
    setNewPrice('');
    setNewCategory('');
    setNewImage(null);
    Alert.alert('Success', 'Menu item add ho gaya');
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
        {menu.map((item) => (
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
