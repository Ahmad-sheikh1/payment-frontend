import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ShopTrackingScreen() {
  const router = useRouter();
  const { orderId, shopName } = useLocalSearchParams<{ orderId?: string; shopName?: string }>();

  const currentOrderId = orderId || 'RT-' + Math.floor(Math.random() * 9000 + 1000);
  const currentShopName = shopName || 'Heaven Slice';

  // Get initials for placeholder logo
  const logoInitials = currentShopName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
        <View style={styles.card}>
          
          {/* Top Info */}
          <View style={styles.cardTopRow}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>{logoInitials || 'HS'}</Text>
            </View>
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>Order #{currentOrderId}</Text>
              <Text style={styles.shopName}>{currentShopName}</Text>
              <Text style={styles.orderMeta}>Order Status: Confirmed</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.trackingContent}>
            {/* Timeline */}
            <View style={styles.timelineContainer}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={[styles.timelineIcon, styles.iconCompleted]}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                  <View style={styles.timelineLineCompleted} />
                </View>
                <View style={styles.timelineTextContainer}>
                  <Text style={styles.timelineTitle}>Order Confirmed</Text>
                  <Text style={styles.timelineTime}>Just now</Text>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={[styles.timelineIcon, styles.iconCompleted]}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                  <View style={styles.timelineLineCompleted} />
                </View>
                <View style={styles.timelineTextContainer}>
                  <Text style={styles.timelineTitle}>Preparing Your Order</Text>
                  <Text style={styles.timelineTime}>10 min</Text>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={[styles.timelineIcon, styles.iconCompleted]}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                  <View style={styles.timelineLinePending} />
                </View>
                <View style={styles.timelineTextContainer}>
                  <Text style={styles.timelineTitle}>On The Way</Text>
                  <Text style={styles.timelineTime}>20 min</Text>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={[styles.timelineIcon, styles.iconPending]}>
                    <Text style={styles.checkTextPending}>✓</Text>
                  </View>
                </View>
                <View style={styles.timelineTextContainer}>
                  <Text style={styles.timelineTitlePending}>Delivered</Text>
                  <Text style={styles.timelineTime}>35-45 min</Text>
                </View>
              </View>
            </View>

            {/* Rider Card */}
            <View style={styles.riderCard}>
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2953/2953363.png' }} 
                style={styles.riderImage} 
                resizeMode="contain"
              />
              <Text style={styles.riderTitle}>Out for Delivery!</Text>
              <Text style={styles.riderDesc}>Rider is on the way to{'\n'}deliver your order.</Text>
              <TouchableOpacity style={styles.liveTrackBtn} activeOpacity={0.8}>
                <Text style={styles.liveTrackBtnText}>Live Tracking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  iconButton: {
    padding: 4,
  },
  iconText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  body: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFD000',
    fontSize: 8,
    fontWeight: '900',
    textAlign: 'center',
  },
  orderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  shopName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  orderMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  helpText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  trackingContent: {
    flexDirection: 'row',
  },
  timelineContainer: {
    flex: 1.2,
    paddingRight: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
    minHeight: 60,
  },
  timelineIconContainer: {
    width: 24,
    alignItems: 'center',
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  iconCompleted: {
    backgroundColor: '#28A745',
  },
  iconPending: {
    backgroundColor: '#E0E0E0',
  },
  checkText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkTextPending: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timelineLineCompleted: {
    width: 2,
    flex: 1,
    backgroundColor: '#28A745',
    marginTop: -4,
    marginBottom: -4,
  },
  timelineLinePending: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    marginTop: -4,
    marginBottom: -4,
  },
  timelineTextContainer: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  timelineTitlePending: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#999',
  },
  timelineTime: {
    fontSize: 11,
    color: '#666',
  },
  riderCard: {
    flex: 1,
    backgroundColor: '#F2F8F4',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  riderImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  riderTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E4620',
    marginBottom: 4,
    textAlign: 'center',
  },
  riderDesc: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  liveTrackBtn: {
    backgroundColor: '#28A745',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  liveTrackBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
