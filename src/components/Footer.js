import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function Footer({ styles }) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity>
        <Text style={styles.footerLink}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.footerLink}>Contact Us</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.footerLink}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.footerLink}>Terms of Service</Text>
      </TouchableOpacity>
    </View>
  );
}