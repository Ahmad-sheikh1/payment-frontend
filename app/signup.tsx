import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Image, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../apiConfig';
import { useRouter } from 'expo-router';
import { getMerchantSession } from '../adminPanel/auth/session';

export default function SignupScreen() {
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

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    cnic: '',
    password: '',
    businessType: '',
    images: [] as string[],
  });

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, form);
      const { message, user } = res.data;
      Alert.alert('Success', message);
      // Navigate based on role
      if (user.role === 'Shop') {
        router.push('/adminPanel/shop');
      } else if (user.role === 'Restaurant') {
        router.push('/adminPanel/restaurant');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err?.response?.data?.message || 'Signup failed');
    }
  };


  const [showDropdown, setShowDropdown] = useState(false);

  const addDummyImage = () => {
    setForm(prev => ({
      ...prev,
      images: [...prev.images, `https://picsum.photos/seed/${Math.random()}/150/150`]
    }));
  };

  const removeImage = (index: number) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm(prev => ({ ...prev, images: newImages }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4010" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Images Upload Section */}
        <View style={styles.imagesSection}>
          <Text style={styles.label}>Upload Business Images</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imagesScroll}>
            {form.images.map((img, i) => (
              <View key={i} style={styles.imagePreviewWrap}>
                <Image source={{ uri: img }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(i)}>
                  <Text style={styles.removeImageText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.imageUploadBtn} onPress={addDummyImage} activeOpacity={0.8}>
              <Text style={styles.imageUploadIcon}>📷</Text>
              <Text style={styles.imageUploadText}>Add</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          
          <View style={[styles.inputGroup, { zIndex: 10 }]}>
            <Text style={styles.label}>Business Type</Text>
            <TouchableOpacity
              style={[styles.input, { justifyContent: 'center' }]}
              onPress={() => setShowDropdown(!showDropdown)}
              activeOpacity={0.8}
            >
              <Text style={{ color: form.businessType ? '#333' : '#999', fontSize: 15 }}>
                {form.businessType || 'Select Business Type'}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            
            {showDropdown && (
              <View style={styles.dropdownList}>
                {['Shop', 'Restaurant'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setForm({ ...form, businessType: option });
                      setShowDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={form.fullName}
              onChangeText={(text) => setForm({ ...form, fullName: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(text) => setForm({ ...form, phone: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CNIC</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your CNIC (e.g. 12345-1234567-1)"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={form.cnic}
              onChangeText={(text) => setForm({ ...form, cnic: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a strong password"
              placeholderTextColor="#999"
              secureTextEntry
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85} onPress={handleSignup}>
          <Text style={styles.submitBtnText}>Create Account</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginLinkText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLinkHighlight}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
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
  scrollContent: {
    padding: 20,
  },
  imagesSection: {
    marginBottom: 20,
  },
  imagesScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  imagePreviewWrap: {
    width: 80,
    height: 80,
    marginRight: 12,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF4010',
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
  imageUploadBtn: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FFD000',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  imageUploadText: {
    color: '#FF4010',
    fontSize: 12,
    fontWeight: '700',
  },
  formContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
    zIndex: 1,
  },
  inputGroup: {
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 14,
    fontSize: 12,
    color: '#999',
  },
  dropdownList: {
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 100,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownOptionText: {
    fontSize: 15,
    color: '#333',
  },
  submitBtn: {
    backgroundColor: '#FFD000',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  submitBtnText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '900',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#666',
    fontSize: 14,
  },
  loginLinkHighlight: {
    color: '#FF4010',
    fontSize: 14,
    fontWeight: '800',
  },
});
