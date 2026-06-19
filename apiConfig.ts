import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Extract packager host IP dynamically from Expo's hostUri
const getIpAddress = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return ip;
  }
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
};

export const API_URL = `http://${getIpAddress()}:5000`;
