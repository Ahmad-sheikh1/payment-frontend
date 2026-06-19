import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Animated,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { getMerchantSession } from '../adminPanel/auth/session';

const { width } = Dimensions.get('window');

// Navigate to Signup screen when user taps the banner button
const handleSignup = () => {
  router.push('/signup');
};
const COLUMN_WIDTH = (width - 36) / 2;

// ── DUMMY DATA ──────────────────────────────────────────────────────────────

const BANNERS = [
  { id: '1', bg: '#FF4010', label: 'Choice Day', sub: 'Up to 80% OFF', emoji: '🎉' },
  { id: '2', bg: '#1A1A2E', label: 'Tech Deals', sub: 'Latest Gadgets', emoji: '📱' },
  { id: '3', bg: '#0F3460', label: 'Free Shipping', sub: 'On orders over $10', emoji: '🚀' },
  { id: '4', bg: '#533483', label: 'Fashion Week', sub: 'Trendy styles now', emoji: '👗' },
];

const CATEGORIES = [
  { id: '1', icon: '⚡', label: 'SuperDeals' },
  { id: '2', icon: '🪙', label: 'Coins' },
  { id: '3', icon: '✅', label: 'Choice' },
  { id: '4', icon: '👗', label: 'Fashion' },
  { id: '5', icon: '💻', label: 'Tech' },
  { id: '6', icon: '🏠', label: 'Home' },
  { id: '7', icon: '🏆', label: 'Best Sellers' },
  { id: '8', icon: '🎁', label: 'Rewards' },
];

const SUPER_DEALS = [
  {
    id: 'deal_1',
    name: 'Wireless Earbuds Pro',
    image: 'https://picsum.photos/seed/deal1/200/200',
    originalPrice: 4500,
    salePrice: 999,
    sold: 68,
    total: 100,
  },
  {
    id: 'deal_2',
    name: 'Smart Watch Ultra',
    image: 'https://picsum.photos/seed/deal2/200/200',
    originalPrice: 8900,
    salePrice: 1999,
    sold: 84,
    total: 100,
  },
  {
    id: 'deal_3',
    name: 'LED Desk Lamp',
    image: 'https://picsum.photos/seed/deal3/200/200',
    originalPrice: 2900,
    salePrice: 799,
    sold: 52,
    total: 100,
  },
  {
    id: 'deal_4',
    name: 'Portable Charger',
    image: 'https://picsum.photos/seed/deal4/200/200',
    originalPrice: 3900,
    salePrice: 1299,
    sold: 91,
    total: 100,
  },
];

const FEED_TABS = ['Choice', 'Recommended', 'Coins', 'Top Sellers'];

const PRODUCTS = [
  {
    id: '1',
    name: 'Premium Mechanical Keyboard RGB Backlit Gaming',
    image: 'https://picsum.photos/seed/prod1/300/300',
    price: 2499,
    originalPrice: 7999,
    rating: 4.8,
    reviews: 3241,
    sold: '50k+',
    badge: 'Choice',
    shipping: 'Free shipping',
    discount: 69,
  },
  {
    id: '2',
    name: 'Minimalist Leather Wallet RFID Blocking Slim',
    image: 'https://picsum.photos/seed/prod2/300/300',
    price: 849,
    originalPrice: 2299,
    rating: 4.6,
    reviews: 1872,
    sold: '20k+',
    badge: null,
    shipping: 'Free shipping',
    discount: 63,
  },
  {
    id: '3',
    name: 'Stainless Steel Water Bottle Insulated 1L',
    image: 'https://picsum.photos/seed/prod3/300/300',
    price: 1199,
    originalPrice: 3500,
    rating: 4.7,
    reviews: 6541,
    sold: '100k+',
    badge: 'Choice',
    shipping: 'Free shipping',
    discount: 66,
  },
  {
    id: '4',
    name: 'USB-C Hub 7-in-1 Multi-port Adapter for Laptop',
    image: 'https://picsum.photos/seed/prod4/300/300',
    price: 1649,
    originalPrice: 4499,
    rating: 4.5,
    reviews: 2109,
    sold: '30k+',
    badge: null,
    shipping: 'Free shipping',
    discount: 63,
  },
  {
    id: '5',
    name: 'Yoga Mat Non-Slip Thick Exercise Fitness',
    image: 'https://picsum.photos/seed/prod5/300/300',
    price: 1399,
    originalPrice: 3999,
    rating: 4.9,
    reviews: 8820,
    sold: '200k+',
    badge: 'Choice',
    shipping: 'Free shipping',
    discount: 65,
  },
  {
    id: '6',
    name: 'Wireless Charging Pad 15W Fast Charge',
    image: 'https://picsum.photos/seed/prod6/300/300',
    price: 799,
    originalPrice: 1999,
    rating: 4.4,
    reviews: 953,
    sold: '10k+',
    badge: null,
    shipping: '+₨150 shipping',
    discount: 60,
  },
  {
    id: '7',
    name: 'Portable Bluetooth Speaker Waterproof IPX7',
    image: 'https://picsum.photos/seed/prod7/300/300',
    price: 1999,
    originalPrice: 5999,
    rating: 4.7,
    reviews: 4412,
    sold: '80k+',
    badge: 'Choice',
    shipping: 'Free shipping',
    discount: 67,
  },
  {
    id: '8',
    name: 'Resistance Bands Set Workout Exercise Home Gym',
    image: 'https://picsum.photos/seed/prod8/300/300',
    price: 599,
    originalPrice: 1499,
    rating: 4.6,
    reviews: 7123,
    sold: '150k+',
    badge: null,
    shipping: 'Free shipping',
    discount: 60,
  },
];

