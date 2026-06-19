import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StatCardProps = {
  label: string;
  value: string;
  icon: string;
  color: string;
  bg: string;
};

export function StatCard({ label, value, icon, color, bg }: StatCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  icon: {
    fontSize: 22,
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});
