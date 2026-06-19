import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

export default function ShopOrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Ongoing'); // All, Ongoing, Completed, Cancelled

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {['All', 'Ongoing', 'Completed', 'Cancelled'].map(tab => (
          <TouchableOpacity key={tab} style={styles.tabItem} onPress={() => setActiveTab(tab)} activeOpacity={0.8}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
        {activeTab === 'Ongoing' && (
          <View style={styles.orderCard}>
            <View style={styles.cardTop}>
              <View style={styles.cardImageContainer}>
                <Text style={styles.logoText}>HEAVEN{'\n'}SLICE</Text>
              </View>
              <View style={styles.cardInfo}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.shopName}>Heaven Slice</Text>
                  <Text style={styles.statusText}>Confirmed</Text>
                </View>
                <Text style={styles.orderId}>Order #HS12345</Text>
                <View style={styles.cardMetaRow}>
                  <Text style={styles.metaText}>3 Items • PKR 2,750</Text>
                  <Text style={styles.deliveryText}>Delivery in 35-45 min</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.cardBottom}>
              <TouchableOpacity style={styles.trackBtn} activeOpacity={0.7} onPress={() => router.push('/shop-tracking')}>
                <Text style={styles.trackBtnText}>Track Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { label: 'Home', icon: '🏠', active: false },
          { label: 'Orders', icon: '📄', active: true },
          { label: 'Cart', icon: '🛒', active: false },
          { label: 'Account', icon: '👤', active: false, badge: 3 },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navItem} activeOpacity={0.7}>
            <View style={styles.navIconContainer}>
              <View style={[styles.iconWrapper, tab.active && styles.iconWrapperActive]}>
                <Text style={[styles.navIcon, tab.active && styles.navIconActive]}>{tab.icon}</Text>
              </View>
              {tab.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.navLabel, tab.active && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#333',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    paddingVertical: 14,
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    height: 3,
    backgroundColor: '#D32F2F',
    width: 50,
    borderRadius: 2,
  },
  body: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 8,
  },
  cardTop: {
    flexDirection: 'row',
  },
  cardImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFD000',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#28A745', // Green
  },
  orderId: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  deliveryText: {
    fontSize: 12,
    color: '#666',
  },
  cardBottom: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  trackBtn: {
    borderWidth: 1,
    borderColor: '#D32F2F',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFF5F5',
  },
  trackBtnText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 13,
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
  navIconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapperActive: {
    backgroundColor: '#D32F2F',
  },
  navIcon: {
    fontSize: 20,
    color: '#666',
  },
  navIconActive: {
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
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