// ── COUNTDOWN TIMER HOOK ─────────────────────────────────────────────────────

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return { h, m, s };
}

// ── STAR RATING ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={[styles.star, { color: i <= Math.round(rating) ? '#FFD000' : '#E5E5E5' }]}>★</Text>
      ))}
    </View>
  );
}

// ── BANNER CAROUSEL ──────────────────────────────────────────────────────────

function BannerCarousel({ onSignup }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % BANNERS.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.bannerContainer}>
      <FlatList
        ref={flatListRef}
        data={BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
          listener: (e: any) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveIndex(index);
          },
        })}
        renderItem={({ item }) => (
          <View style={[styles.banner, { backgroundColor: item.bg }]}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerEmoji}>{item.emoji}</Text>
              <Text style={styles.bannerLabel}>{item.label}</Text>
              <Text style={styles.bannerSub}>{item.sub}</Text>
              <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85} onPress={onSignup}>
                <Text style={styles.submitBtnText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {/* Dot Indicators */}
      <View style={styles.dotsRow}>
        {BANNERS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { backgroundColor: i === activeIndex ? '#FF4010' : '#CCCCCC', width: i === activeIndex ? 16 : 6 }]}
          />
        ))}
      </View>
    </View>
  );
}

// ── MAIN SCREEN ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const merchant = getMerchantSession();

  useEffect(() => {
    if (merchant) {
      if (merchant.type === 'shop') {
        router.replace('/adminPanel/shop');
      } else {
        router.replace('/adminPanel/restaurant');
      }
    }
  }, [merchant]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { h, m, s } = useCountdown(6392);

  const handleSignup = () => {
    router.push('/signup');
  };

  // ── ANIMATED SIDEBAR DRAWER STATES ──
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-280)).current;

  const openDrawer = () => {
    setIsDrawerOpen(true);
    Animated.spring(drawerAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -280,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsDrawerOpen(false));
  };

  const renderProduct = ({ item }: { item: typeof PRODUCTS[0] }) => (
    <TouchableOpacity key={item.id} style={styles.productCard} activeOpacity={0.85}
      onPress={() => router.push({ pathname: '/product-detail', params: { productId: item.id } })}
    >
      <View style={styles.productImgWrap}>
        <Image source={{ uri: item.image }} style={styles.productImg} />
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{item.discount}%</Text>
        </View>
        {item.badge === 'Choice' && (
          <View style={styles.choiceBadge}>
            <Text style={styles.choiceBadgeText}>✅ Choice</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.salePrice}>₨{item.price.toLocaleString()}</Text>
          <Text style={styles.originalPrice}>₨{item.originalPrice.toLocaleString()}</Text>
        </View>
        <StarRating rating={item.rating} />
        <Text style={styles.soldText}>{item.sold} sold</Text>
        <Text style={[styles.shippingText, { color: item.shipping === 'Free shipping' ? '#00A650' : '#999' }]}>
          {item.shipping}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4010" />

      {/* ── DRAWER BACKDROP OVERLAY ── */}
      {isDrawerOpen && (
        <TouchableOpacity
          style={styles.drawerBackdrop}
          activeOpacity={1}
          onPress={closeDrawer}
        />
      )}

      {/* ── DRAWER CONTENT CONTAINER ── */}
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: drawerAnim }] }]}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerLogo}>HaiderPay</Text>
          <Text style={styles.drawerUser}>Welcome, User 👋</Text>
        </View>

        <View style={styles.drawerMenu}>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
              closeDrawer();
              router.push('/businesses');
            }}
          >
            <Text style={styles.drawerItemIcon}>🏪</Text>
            <Text style={styles.drawerItemText}>Shops / Restaurants</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
              closeDrawer();
              router.push('/order-tracking');
            }}
          >
            <Text style={styles.drawerItemIcon}>📦</Text>
            <Text style={styles.drawerItemText}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
              closeDrawer();
              Alert.alert('Settings', 'App settings configuration screen...');
            }}
          >
            <Text style={styles.drawerItemIcon}>⚙️</Text>
            <Text style={styles.drawerItemText}>Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.drawerFooter}>
          <Text style={styles.drawerFooterText}>Version 1.0.0</Text>
        </View>
      </Animated.View>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>HaiderPay</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton} onPress={openDrawer} activeOpacity={0.8}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => router.push('/signup')}
          activeOpacity={0.85}
        >
          <Text style={styles.registerBtnText}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* ── SEARCH BAR ── */}
      <View style={styles.searchBar}>
        <View style={styles.searchInput}>
          <Text style={styles.searchIconText}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search on HaiderPay"
            placeholderTextColor="#999"
            style={styles.searchTextInput}
          />
          <TouchableOpacity style={styles.searchScan}>
            <Text style={{ fontSize: 16 }}>📷</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* ── SCROLLABLE BODY ── */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>

        {/* Banner Carousel */}
        <BannerCarousel onSignup={handleSignup} />

        {/* ── CATEGORIES GRID ── */}
        <View style={styles.section}>
          <View style={styles.catGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.catItem} activeOpacity={0.75}>
                <View style={styles.catIconWrap}>
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                </View>
                <Text style={styles.catLabel} numberOfLines={1}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── DIVIDER ── */}
        <View style={styles.divider} />

        {/* ── SUPER DEALS ── */}
        <View style={styles.section}>
          <View style={styles.dealHeader}>
            <View style={styles.dealTitleRow}>
              <Text style={styles.dealTitle}>⚡ Super Deals</Text>
              <View style={styles.countdownWrap}>
                <View style={styles.countdownBlock}><Text style={styles.countdownNum}>{h}</Text></View>
                <Text style={styles.countdownColon}>:</Text>
                <View style={styles.countdownBlock}><Text style={styles.countdownNum}>{m}</Text></View>
                <Text style={styles.countdownColon}>:</Text>
                <View style={styles.countdownBlock}><Text style={styles.countdownNum}>{s}</Text></View>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all {'>'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dealScroll}>
            {SUPER_DEALS.map((deal) => {
              const pct = Math.round((deal.sold / deal.total) * 100);
              return (
                <TouchableOpacity
                  key={deal.id}
                  style={styles.dealCard}
                  activeOpacity={0.85}
                  onPress={() => router.push({ pathname: '/product-detail', params: { productId: deal.id } })}
                >
                  <Image source={{ uri: deal.image }} style={styles.dealImg} />
                  <Text style={styles.dealPrice}>₨{deal.salePrice.toLocaleString()}</Text>
                  <Text style={styles.dealOriginal}>₨{deal.originalPrice.toLocaleString()}</Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
                  </View>
                  <Text style={styles.dealSoldText}>{pct}% claimed</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── DIVIDER ── */}
        <View style={styles.divider} />

        {/* ── FEED TABS ── */}
        <View style={styles.feedTabsRow}>
          {FEED_TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab}
              style={[styles.feedTab, activeTab === i && styles.feedTabActive]}
              onPress={() => setActiveTab(i)}
            >
              <Text style={[styles.feedTabText, activeTab === i && styles.feedTabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── PRODUCT GRID ── */}
        <View style={styles.productGrid}>
          {PRODUCTS.map((item) => renderProduct({ item }))}
        </View>

        {/* Bottom spacer for tab bar */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ── BOTTOM TAB BAR ── */}
      <View style={styles.tabBar}>
        {[
          { icon: '🏠', label: 'Home', active: true },
          { icon: '✅', label: 'Choice', active: false },
          { icon: '📰', label: 'Feed', active: false },
          { icon: '🛒', label: 'Cart', active: false },
          { icon: '👤', label: 'Account', active: false },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.tabItem}>
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>{tab.label}</Text>
            {tab.active && <View style={styles.tabActiveIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── STYLES ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  // Header
  header: {
    backgroundColor: '#FF4010',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 44,
    paddingBottom: 8,
    paddingHorizontal: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationIcon: { fontSize: 14 },
  locationText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  locationChevron: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 14,
  },
  headerIconBtn: {
    position: 'relative',
  },
  headerIconText: { fontSize: 20 },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -6,
    backgroundColor: '#FFD000',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#333333',
  },
  // Search Bar
  searchBar: {
    backgroundColor: '#FF4010',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
  },
  searchIconText: { fontSize: 15 },
  searchTextInput: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
    padding: 0,
  },
  searchScan: {
    paddingLeft: 4,
  },
  searchButton: {
    backgroundColor: '#FFD000',
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#333333',
    fontWeight: '800',
    fontSize: 13,
  },
  body: { flex: 1 },
  // Banner
  bannerContainer: {
    backgroundColor: '#FFFFFF',
    marginBottom: 6,
  },
  banner: {
    width,
    height: 170,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  bannerContent: {
    gap: 4,
  },
  bannerEmoji: { fontSize: 30, marginBottom: 2 },
  bannerLabel: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  bannerBtn: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  bannerBtnText: {
    color: '#FF4010',
    fontWeight: '800',
    fontSize: 12,
  },
  submitBtn: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  submitBtnText: {
    color: '#FF4010',
    fontWeight: '800',
    fontSize: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 5,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CCC',
  },
  // Section
  section: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    marginBottom: 6,
  },
  divider: {
    height: 6,
    backgroundColor: '#F5F5F5',
  },
  // Categories
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    gap: 6,
  },
  catItem: {
    width: (width - 20 - 42) / 8,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  catIconWrap: {
    width: 42,
    height: 42,
    backgroundColor: '#FFF3F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  catIcon: { fontSize: 20 },
  catLabel: {
    fontSize: 10,
    color: '#333333',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Super Deals
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  dealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#333333',
  },
  countdownWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  countdownBlock: {
    backgroundColor: '#333333',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  countdownNum: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  countdownColon: {
    color: '#333333',
    fontWeight: '900',
    fontSize: 13,
  },
  seeAll: {
    color: '#FF4010',
    fontSize: 13,
    fontWeight: '700',
  },
  dealScroll: {
    paddingLeft: 14,
  },
  dealCard: {
    width: 120,
    marginRight: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dealImg: {
    width: '100%',
    height: 100,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
    marginBottom: 6,
  },
  dealPrice: {
    color: '#FF4010',
    fontWeight: '900',
    fontSize: 16,
  },
  dealOriginal: {
    color: '#999',
    fontSize: 11,
    textDecorationLine: 'line-through',
    marginBottom: 6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF4010',
    borderRadius: 2,
  },
  dealSoldText: {
    fontSize: 10,
    color: '#999',
  },
  // Feed Tabs
  feedTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginBottom: 6,
  },
  feedTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  feedTabActive: {
    borderBottomColor: '#FF4010',
  },
  feedTabText: {
    fontSize: 13,
    color: '#999',
    fontWeight: '600',
  },
  feedTabTextActive: {
    color: '#FF4010',
    fontWeight: '800',
  },
  // Product Grid
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    gap: 8,
  },
  productCard: {
    width: COLUMN_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  productImgWrap: {
    position: 'relative',
  },
  productImg: {
    width: '100%',
    height: COLUMN_WIDTH,
    backgroundColor: '#F0F0F0',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF4010',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  choiceBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingVertical: 3,
    alignItems: 'center',
  },
  choiceBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  productInfo: {
    padding: 8,
    gap: 3,
  },
  productName: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  salePrice: {
    color: '#FF4010',
    fontSize: 16,
    fontWeight: '900',
  },
  originalPrice: {
    color: '#999',
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  starRow: {
    flexDirection: 'row',
    gap: 1,
  },
  star: {
    fontSize: 11,
  },
  soldText: {
    fontSize: 11,
    color: '#666666',
  },
  shippingText: {
    fontSize: 11,
    fontWeight: '600',
  },
  // Bottom Tab Bar
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 8,
    paddingBottom: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    position: 'relative',
  },
  tabIcon: { fontSize: 20 },
  tabLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#FF4010',
    fontWeight: '800',
  },
  tabActiveIndicator: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 3,
    backgroundColor: '#FF4010',
    borderRadius: 2,
  },
  // Menu hamburger
  menuButton: {
    padding: 6,
    marginRight: 8,
  },
  menuButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Drawer Overlay
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 280,
    backgroundColor: '#FFFFFF',
    zIndex: 1001,
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 0 },
  },
  drawerHeader: {
    backgroundColor: '#FF4010',
    padding: 24,
    paddingTop: 60,
    gap: 8,
  },
  drawerLogo: {
    fontSize: 24,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
  drawerUser: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  drawerMenu: {
    padding: 16,
    gap: 4,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  drawerItemIcon: {
    fontSize: 20,
  },
  drawerItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  drawerFooter: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  drawerFooterText: {
    fontSize: 12,
    color: '#999999',
  },
  registerBtn: {
    backgroundColor: '#FFD000',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  registerBtnText: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '800',
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
});
