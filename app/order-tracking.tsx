import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const TRACKING_STEPS = [
  {
    id: 1,
    title: 'Order Placed',
    description: 'Your order has been received',
    time: 'Today, 2:30 PM',
    completed: true,
  },
  {
    id: 2,
    title: 'Order Confirmed',
    description: 'Seller confirmed your order',
    time: 'Today, 3:00 PM',
    completed: true,
  },
  {
    id: 3,
    title: 'Processing',
    description: 'Your order is being prepared',
    time: 'Today, 4:00 PM',
    completed: true,
  },
  {
    id: 4,
    title: 'Shipped',
    description: 'Order handed to delivery partner',
    time: 'Tomorrow, 10:00 AM',
    completed: false,
  },
  {
    id: 5,
    title: 'Out for Delivery',
    description: 'Rider is on the way',
    time: 'Tomorrow, 2:00 PM',
    completed: false,
  },
  {
    id: 6,
    title: 'Delivered',
    description: 'Package delivered successfully',
    time: 'Tomorrow, 4:00 PM',
    completed: false,
  },
];

export default function OrderTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const orderId = (params.orderId as string) || 'ORD-123456';

  // Determine the current step (first step that is not completed)
  const currentStepIndex = TRACKING_STEPS.findIndex((s) => !s.completed);
  const currentStepId = currentStepIndex !== -1 ? TRACKING_STEPS[currentStepIndex].id : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF4010" />

      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Track Order</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>

        {/* CARD 1 ── ORDER INFO */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Order ID</Text>
              <Text style={styles.infoVal}>{orderId}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.infoLabel}>Estimated Delivery</Text>
              <Text style={styles.infoVal}>Mon - Wed, Jun 16-18</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>🚚 In Transit</Text>
          </View>
        </View>

        {/* CARD 2 ── TRACKING DETAILS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tracking Details</Text>

          <View style={styles.stepsContainer}>
            {TRACKING_STEPS.map((step, index) => {
              const isCompleted = step.completed;
              const isCurrent = step.id === currentStepId;
              const isLast = index === TRACKING_STEPS.length - 1;

              return (
                <View key={step.id} style={styles.stepRow}>
                  {/* Left Column (Vertical timeline node) */}
                  <View style={styles.timelineCol}>
                    {/* Circle Node */}
                    <View
                      style={[
                        styles.circleNode,
                        {
                          backgroundColor: isCompleted ? '#FF4010' : '#FFFFFF',
                          borderColor: isCompleted || isCurrent ? '#FF4010' : '#E5E5E5',
                        },
                      ]}
                    >
                      {isCompleted && <Text style={styles.checkMark}>✓</Text>}
                      {isCurrent && <View style={styles.currentDot} />}
                    </View>

                    {/* Connector Line */}
                    {!isLast && (
                      <View
                        style={[
                          styles.connectorLine,
                          {
                            backgroundColor: isCompleted ? '#FF4010' : '#E5E5E5',
                          },
                        ]}
                      />
                    )}
                  </View>

                  {/* Right Column (Text info) */}
                  <View style={styles.infoCol}>
                    <Text
                      style={[
                        styles.stepTitle,
                        {
                          color: isCompleted || isCurrent ? '#333333' : '#999999',
                          fontWeight: isCurrent ? '800' : '700',
                        },
                      ]}
                    >
                      {step.title}
                    </Text>
                    <Text
                      style={[
                        styles.stepDesc,
                        {
                          color: isCompleted || isCurrent ? '#666666' : '#BBBBBB',
                        },
                      ]}
                    >
                      {step.description}
                    </Text>
                    <Text
                      style={[
                        styles.stepTime,
                        {
                          color: isCompleted ? '#FF4010' : '#CCCCCC',
                        },
                      ]}
                    >
                      {step.time}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* CARD 3 ── DELIVERY PARTNER */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Partner</Text>

          <View style={styles.partnerRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>🧑</Text>
            </View>
            <View style={styles.partnerInfo}>
              <Text style={styles.partnerName}>Usman Rider</Text>
              <Text style={styles.partnerStats}>⭐ 4.8 · 1,200+ deliveries</Text>
            </View>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => Alert.alert('Calling Usman Rider...', 'Connecting your call via safe gateway.')}
              activeOpacity={0.7}
            >
              <Text style={styles.callIcon}>📞</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topBar: {
    backgroundColor: '#FF4010',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 44,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backBtn: {
    padding: 4,
  },
  backBtnText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 4,
    padding: 16,
    elevation: 1.5,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: '#999999',
    textTransform: 'uppercase',
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF1E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#FFD3B4',
  },
  statusPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D46A00',
  },
  // Steps Tree
  stepsContainer: {
    marginTop: 8,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineCol: {
    width: 24,
    alignItems: 'center',
  },
  circleNode: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  currentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4010',
  },
  connectorLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: -4,
  },
  infoCol: {
    flex: 1,
    paddingBottom: 22,
  },
  stepTitle: {
    fontSize: 14,
    color: '#333333',
  },
  stepDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  stepTime: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  // Delivery Partner
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  avatarEmoji: {
    fontSize: 26,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },
  partnerStats: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  callBtn: {
    backgroundColor: '#D1FAE5',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callIcon: {
    fontSize: 18,
  },
});
