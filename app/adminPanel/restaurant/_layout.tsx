import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { RestaurantAdminTheme as theme } from '@/adminPanel/constants/theme';

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 18 }}>{emoji}</Text>;
}

export default function RestaurantAdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#FECACA',
          paddingBottom: 6,
          height: 62,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: () => <TabIcon emoji="🍽️" />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Kitchen',
          tabBarIcon: () => <TabIcon emoji="🔥" />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: () => <TabIcon emoji="📖" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: () => <TabIcon emoji="⚙️" />,
        }}
      />
    </Tabs>
  );
}
