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
      <View style={styles.dashboardHeader}>
        <View>
          <Text style={styles.sectionTitle}>Seller Dashboard</Text>
          <Text style={styles.dashboardSubtitle}>
            Your marketplace activity at a glance
          </Text>
        </View>

        <Text style={styles.dashboardStatus}>● Active</Text>
      </View>

      <View style={styles.dashboardGrid}>
        <View style={styles.dashboardBox}>
          <Text style={styles.dashboardIcon}>📦</Text>
          <Text style={styles.dashboardNumber}>
            {sellerProducts.length}
          </Text>
          <Text style={styles.dashboardLabel}>Listings</Text>
        </View>

        <View style={styles.dashboardBox}>
          <Text style={styles.dashboardIcon}>🛒</Text>
          <Text style={styles.dashboardNumber}>
            {sellerOrders.length}
          </Text>
          <Text style={styles.dashboardLabel}>Orders</Text>
        </View>

        <View style={styles.dashboardBox}>
          <Text style={styles.dashboardIcon}>💬</Text>
          <Text style={styles.dashboardNumber}>
            {sellerMessages.length}
          </Text>
          <Text style={styles.dashboardLabel}>Messages</Text>
        </View>

        <View style={styles.dashboardBox}>
          <Text style={styles.dashboardIcon}>⭐</Text>
          <Text style={styles.dashboardNumber}>
            {totalReviews}
          </Text>
          <Text style={styles.dashboardLabel}>Reviews</Text>
        </View>
      </View>

      <View style={styles.revenueCard}>
        <View>
          <Text style={styles.revenueLabel}>Total Revenue</Text>
          <Text style={styles.revenueAmount}>
            €{sellerRevenue.toFixed(2)}
          </Text>
        </View>

        <Text style={styles.revenueIcon}>💰</Text>
      </View>
<View style={styles.recentOrdersCard}>
  <View style={styles.recentOrdersHeader}>
    <Text style={styles.recentOrdersTitle}>Recent Orders</Text>

    <Text style={styles.recentOrdersCount}>
      {sellerOrders.length} total
    </Text>
  </View>

  {sellerOrders.length === 0 ? (
    <View style={styles.noOrdersBox}>
      <Text style={styles.noOrdersIcon}>📦</Text>
      <Text style={styles.noOrdersTitle}>No orders yet</Text>
      <Text style={styles.noOrdersText}>
        New customer orders will appear here.
      </Text>
    </View>
  ) : (
    sellerOrders.slice(0, 3).map((order, index) => (
      <View
        key={String(order.id || index)}
        style={styles.recentOrderRow}
      >
        <View style={styles.recentOrderIcon}>
          <Text>🛍️</Text>
        </View>

        <View style={styles.recentOrderInfo}>
          <Text style={styles.recentOrderTitle}>
            {order.title ||
              order.productTitle ||
              order.product?.title ||
              "Marketplace Order"}
          </Text>

          <Text style={styles.recentOrderMeta}>
            {order.buyerEmail ||
              order.buyer ||
              order.customerEmail ||
              "Customer"}
          </Text>
        </View>

        <View style={styles.recentOrderRight}>
          <Text style={styles.recentOrderPrice}>
            €
            {Number(
              order.total ||
                order.price ||
                order.product?.price ||
                0
            ).toFixed(2)}
          </Text>

          <Text style={styles.recentOrderStatus}>
            {order.status || "Received"}
          </Text>
        </View>
      </View>
    ))
  )}
</View>
      <View style={styles.dashboardSummary}>
        <Text style={styles.dashboardSummaryTitle}>
          Seller Summary
        </Text>

        <Text style={styles.dashboardSummaryText}>
          You currently have {sellerProducts.length} active{" "}
          {sellerProducts.length === 1 ? "listing" : "listings"},{" "}
          {sellerOrders.length}{" "}
          {sellerOrders.length === 1 ? "order" : "orders"}, and{" "}
          {sellerMessages.length}{" "}
          {sellerMessages.length === 1 ? "message" : "messages"}.
        </Text>
      </View>
    </View>
  );
}
