export type MerchantType = 'shop' | 'restaurant';

export interface MerchantAccount {
  id: string;
  email: string;
  password: string;
  type: MerchantType;
  businessName: string;
  ownerName: string;
  phone: string;
  address: string;
}

/** Dummy merchant login accounts — shop vs restaurant */
export const MERCHANT_CREDENTIALS: MerchantAccount[] = [
  {
    id: 'shop_1',
    email: 'shop@haiderpay.com',
    password: 'shop123',
    type: 'shop',
    businessName: 'Tech Haven Shop',
    ownerName: 'Ahmed Khan',
    phone: '0311-1234567',
    address: 'Hafeez Center, Lahore',
  },
  {
    id: 'shop_2',
    email: 'fashion@haiderpay.com',
    password: 'shop123',
    type: 'shop',
    businessName: 'Fashion Point',
    ownerName: 'Sara Ali',
    phone: '0321-9876543',
    address: 'Liberty Market, Lahore',
  },
  {
    id: 'signup_test',
    email: 'signup-test@haiderpay.com',
    password: 'test123',
    type: 'shop',
    businessName: 'Offline Test Shop',
    ownerName: 'Signup Tester',
    phone: '0300-1112233',
    address: 'Vercel Web Test Road, Lahore',
  },
  {
    id: 'rest_1',
    email: 'restaurant@haiderpay.com',
    password: 'rest123',
    type: 'restaurant',
    businessName: 'Al-Farid Restaurant',
    ownerName: 'Farid Hussain',
    phone: '0300-5551234',
    address: 'Gulberg III, Lahore',
  },
  {
    id: 'rest_2',
    email: 'biryani@haiderpay.com',
    password: 'rest123',
    type: 'restaurant',
    businessName: 'Bismillah Biryani',
    ownerName: 'Imran Shah',
    phone: '0333-4445566',
    address: 'Johar Town, Lahore',
  },
];

export const DEMO_CREDENTIAL_HINTS = {
  shop: MERCHANT_CREDENTIALS.filter((m) => m.type === 'shop').map((m) => ({
    email: m.email,
    password: m.password,
    businessName: m.businessName,
  })),
  restaurant: MERCHANT_CREDENTIALS.filter((m) => m.type === 'restaurant').map((m) => ({
    email: m.email,
    password: m.password,
    businessName: m.businessName,
  })),
};
