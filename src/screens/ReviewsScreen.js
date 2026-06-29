import React from "react";
import { View, Text } from "react-native";

export default function ReviewsScreen({ reviews, styles }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Reviews</Text>

      {reviews.length === 0 ? (
        <Text style={styles.detailText}>No reviews yet.</Text>
      ) : (
        reviews.map((review) => (
          <View key={review.id} style={styles.card}>
            <Text style={styles.detailText}>
              Product: {review.productTitle}
            </Text>
            <Text style={styles.detailText}>⭐ {review.rating}/5</Text>
            <Text style={styles.detailText}>{review.text}</Text>
            <Text style={styles.detailText}>
              By: {review.reviewer || "Guest"}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}