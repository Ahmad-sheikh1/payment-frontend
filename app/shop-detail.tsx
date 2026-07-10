import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../apiConfig';

// Dummy Menu
const MENU_ITEMS = [
  { id: '1', name: 'Chicken Fajita Pizza', desc: 'Chicken, capsicum, onion, mozzarella', price: 950, image: 'https://picsum.photos/seed/pizza1/100/100', category: 'Pizza' },
  { id: '2', name: 'Cheese Lover Pizza', desc: 'Mozzarella & cheddar cheese', price: 850, image: 'https://picsum.photos/seed/pizza2/100/100', category: 'Pizza' },
  { id: '3', name: 'BBQ Chicken Pizza', desc: 'BBQ sauce, chicken, onion', price: 950, image: 'https://picsum.photos/seed/pizza3/100/100', category: 'Pizza' },
  { id: '4', name: 'Zinger Burger', desc: 'Crispy chicken fillet with mayo', price: 450, image: 'https://picsum.photos/seed/burger1/100/100', category: 'Burger' },
];

export default function ShopDetailScreen() {
  const router = useRouter();
  const { name, merchantId } = useLocalSearchParams<{ name: string; merchantId?: string }>();
  
  const shopName = name || 'Heaven Slice';
  
  const [activeTab, setActiveTab] = useState('Menu'); // Menu, Reviews, Info
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchMerchantProducts = async () => {
      setIsLoading(true);
      try {
        let apiProducts: any[] = [];
        try {
          const res = await axios.get(`${API_URL}/api/products`);
          apiProducts = res.data;
        } catch (apiErr) {
          console.log("Failed to fetch products from backend:", apiErr);
        }

        // Fetch local offline products added by merchants
        let localProducts: any[] = [];
        try {
          const stored = await AsyncStorage.getItem('@merchant_products');
          if (stored) {
            localProducts = JSON.parse(stored);
          }
        } catch (storageErr) {
          console.error("Failed to load local offline products:", storageErr);
        }

        // Combine products
        const combined = [...localProducts, ...apiProducts];

        // Filter products for this merchant
        const filtered = combined.filter((p: any) => {
          const mId = merchantId || '';
          return p.merchantId === mId || p.merchantId === mId.replace('bus_', '') || p.merchantId === name || (p.category && p.category.toLowerCase() === name.toLowerCase());
        });

        if (filtered.length === 0) {
          // Fallback to default MENU_ITEMS if no products added yet
          setMenuItems(MENU_ITEMS);
        } else {
          // Map to MENU_ITEMS structure
          const mapped = filtered.map((p: any) => ({
            id: p.id || p._id || String(Date.now() + Math.random()),
            name: p.name,
            desc: p.description || 'Premium fresh product.',
            price: p.discountedPrice || p.price || 0,
            image: (p.images && p.images.length > 0) ? p.images[0] : (p.image || 'https://picsum.photos/seed/pizza1/100/100'),
            category: p.category || 'General'
          }));
          setMenuItems(mapped);
        }
      } catch (err) {
        console.error("Failed to load menu items:", err);
        setMenuItems(MENU_ITEMS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchantProducts();
  }, [merchantId, name]);

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredMenu = activeFilter === 'All' ? menuItems : menuItems.filter(i => i.category === activeFilter);

  const saveCartToStorage = async (updatedCart: Record<string, number>, currentMenu: any[]) => {
    try {
      const cartList = Object.keys(updatedCart)
        .map(id => {
          const item = currentMenu.find(m => m.id === id);
          if (item && updatedCart[id] > 0) {
            return {
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              qty: updatedCart[id]
            };
          }
          return null;
        })
        .filter(Boolean);

      await AsyncStorage.setItem('@cart_data', JSON.stringify({
        shopName: shopName,
        merchantId: merchantId || '',
        items: cartList
      }));
    } catch (err) {
      console.error("Error saving cart to storage:", err);
    }
  };

  const addToCart = (id: string) => {
    const next = { ...cartItems, [id]: 1 };
    setCartItems(next);
    saveCartToStorage(next, menuItems);
  };

  const increment = (id: string) => {
    const next = { ...cartItems, [id]: (cartItems[id] || 0) + 1 };
    setCartItems(next);
    saveCartToStorage(next, menuItems);
  };

  const decrement = (id: string) => {
    const next = { ...cartItems };
    if (next[id] > 1) {
      next[id] -= 1;
    } else {
      delete next[id];
    }
    setCartItems(next);
    saveCartToStorage(next, menuItems);
  };

  const deleteItem = (id: string) => {
    const next = { ...cartItems };
    delete next[id];
    setCartItems(next);
    saveCartToStorage(next, menuItems);
  };

  let cartCount = 0;
  let cartTotal = 0;
  Object.keys(cartItems).forEach(id => {
    const item = menuItems.find(m => m.id === id);
    if (item) {
      cartCount += cartItems[id];
      cartTotal += cartItems[id] * item.price;
    }
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{shopName}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: 'https://picsum.photos/seed/shophero/400/200' }} style={styles.heroImage} />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.shopTitle}>{shopName}</Text>
          <Text style={styles.shopMeta}>★ 4.5 (95+) • 35-45 min • Free Delivery</Text>
          <Text style={styles.shopMinOrder}>Minimum Order: PKR 300</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {['Menu', 'Reviews', 'Info'].map(tab => (
            <TouchableOpacity key={tab} style={styles.tabItem} onPress={() => setActiveTab(tab)} activeOpacity={0.8}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Menu' && (
          <View>
            {isLoading ? (
              <View style={{ paddingVertical: 60, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#D32F2F" />
                <Text style={{ marginTop: 10, color: '#666', fontWeight: '600' }}>Menu loading...</Text>
              </View>
            ) : (
              <View>
                {/* Filters */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
                  {categories.map(filter => (
                    <TouchableOpacity
                      key={filter}
                      style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
                      onPress={() => setActiveFilter(filter)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Menu List */}
                <View style={styles.menuList}>
                  {filteredMenu.map(item => {
                    const qty = cartItems[item.id];
                    const inCart = qty > 0;

                    return (
                      <View key={item.id} style={styles.menuItem}>
                        <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                        <View style={styles.menuItemInfo}>
                          <Text style={styles.menuItemName}>{item.name}</Text>
                          <Text style={styles.menuItemDesc} numberOfLines={2}>{item.desc}</Text>
                          <Text style={styles.menuItemPrice}>PKR {item.price}</Text>

                          {inCart ? (
                            <View style={styles.controlsRow}>
                              <View style={styles.qtyContainer}>
                                <TouchableOpacity style={styles.qtyBtn} onPress={() => decrement(item.id)}>
                                  <Text style={styles.qtyBtnText}>−</Text>
                                </TouchableOpacity>
                                <Text style={styles.qtyText}>{qty}</Text>
                                <TouchableOpacity style={styles.qtyBtn} onPress={() => increment(item.id)}>
                                  <Text style={styles.qtyBtnText}>+</Text>
                                </TouchableOpacity>
                              </View>
                              <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteItem(item.id)}>
                                <Text style={styles.deleteIcon}>🗑️</Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item.id)} activeOpacity={0.8}>
                              <Text style={styles.addBtnText}>ADD</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}

        <View style={{height: 100}} />
      </ScrollView>

      {/* Floating Cart Bar */}
      {cartCount > 0 && (
        <TouchableOpacity style={styles.bottomCartBar} activeOpacity={0.9} onPress={() => router.push({ pathname: '/shop-cart', params: { shopName: shopName } })}>
          <View style={styles.cartContent}>
            <Text style={styles.cartText}>🛒 View Cart ({cartCount})</Text>
            <Text style={styles.cartTotal}>PKR {cartTotal.toLocaleString()}</Text>
          </View>
        </TouchableOpacity>
      )}
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
  heroContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#000',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  infoCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: -40,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  shopTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#333',
    marginBottom: 6,
  },
  shopMeta: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  shopMinOrder: {
    fontSize: 13,
    color: '#333',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    marginTop: 16,
  },
  tabItem: {
    paddingVertical: 12,
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#D32F2F',
    fontWeight: '800',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    height: 3,
    backgroundColor: '#D32F2F',
    width: 60,
    borderRadius: 2,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEE',
    backgroundColor: '#FFF',
  },
  filterChipActive: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },
  filterText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFF',
  },
  menuList: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  menuItemImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  menuItemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-start',
  },
  menuItemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#D32F2F',
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  addBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 10,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F9F9F9',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    color: '#333',
  },
  deleteBtn: {
    padding: 6,
  },
  deleteIcon: {
    fontSize: 18,
  },
  bottomCartBar: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartTotal: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
