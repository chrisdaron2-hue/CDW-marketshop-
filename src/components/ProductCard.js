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
  const openProduct = () => {
  setSelectedProduct(item);

  if (typeof window !== "undefined") {
    window.scrollTo(0, 0);
  }
};
return (
    <View style={styles.gridCard}>

  {/* Clickable image and title */}
  <TouchableOpacity onPress={openProduct}>
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
  </TouchableOpacity>

  <Text style={styles.meta}>
    👤 {item.seller}
    {VERIFIED_SELLERS.includes(item.seller) ? " ✅" : ""}
  </Text>

  <View style={styles.priceBadge}>
    <Text style={styles.priceBadgeText}>€{item.price}</Text>
  </View>

  <Text style={styles.meta}>{item.category}</Text>

  {/* 👇 Put the View Details button HERE */}
  <TouchableOpacity
    style={styles.messageButton}
    onPress={openProduct}
  >
    <Text style={styles.messageText}>View Details</Text>
  </TouchableOpacity>

  {/* Favorite button */}
  <TouchableOpacity
    style={styles.favoriteButton}
    onPress={(e) => {
      e.stopPropagation?.();
      toggleFavorite(item.id);
    }}
  >
    <Text style={styles.favoriteText}>
      {favorites.includes(item.id)
        ? "❤️ Favorited"
        : "🤍 Favorite"}
    </Text>
  </TouchableOpacity>

  {/* Add to Cart */}
  <TouchableOpacity
    style={styles.cartButton}
    onPress={(e) => {
      e.stopPropagation?.();
      addToCart(item);
    }}
  >
    <Text style={styles.cartText}>
      🛒 Add to Cart
    </Text>
  </TouchableOpacity>

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
</View>
  );
}
