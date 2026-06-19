import type { Href } from 'expo-router';

/** Admin panel routes — typed for expo-router */
export const AdminRoutes = {
  login: '/login' as Href,
  shop: {
    root: '/adminPanel/shop' as Href,
    orders: '/adminPanel/shop/orders' as Href,
    products: '/adminPanel/shop/products' as Href,
    settings: '/adminPanel/shop/settings' as Href,
  },
  restaurant: {
    root: '/adminPanel/restaurant' as Href,
    orders: '/adminPanel/restaurant/orders' as Href,
    menu: '/adminPanel/restaurant/menu' as Href,
    settings: '/adminPanel/restaurant/settings' as Href,
  },
} as const;
