import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

// Dummy data to simulate registered businesses
const DUMMY_BUSINESSES = [
  {
    id: '1',
    name: 'Al-Farid Restaurant',
    type: 'Restaurant',
    image: 'https://picsum.photos/seed/rest1/200/200',
    rating: 4.8,
    address: 'Gulberg III, Lahore',
  },
  {
    id: '2',
    name: 'Tech Haven Shop',
    type: 'Shop',
    image: 'https://picsum.photos/seed/shop1/200/200',
    rating: 4.5,
    address: 'Hafeez Center, Lahore',
  },
  {
    id: '3',
    name: 'Bismillah Biryani',
    type: 'Restaurant',
    image: 'https://picsum.photos/seed/rest2/200/200',
    rating: 4.9,
    address: 'Johar Town, Lahore',
  },
  {
    id: '4',
    name: 'Fashion Point',
    type: 'Shop',
    image: 'https://picsum.photos/seed/shop2/200/200',
    rating: 4.2,
    address: 'Liberty Market, Lahore',
  },
  {
    id: '5',
    name: 'Burger Corner',
    type: 'Restaurant',
    image: 'https://picsum.photos/seed/rest3/200/200',
    rating: 4.6,
    address: 'DHA Phase 5, Lahore',
  },
  {
    id: '6',
    name: 'Mega Mart Grocery',
    type: 'Shop',
    image: 'https://picsum.photos/seed/shop3/200/200',
    rating: 4.7,
    address: 'Wapda Town, Lahore',
  },
];

export default function BusinessesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('All'); // 'All', 'Shop', 'Restaurant'

  const filteredData = DUMMY_BUSINESSES.filter(
    (b) => filter === 'All' || b.type === filter
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4010" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shops & Restaurants</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {['All', 'Shop', 'Restaurant'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, filter === tab && styles.tabButtonActive]}
            onPress={() => setFilter(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>
              {tab === 'All' ? 'All' : `${tab}s`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/shop-detail', params: { name: item.name } })}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.businessName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingStar}>★</Text>
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={styles.businessType}>{item.type}</Text>
              <Text style={styles.businessAddress} numberOfLines={1}>📍 {item.address}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF4010',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 44,
    paddingBottom: 14,
    paddingHorizontal: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    gap: 10,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  tabButtonActive: {
    backgroundColor: '#FFD000',
  },
  tabText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#333',
    fontWeight: '800',
  },
  listContent: {
    padding: 14,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
  },
  cardImage: {
    width: 100,
    height: 100,
    backgroundColor: '#E5E5E5',
  },
  cardInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333',
    flex: 1,
    paddingRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingStar: {
    color: '#FF4010',
    fontSize: 12,
    marginRight: 2,
  },
  ratingText: {
    color: '#FF4010',
    fontSize: 12,
    fontWeight: 'bold',
  },
  businessType: {
    fontSize: 13,
    color: '#FF4010',
    fontWeight: '600',
    marginBottom: 6,
  },
  businessAddress: {
    fontSize: 13,
    color: '#666',
  },
});
