import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

export default function ShopSuccessScreen() {
  const router = useRouter();

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>

          <Text style={styles.title}>Order Placed Successfully!</Text>
          <Text style={styles.subtitle}>Your order has been placed.</Text>

          <Text style={styles.boldText}>Order ID: #HS12345</Text>
          <Text style={styles.boldText}>Estimated Delivery: 35-45 min</Text>

          <TouchableOpacity
            style={styles.trackBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/shop-tracking')}
          >
            <Text style={styles.trackBtnText}>Track Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            activeOpacity={0.7}
            onPress={() => router.push('/shop-home')}
          >
            <Text style={styles.homeBtnText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#28A745',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkIcon: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  trackBtn: {
    backgroundColor: '#D32F2F',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  trackBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeBtn: {
    paddingVertical: 12,
  },
  homeBtnText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
