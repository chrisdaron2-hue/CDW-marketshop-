import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen({
  styles,
  currentUserEmail,
  profileName,
  setProfileName,
  profileBio,
  setProfileBio,
  profileLocation,
  setProfileLocation,
  isEditingProfile,
  setIsEditingProfile,
  sellerProducts,
  orders,
  favorites,
  messages,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>👤 User Profile</Text>

      {isEditingProfile ? (
        <>
          <TextInput
            style={styles.input}
            value={profileName}
            onChangeText={setProfileName}
            placeholder="Your name"
          />

          <TextInput
            style={styles.input}
            value={profileBio}
            onChangeText={setProfileBio}
            placeholder="Bio"
          />

          <TextInput
            style={styles.input}
            value={profileLocation}
            onChangeText={setProfileLocation}
            placeholder="Location"
          />

          <TouchableOpacity onPress={() => setIsEditingProfile(false)}>
            <LinearGradient
              colors={["#7b2ff7", "#f107a3"]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Save Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.detailTitle}>{profileName}</Text>
          <Text style={styles.detailText}>{profileBio}</Text>
          <Text style={styles.detailText}>📍 {profileLocation}</Text>
          <Text style={styles.detailText}>📧 {currentUserEmail}</Text>

          <TouchableOpacity onPress={() => setIsEditingProfile(true)}>
            <LinearGradient
              colors={["#7b2ff7", "#f107a3"]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>✏️ Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.dashboardGrid}>
        <View style={styles.dashboardBox}>
          <Text style={styles.dashboardNumber}>{sellerProducts.length}</Text>
          <Text style={styles.dashboardLabel}>📦 Listings</Text>
        </View>

        <View style={styles.dashboardBox}>
          <Text style={styles.dashboardNumber}>{orders.length}</Text>
          <Text style={styles.dashboardLabel}>🛒 Orders</Text>
        </View>

        <View style={styles.dashboardBox}>
          <Text style={styles.dashboardNumber}>{favorites.length}</Text>
          <Text style={styles.dashboardLabel}>❤️ Favorites</Text>
        </View>

        <View style={styles.dashboardBox}>
          <Text style={styles.dashboardNumber}>{messages.length}</Text>
          <Text style={styles.dashboardLabel}>💬 Messages</Text>
        </View>
      </View>
    </View>
  );
}