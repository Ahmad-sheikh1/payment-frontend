import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

// Dummy Data
const POPULAR_SHOPS = [
  { id: '1', name: 'Tasty Point', rating: '4.6', time: '30-40 min', bg: '#4A1C1C' },
  { id: '2', name: 'BHOOK STOP', rating: '4.4', time: '25-35 min', bg: '#D32F2F' },
  { id: '3', name: 'Heaven Slice', rating: '4.5', time: '35-45 min', bg: '#000000' },
];

const CATEGORIES = [
  { id: '1', name: 'Pizza', icon: '🍕' },
  { id: '2', name: 'Burger', icon: '🍔' },
  { id: '3', name: 'Biryani', icon: '🍛' },
  { id: '4', name: 'Rolls', icon: '🌯' },
  { id: '5', name: 'Drinks', icon: '🥤' },
];

export default function ShopHomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Text style={styles.iconText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tasty Point</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search for restaurants, food..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Delicious Food{'\n'}Delivered Fast!</Text>
            <Text style={styles.bannerSub}>Best deals on your{'\n'}favorite food</Text>
            <TouchableOpacity style={styles.orderNowBtn} activeOpacity={0.8}>
              <Text style={styles.orderNowText}>ORDER NOW</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerImagePlaceholder}>
             <Text style={{fontSize: 50}}>🍔🍕</Text>
          </View>
        </View>

        {/* Browse All Shops Card */}
        <TouchableOpacity style={styles.browseCard} activeOpacity={0.8} onPress={() => router.push('/businesses')}>
          <View style={styles.browseIconWrap}>
            <Text style={{fontSize: 20}}>🏪</Text>
          </View>
          <View style={styles.browseTextWrap}>
            <Text style={styles.browseTitle}>Browse All Shops</Text>
            <Text style={styles.browseSub}>Restaurants, Cafes & More</Text>
          </View>
          <Text style={styles.browseArrow}>{'>'}</Text>
        </TouchableOpacity>

        {/* Popular Shops */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Shops</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {POPULAR_SHOPS.map((shop) => (
            <View key={shop.id} style={styles.shopItem}>
              <View style={[styles.shopCircle, { backgroundColor: shop.bg }]}>
                <Text style={styles.shopCircleText}>{shop.name.replace(' ', '\n')}</Text>
              </View>
              <Text style={styles.shopName} numberOfLines={1}>{shop.name}</Text>
              <Text style={styles.shopMeta}>★ {shop.rating} | {shop.time}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {CATEGORIES.map((cat) => (
            <View key={cat.id} style={styles.catItem}>
              <View style={styles.catCircle}>
                <Text style={styles.catIcon}>{cat.icon}</Text>
              </View>
              <Text style={styles.catName}>{cat.name}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { label: 'Home', icon: '🏠', active: true },
          { label: 'Orders', icon: '📄', active: false },
          { label: 'Cart', icon: '🛒', active: false },
          { label: 'Account', icon: '👤', active: false },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navItem} activeOpacity={0.7}>
            <Text style={styles.navIcon}>{tab.icon}</Text>
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
    backgroundColor: '#D32F2F', // matching image red
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
    fontSize: 20,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  searchIcon: {
    fontSize: 16,
    color: '#666',
  },
  banner: {
    backgroundColor: '#5A1A1A',
    marginHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    padding: 16,
    overflow: 'hidden',
    height: 160,
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  bannerSub: {
    color: '#DDD',
    fontSize: 12,
    marginBottom: 12,
  },
  orderNowBtn: {
    backgroundColor: '#FFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  orderNowText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 11,
  },
  bannerImagePlaceholder: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  browseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  browseIconWrap: {
    width: 40,
    height: 40,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  browseTextWrap: {
    flex: 1,
  },
  browseTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333',
  },
  browseSub: {
    fontSize: 12,
    color: '#666',
  },
  browseArrow: {
    fontSize: 18,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333',
  },
  seeAllText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  hScroll: {
    paddingLeft: 16,
  },
  shopItem: {
    width: 110,
    marginRight: 16,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  shopCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopCircleText: {
    color: '#FFD000',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 14,
  },
  shopName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  shopMeta: {
    fontSize: 11,
    color: '#888',
  },
  catItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  catCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  catIcon: {
    fontSize: 30,
  },
  catName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
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
    marginBottom: 4,
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
