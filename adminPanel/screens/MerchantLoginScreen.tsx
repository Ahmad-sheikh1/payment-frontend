import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { authenticateMerchant } from '../auth/authenticate';
import { setMerchantSession } from '../auth/session';
import { DEMO_CREDENTIAL_HINTS } from '../constants/credentials';
import { AdminRoutes } from '../constants/routes';

export default function MerchantLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const account = authenticateMerchant(email, password);

    if (!account) {
      Alert.alert('Login Failed', 'Invalid email or password. Use demo credentials below.');
      return;
    }

    setMerchantSession(account);

    if (account.type === 'shop') {
      router.replace(AdminRoutes.shop.root);
    } else {
      router.replace(AdminRoutes.restaurant.root);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0C" />

      <View style={styles.topBar}>
        <Text style={styles.brand}>HaiderPay</Text>
        <Text style={styles.brandSub}>Merchant Admin</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Merchant Login</Text>
          <Text style={styles.formDesc}>Shop ya Restaurant account se login karein</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="merchant@haiderpay.com"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.loginBtnText}>Login to Admin Panel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hintsSection}>
          <Text style={styles.hintsTitle}>Demo Shop Credentials</Text>
          {DEMO_CREDENTIAL_HINTS.shop.map((item) => (
            <TouchableOpacity
              key={item.email}
              style={[styles.hintCard, styles.shopHint]}
              onPress={() => {
                setEmail(item.email);
                setPassword(item.password);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.hintName}>{item.businessName}</Text>
              <Text style={styles.hintCred}>{item.email}</Text>
              <Text style={styles.hintCred}>Password: {item.password}</Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.hintsTitle, { marginTop: 16 }]}>Demo Restaurant Credentials</Text>
          {DEMO_CREDENTIAL_HINTS.restaurant.map((item) => (
            <TouchableOpacity
              key={item.email}
              style={[styles.hintCard, styles.restHint]}
              onPress={() => {
                setEmail(item.email);
                setPassword(item.password);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.hintName}>{item.businessName}</Text>
              <Text style={styles.hintCred}>{item.email}</Text>
              <Text style={styles.hintCred}>Password: {item.password}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0C',
  },
  topBar: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  brand: {
    color: '#FF4010',
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  brandSub: {
    color: '#9E9EA4',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
  },
  formDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
    marginBottom: 14,
  },
  loginBtn: {
    backgroundColor: '#FF4010',
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  hintsSection: {
    gap: 10,
  },
  hintsTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  hintCard: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  shopHint: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    borderColor: 'rgba(37, 99, 235, 0.35)',
  },
  restHint: {
    backgroundColor: 'rgba(211, 47, 47, 0.12)',
    borderColor: 'rgba(211, 47, 47, 0.35)',
  },
  hintName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  hintCred: {
    color: '#CBD5E1',
    fontSize: 12,
  },
});
