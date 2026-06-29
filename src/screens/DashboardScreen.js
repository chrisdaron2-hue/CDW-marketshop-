import React from "react";
import { View, Text } from "react-native";

export default function DashboardScreen({
  styles,
  sellerProducts,
  sellerOrders,
  sellerMessages,
  totalReviews,
  sellerRevenue,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>📊 Seller Dashboard</Text>

      <View style={styles.dashboardGrid}>
        <View style={styles.dashboardBox}>
          <Text style={styles.dashboardNumber}>{sellerProducts.length}</Text>
          <Text style={styles.dashboardLabel}>📦 Listings</Text>
        </View>

        <View style={styles.dashboardBox}>
          <Text style={styles.dashboardNumber}>{sellerOrders.length}</Text>
          <Text style={styles.dashboardLabel}>🛒 Orders</Text>
        </View>

        <View style={styles.dashboardBox}>
          <Text style={styles.dashboardNumber}>{sellerMessages.length}</Text>
          <Text style={styles.dashboardLabel}>💬 Messages</Text>
        </View>

        <View style={styles.dashboardBox}>
          <Text style={styles.dashboardNumber}>{totalReviews}</Text>
          <Text style={styles.dashboardLabel}>⭐ Reviews</Text>
        </View>

        <View style={styles.dashboardBox}>
          <Text style={styles.dashboardNumber}>€{sellerRevenue.toFixed(2)}</Text>
          <Text style={styles.dashboardLabel}>💰 Revenue</Text>
        </View>
      </View>
    </View>
  );
}