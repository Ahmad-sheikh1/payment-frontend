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
import { ShopAdminTheme as theme } from '../constants/theme';
import { getMerchantSession } from '../auth/session';
import { AdminRoutes } from '../constants/routes';
import * as ImagePicker from 'expo-image-picker';

type Product = { id: string; name: string; price: number; stock: number; active: boolean; image?: string };

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Mechanical Keyboard RGB', price: 2499, stock: 15, active: true, image: 'https://picsum.photos/200/200?sig=1' },
  { id: '2', name: 'Leather Wallet Slim', price: 849, stock: 28, active: true, image: 'https://picsum.photos/200/200?sig=2' },
  { id: '3', name: 'USB-C Hub 7-in-1', price: 1649, stock: 0, active: false, image: 'https://picsum.photos/200/200?sig=3' },
  { id: '4', name: 'Bluetooth Speaker', price: 1999, stock: 9, active: true, image: 'https://picsum.photos/200/200?sig=4' },
];

export default function ShopProductsScreen() {
  const router = useRouter();
  const merchant = getMerchantSession();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
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
      { 
        id: String(Date.now()), 
        name: newName.trim(), 
        price, 
        stock: 10, 
        active: true,
        image: newImage || undefined
      },
      ...prev,
    ]);
    setNewName('');
    setNewPrice('');
    setNewImage(null);
    Alert.alert('Success', 'Product add ho gaya');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />
      <AdminHeader title="Shop Products" subtitle={merchant.businessName} headerBg={theme.headerBg} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.addCard}>
          <Text style={styles.addTitle}>Add New Product</Text>
          
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
                <Text style={styles.imagePickerText}>Pick Product Image</Text>
              </TouchableOpacity>
            )}
          </View>

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
            {product.image ? (
              <Image source={{ uri: product.image }} style={styles.productImage} />
            ) : (
              <View style={[styles.productImage, styles.productImagePlaceholder]}>
                <Text style={{ fontSize: 18 }}>🛍️</Text>
              </View>
            )}
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
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F1F5F9',
  },
  productImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  productInfo: { flex: 1, paddingRight: 10 },
  productName: { fontSize: 14, fontWeight: '800', color: theme.text },
  productMeta: { fontSize: 12, color: theme.muted, marginTop: 3 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  toggleOn: { backgroundColor: '#DCFCE7' },
  toggleOff: { backgroundColor: '#FEE2E2' },
  toggleText: { fontSize: 11, fontWeight: '800', color: theme.text },
});
