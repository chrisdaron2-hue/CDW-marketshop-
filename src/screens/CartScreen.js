import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function CartScreen({
  cart,
  styles,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  checkout,
}) {
  const total = cart
    .reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    )
    .toFixed(2);

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🛒 Shopping Cart</Text>
        <Text style={styles.cartTotal}>Total: €{total}</Text>

        <TouchableOpacity onPress={checkout} style={styles.cartButton}>
          <Text style={styles.cartText}>Checkout</Text>
        </TouchableOpacity>
      </View>

      {cart.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.detailText}>Your cart is empty.</Text>
        </View>
      ) : (
        cart.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.detailTitle}>{item.title}</Text>
            <Text style={styles.detailText}>€{item.price}</Text>
            <Text style={styles.detailText}>
              Quantity: {item.quantity || 1}
            </Text>
            <Text style={styles.detailText}>
              Subtotal: €
              {(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
            </Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => decreaseQuantity(item.id)}
              >
                <Text style={styles.cartText}>➖</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => increaseQuantity(item.id)}
              >
                <Text style={styles.cartText}>➕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.deleteButtonSmall}
              onPress={() => removeFromCart(item.id)}
            >
              <Text style={styles.deleteButtonText}>🗑️ Remove</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </>
  );
}