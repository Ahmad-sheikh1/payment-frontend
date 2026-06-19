import AsyncStorage from '@react-native-async-storage/async-storage';
import { MerchantAccount } from '../constants/credentials';

let activeMerchant: MerchantAccount | null = null;

export async function initSessionFromStorage(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem('@merchant_session');
    if (raw) {
      activeMerchant = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load merchant session from storage', err);
  }
}

export function setMerchantSession(merchant: MerchantAccount): void {
  activeMerchant = merchant;
  AsyncStorage.setItem('@merchant_session', JSON.stringify(merchant)).catch((err) =>
    console.error('Failed to save merchant session to storage', err)
  );
}

export function getMerchantSession(): MerchantAccount | null {
  return activeMerchant;
}

export function clearMerchantSession(): void {
  activeMerchant = null;
  AsyncStorage.removeItem('@merchant_session').catch((err) =>
    console.error('Failed to clear merchant session from storage', err)
  );
}

export function requireMerchantSession(): MerchantAccount {
  if (!activeMerchant) {
    throw new Error('No active merchant session');
  }
  return activeMerchant;
}
