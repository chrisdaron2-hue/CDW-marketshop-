import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";



export default function ProductCard({
  item,
  styles,
  favorites,
  toggleFavorite,
  addToCart,
  deleteProduct,
  currentUserEmail,
  setSelectedProduct,
  VERIFIED_SELLERS,
}) {
  return (
    <TouchableOpacity
      style={styles.gridCard}
      onPress={() => {
        setSelectedProduct(item);

        if (typeof window !== "undefined") {
          window.scrollTo(0, 0);
        }
      }}
    >
      {item.imageUri && item.imageUri.startsWith("http") ? (
        <Image
          source={{ uri: item.imageUri }}
          style={styles.gridImage}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>
            CDW Marketshop
          </Text>
        </View>
      )}

      <Text numberOfLines={1} style={styles.productTitle}>
        {item.title}
      </Text>

      <Text style={styles.meta}>
        👤 {item.seller}
        {VERIFIED_SELLERS.includes(item.seller) ? " ✅" : ""}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginTop: 6,
        }}
      >
        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeText}>
            €{item.price}
          </Text>
        </View>

        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>
            🆕 New
          </Text>
        </View>
      </View>

      <Text numberOfLines={1} style={styles.meta}>
        {item.category}
      </Text>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.id)}
      >
        <Text style={styles.favoriteText}>
          {favorites.includes(item.id)
            ? "❤️ Favorited"
            : "🤍 Favorite"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.cartText}>
          🛒 Add to Cart
        </Text>
      </TouchableOpacity>

      {item.sold && (
        <Text style={styles.sold}>
          SOLD
        </Text>
      )}

      {item.ownerEmail === currentUserEmail && (
        <TouchableOpacity
          style={styles.deleteButtonSmall}
          onPress={() => deleteProduct(item.id)}
        >
          <Text style={styles.deleteButtonText}>
            Delete 🗑️
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}