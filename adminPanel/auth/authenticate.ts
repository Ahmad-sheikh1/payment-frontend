import { MERCHANT_CREDENTIALS, MerchantAccount } from '../constants/credentials';

export function authenticateMerchant(email: string, password: string): MerchantAccount | null {
  const normalizedEmail = email.trim().toLowerCase();
  const account = MERCHANT_CREDENTIALS.find(
    (m) => m.email.toLowerCase() === normalizedEmail && m.password === password,
  );
  return account ?? null;
}
