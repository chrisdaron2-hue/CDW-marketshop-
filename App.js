import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Linking,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Amplify } from "aws-amplify";
import { signIn, signUp, resetPassword } from "aws-amplify/auth";
import awsConfig from "./src/aws-exports";

Amplify.configure(awsConfig);
const ORDERS_API_URL =
  "https://pnux75snm55hv4nea3tnellfxu0nknwn.lambda-url.us-east-1.on.aws/";
const PRODUCTS_API_URL =
  "https://pcoe3iv4uvig2f6q7jpfkhjkom0flvjq.lambda-url.us-east-1.on.aws/";
const IMAGE_UPLOAD_API_URL =
  "https://7ekgx567jkyzplwcacw66sioxm0ynpul.lambda-url.us-east-1.on.aws/";
function notify(message) {
  if (typeof window !== "undefined") {
    window.alert(message);
  } else {
    Alert.alert(message);
  }
}
const REVIEWS_API_URL =
  "https://qrd6nvt7ukofww6wijocc5yfzy0yxiis.lambda-url.us-east-1.on.aws/";
const MESSAGES_API_URL =
  "https://bw7zxoabdbemo76hzz3x7spfje0tntlb.lambda-url.us-east-1.on.aws/";
const sampleProducts = [
  { id: "sample-1", title: "iPhone 13", price: "450", seller: "Lizzy", category: "Electronics", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500", sold: false },
  { id: "sample-2", title: "Nike Sneakers", price: "60", seller: "Ama", category: "Fashion", condition: "Used - Like New", imageUri: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", sold: false },
  { id: "sample-3", title: "MacBook Air", price: "700", seller: "Chris", category: "Electronics", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", sold: false },
  { id: "sample-4", title: "Samsung TV", price: "250", seller: "David", category: "Electronics", condition: "Used - Fair", imageUri: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500", sold: false },
  { id: "sample-5", title: "Gaming Chair", price: "90", seller: "Maya", category: "Gaming", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500", sold: false },
  { id: "sample-6", title: "Apple Watch", price: "180", seller: "Sarah", category: "Electronics", condition: "Used - Like New", imageUri: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500", sold: false },
  { id: "sample-7", title: "PS5 Controller", price: "45", seller: "Kwame", category: "Gaming", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500", sold: false },
  { id: "sample-8", title: "Canon Camera", price: "320", seller: "Ella", category: "Electronics", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500", sold: false },
  { id: "sample-9", title: "Leather Jacket", price: "75", seller: "Nana", category: "Fashion", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500", sold: false },
  { id: "sample-10", title: "Study Desk", price: "110", seller: "Grace", category: "Home", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500", sold: false },
  { id: "sample-11", title: "AirPods Pro", price: "120", seller: "Linda", category: "Electronics", condition: "Used - Like New", imageUri: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500", sold: false },
  { id: "sample-12", title: "Coffee Table", price: "85", seller: "James", category: "Home", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500", sold: false },
  { id: "sample-13", title: "Mountain Bike", price: "230", seller: "Kelvin", category: "Sports", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500", sold: false },
  { id: "sample-14", title: "PlayStation 5", price: "480", seller: "Ben", category: "Gaming", condition: "Used - Like New", imageUri: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500", sold: false },
  { id: "sample-15", title: "Sofa", price: "300", seller: "Hannah", category: "Home", condition: "Used - Fair", imageUri: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500", sold: false },
  { id: "sample-16", title: "Dell Monitor", price: "140", seller: "Tom", category: "Electronics", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=500", sold: false },
  { id: "sample-17", title: "Backpack", price: "35", seller: "Ella", category: "Fashion", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", sold: false },
  { id: "sample-18", title: "Dining Chairs", price: "95", seller: "Grace", category: "Home", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=500", sold: false },
  { id: "sample-19", title: "Kindle Paperwhite", price: "70", seller: "Nina", category: "Books", condition: "Used - Like New", imageUri: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=500", sold: false },
  { id: "sample-20", title: "Running Shoes", price: "55", seller: "Mike", category: "Sports", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", sold: false },
{ id: "sample-1", title: "iPhone 13", price: "450", seller: "Lizzy", category: "Electronics", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500", sold: false },
  { id: "sample-2", title: "Nike Sneakers", price: "60", seller: "Ama", category: "Fashion", condition: "Used - Like New", imageUri: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", sold: false },
  { id: "sample-3", title: "MacBook Air", price: "700", seller: "Chris", category: "Electronics", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", sold: false },
  { id: "sample-4", title: "Samsung TV", price: "250", seller: "David", category: "Electronics", condition: "Used - Fair", imageUri: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500", sold: false },
  { id: "sample-5", title: "Gaming Chair", price: "90", seller: "Maya", category: "Gaming", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500", sold: false },
  { id: "sample-6", title: "Apple Watch", price: "180", seller: "Sarah", category: "Electronics", condition: "Used - Like New", imageUri: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500", sold: false },
  { id: "sample-7", title: "PS5 Controller", price: "45", seller: "Kwame", category: "Gaming", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500", sold: false },
  { id: "sample-8", title: "Canon Camera", price: "320", seller: "Ella", category: "Electronics", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500", sold: false },
  { id: "sample-9", title: "Leather Jacket", price: "75", seller: "Nana", category: "Fashion", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500", sold: false },
  { id: "sample-10", title: "Study Desk", price: "110", seller: "Grace", category: "Home", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500", sold: false },
  { id: "sample-11", title: "AirPods Pro", price: "120", seller: "Linda", category: "Electronics", condition: "Used - Like New", imageUri: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500", sold: false },
  { id: "sample-12", title: "Coffee Table", price: "85", seller: "James", category: "Home", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500", sold: false },
  { id: "sample-13", title: "Mountain Bike", price: "230", seller: "Kelvin", category: "Sports", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500", sold: false },
  { id: "sample-14", title: "PlayStation 5", price: "480", seller: "Ben", category: "Gaming", condition: "Used - Like New", imageUri: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500", sold: false },
  { id: "sample-15", title: "Sofa", price: "300", seller: "Hannah", category: "Home", condition: "Used - Fair", imageUri: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500", sold: false },
  { id: "sample-16", title: "Dell Monitor", price: "140", seller: "Tom", category: "Electronics", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=500", sold: false },
  { id: "sample-17", title: "Backpack", price: "35", seller: "Ella", category: "Fashion", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", sold: false },
  { id: "sample-18", title: "Dining Chairs", price: "95", seller: "Grace", category: "Home", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=500", sold: false },
  { id: "sample-19", title: "Kindle Paperwhite", price: "70", seller: "Nina", category: "Books", condition: "Used - Like New", imageUri: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=500", sold: false },
  { id: "sample-20", title: "Running Shoes", price: "55", seller: "Mike", category: "Sports", condition: "Used - Good", imageUri: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", sold: false },
];

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const VERIFIED_SELLERS = [
  "David",
  "Daron",
  "Lizzy",
  "Elizabeth",
  "Admin",
];
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [seller, setSeller] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [imageUri, setImageUri] = useState(null);
const [showMessages, setShowMessages] = useState(false);
  const [products, setProducts] = useState(sampleProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedSeller, setSelectedSeller] = useState(null);
const [replyText, setReplyText] = useState("");
const [selectedMessage, setSelectedMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
const [editingProduct, setEditingProduct] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
const messageCount = messages.length;
const reviewCount = reviews.length;
const orderCount = orders.length;
  const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Home",
  "Sports",
  "Books",
  "Favorites",
  "Cart",
  "My Listings",
  
  `Messages (${messageCount})`,
`Reviews (${reviewCount})`,
`Orders (${orderCount})`,
];

useEffect(() => {
  loadProducts();
  loadMessages();
  loadReviews();
  loadOrders();
}, []);
useEffect(() => {
  if (typeof window === "undefined") return;

  const savedFavorites = window.localStorage.getItem("favorites");
  const savedCart = window.localStorage.getItem("cart");

  if (savedFavorites) {
    setFavorites(JSON.parse(savedFavorites));
  }

  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);

useEffect(() => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("favorites", JSON.stringify(favorites));
}, [favorites]);

useEffect(() => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);
  async function loadProducts() {
    try {
      const response = await fetch(PRODUCTS_API_URL);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setProducts([...data, ...sampleProducts]);
      }
    } catch (error) {
      console.log("LOAD ERROR:", error);
    }
  }

  async function handleSignIn() {
  if (!email || !password) {
    notify("Enter email and password.");
    return;
  }

  try {
    await signIn({
      username: email.trim().toLowerCase(),
      password,
      options: { authFlowType: "USER_AUTH" },
    });

    setCurrentUserEmail(email.trim().toLowerCase());

    notify("Signed in.");
  } catch (error) {
    console.log("SIGN IN ERROR:", error);
    notify(error.message || "Sign in failed.");
  }
}

  async function handleSignUp() {
    if (!email || !password) {
      notify("Enter email and password.");
      return;
    }

    try {
      await signUp({
        username: email.trim().toLowerCase(),
        password,
        options: {
          userAttributes: {
            email: email.trim().toLowerCase(),
          },
        },
      });

      notify("Account created. Check your email.");
    } catch (error) {
      console.log("SIGN UP ERROR:", error);
      notify(error.message || "Signup failed.");
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      notify("Enter your email first.");
      return;
    }

    try {
      await resetPassword({
        username: email.trim().toLowerCase(),
      });

      notify("Password reset code sent.");
    } catch (error) {
      notify(error.message || "Could not reset password.");
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }
async function uploadImageToS3(localImageUri) {
  if (!localImageUri) {
    return null;
  }

  const response = await fetch(localImageUri);
  const blob = await response.blob();

  const reader = new FileReader();

  const base64Image = await new Promise((resolve, reject) => {
    reader.onloadend = () => {
      const result = reader.result;
      const base64 = result.split(",")[1];
      resolve(base64);
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  const uploadResponse = await fetch(IMAGE_UPLOAD_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageBase64: base64Image,
      fileName: `product-${Date.now()}.jpg`,
      contentType: "image/jpeg",
    }),
  });

  const uploadText = await uploadResponse.text();
console.log("UPLOAD RESPONSE:", uploadText);

let uploadData = {};
try {
  uploadData = JSON.parse(uploadText);
} catch (e) {
  throw new Error(uploadText);
}

if (!uploadResponse.ok || !uploadData.imageUrl) {
  throw new Error(uploadData.message || uploadData.error || "Image upload failed");
}

  return uploadData.imageUrl;
}
  async function addProduct() {
    if (!title || !price || !seller || !category || !condition) {
  notify("Fill all product fields.");
  return;
}
let uploadedImageUrl = imageUri;

try {
  uploadedImageUrl = await uploadImageToS3(imageUri);
} catch (error) {
  console.log("IMAGE UPLOAD ERROR:", error);
  notify("Image upload failed.");
  return;
}

const newProduct = {
  id: Date.now().toString(),
  title,
  price,
  seller,
  category,
  condition,
  imageUri: uploadedImageUrl,
  sold: false,
  rating: 5,
  ownerEmail: currentUserEmail,
};
    try {
      await fetch(PRODUCTS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      setProducts([newProduct, ...products]);
      setTitle("");
      setPrice("");
      setSeller("");
      setCategory("");
      setCondition("");
      setImageUri(null);

      notify("Product posted.");
    } catch (error) {
      notify("Could not save product.");
    }
  }async function deleteProduct(productId) {
  setProducts((prev) => prev.filter((p) => p.id !== productId));

  if (selectedProduct?.id === productId) {
    setSelectedProduct(null);
  }

  notify("Item removed.");

  if (productId.startsWith("sample-")) {
    return;
  }

  try {
    await fetch(PRODUCTS_API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: productId }),
    });
  } catch (error) {
    console.log("DELETE ERROR:", error);
  }
}

 async function buyProduct(product) {
  const newOrder = {
    id: Date.now().toString(),
    productId: product.id,
    title: product.title,
    price: product.price,
    seller: product.seller,
    buyer: currentUserEmail,
    purchasedAt: new Date().toISOString(),
  };

  try {
    await fetch(ORDERS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    });

    setOrders([...orders, newOrder]);

    setProducts(
      products.map((p) =>
        p.id === product.id ? { ...p, sold: true } : p
      )
    );

    setSelectedProduct({ ...product, sold: true });

    notify("Order placed successfully.");
  } catch (error) {
    console.log("ORDER ERROR:", error);
    notify("Failed to save order.");
  }
}
function toggleFavorite(productId) {
  if (favorites.includes(productId)) {
    setFavorites(favorites.filter((id) => id !== productId));
  } else {
    setFavorites([...favorites, productId]);
  }
}
function addToCart(product) {
  
  if (!cart.find((item) => item.id === product.id)) {
    setCart([...cart, product]);
    notify("Added to cart.");
  } else {
    notify("Already in cart.");
  }
}
function removeFromCart(productId) {
  setCart(cart.filter((item) => item.id !== productId));
  notify("Removed from cart.");
}

function checkout() {
  if (cart.length === 0) {
    notify("Your cart is empty.");
    return;
  }

  notify("Checkout coming soon.");
}
function contactSeller(product) {
  const subject = `Interested in ${product.title}`;
  const body = `Hi ${product.seller}, I am interested in your product: ${product.title} for €${product.price}. Is it still available?`;

  Linking.openURL(
    `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  );
}
async function sendMessage(product) {
  if (!messageText.trim()) {
    notify("Enter a message.");
    return;
  }

  const newMessage = {
    id: Date.now().toString(),
    productId: product.id,
    productTitle: product.title,
    seller: product.seller,
    buyer: currentUserEmail || "Guest",
    text: messageText,
    createdAt: new Date().toISOString(),
  };

  try {
    await fetch(MESSAGES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    });

    setMessages([...messages, newMessage]);
    setMessageText("");
    notify("Message sent.");
  } catch (error) {
    console.log("MESSAGE ERROR:", error);
    notify("Failed to send message.");
  }
}
async function submitReview(product) {
  if (!reviewText.trim()) {
    notify("Enter a review.");
    return;
  }

  const newReview = {
    id: Date.now().toString(),
    productId: product.id,
    productTitle: product.title,
    reviewer: currentUserEmail,
    text: reviewText,
    rating: 5,
  };
  try {
    await fetch(REVIEWS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReview),
    });

    setReviews([...reviews, newReview]);
    setReviewText("");
    notify("Review added.");
  } catch (error) {
    console.log("REVIEW ERROR:", error);
    notify("Failed to save review.");
  }
}
async function loadReviews() {
  try {
    const response = await fetch(REVIEWS_API_URL);
    const data = await response.json();

    if (Array.isArray(data)) {
      setReviews(data);
    }
  } catch (error) {
    console.log("LOAD REVIEWS ERROR:", error);
  }
}
async function loadMessages() {
  try {
    const response = await fetch(MESSAGES_API_URL);
    const data = await response.json();

    if (Array.isArray(data)) {
      setMessages(data);
    }
  } catch (error) {
    console.log("LOAD MESSAGES ERROR:", error);
  }
}
async function loadOrders() {
  try {
    const response = await fetch(ORDERS_API_URL);
    const data = await response.json();

    if (Array.isArray(data)) {
      setOrders(data);
    }
  } catch (error) {
    console.log("LOAD ORDERS ERROR:", error);
  }
}
async function saveEditedProduct() {
  try {
    const updatedProducts = products.map((product) =>
      product.id === editingProduct.id ? editingProduct : product
    );

    setProducts(updatedProducts);
    setSelectedProduct(editingProduct);
    setEditingProduct(null);

    notify("Product updated successfully.");
  } catch (error) {
    console.log("EDIT ERROR:", error);
    notify("Failed to update product.");
  }
}
async function handleSignOut() {
  setCurrentUserEmail("");
  setSelectedProduct(null);
  notify("Signed out.");
}
  const filteredProducts = products.filter((item) => {
  const text = search.trim().toLowerCase();

  const matchesSearch =
    text === "" ||
    item.title?.toLowerCase().includes(text) ||
    item.category?.toLowerCase().includes(text) ||
    item.seller?.toLowerCase().includes(text) ||
    item.condition?.toLowerCase().includes(text);

  const matchesCategory =
    activeCategory === "All" ||
    item.category === activeCategory ||
    (activeCategory === "Favorites" && favorites.includes(item.id)) ||
    (activeCategory === "Cart" &&
      cart.find((cartItem) => cartItem.id === item.id)) ||
    (activeCategory === "My Listings" &&
      item.ownerEmail === currentUserEmail);
  return matchesSearch && matchesCategory;
});
  if (editingProduct) {
  return (
    <LinearGradient
      colors={["#1a0033", "#4a148c", "#7b2ff7", "#ff4ecd"]}
      style={styles.container}
    >
      <ScrollView>
        <TouchableOpacity onPress={() => setEditingProduct(null)}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>✏️ Edit Product</Text>
<TextInput
  style={styles.input}
  value={editingProduct.title || ""}
  placeholder="Product title"
  onChangeText={(text) =>
    setEditingProduct({ ...editingProduct, title: text })
  }
/>

<TextInput
  style={styles.input}
  value={editingProduct.price || ""}
  placeholder="Price"
  onChangeText={(text) =>
    setEditingProduct({ ...editingProduct, price: text })
  }
/>

<TextInput
  style={styles.input}
  value={editingProduct.category || ""}
  placeholder="Category"
  onChangeText={(text) =>
    setEditingProduct({ ...editingProduct, category: text })
  }
/>

<TextInput
  style={styles.input}
  value={editingProduct.condition || ""}
  placeholder="Condition"
  onChangeText={(text) =>
    setEditingProduct({ ...editingProduct, condition: text })
  }
/>

<TextInput
  style={styles.input}
  value={editingProduct.description || ""}
  placeholder="Description"
  multiline
  onChangeText={(text) =>
    setEditingProduct({ ...editingProduct, description: text })
  }
/>
          <TouchableOpacity
  style={styles.messageButton}
  onPress={() => saveEditedProduct()}
>
  <Text style={styles.messageText}>Save Changes</Text>
</TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
if (showMessages) {
  return (
    <LinearGradient
      colors={["#1a0033", "#4a148c", "#7b2ff7", "#ff4ecd"]}
      style={styles.container}
    >
      <ScrollView>
        <TouchableOpacity onPress={() => setShowMessages(false)}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>💬 Messages</Text>

        {messages.length === 0 ? (
  <Text style={styles.detailText}>No messages yet.</Text>
) : (
  messages.map((msg, index) => (
    <View key={index} style={styles.card}>
      <Text style={styles.detailTitle}>
        👤 {msg.buyer || msg.sender || "Buyer"}
      </Text>

      <Text style={styles.detailText}>
        💬 {msg.text}
      </Text>

      <Text style={styles.meta}>
        📦 {msg.productTitle}
      </Text>

      <Text style={styles.meta}>
        🕒 {msg.createdAt
          ? new Date(msg.createdAt).toLocaleString()
          : "Just now"}
      </Text>

      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => setSelectedMessage(msg)}
      >
        <Text style={styles.messageText}>Reply</Text>
      </TouchableOpacity>
    </View>
  ))
)}

{selectedMessage && (
  <View style={styles.card}>
    <Text style={styles.detailTitle}>
      Reply to {selectedMessage.sender || "Buyer"}
    </Text>

    <TextInput
      style={styles.input}
      placeholder="Type your reply..."
      value={replyText}
      onChangeText={setReplyText}
    />

    <TouchableOpacity
      style={styles.messageButton}
      onPress={() => {
  if (!replyText.trim()) {
    notify("Type a reply.");
    return;
  }

  const replyMessage = {
    id: Date.now().toString(),
    productId: selectedMessage.productId,
    productTitle: selectedMessage.productTitle,
    seller: selectedMessage.seller,
    buyer: selectedMessage.buyer || "Buyer",
    sender: "Seller",
    text: replyText,
    createdAt: new Date().toISOString(),
  };

  setMessages([...messages, replyMessage]);
  setReplyText("");
  setSelectedMessage(null);
  notify("Reply sent!");
}}
    >
      <Text style={styles.messageText}>Send Reply</Text>
    </TouchableOpacity>
  </View>
)}
            
      </ScrollView>
    </LinearGradient>
  );
}
if (selectedSeller) {
  const sellerProducts = products.filter(
    (p) => p.seller === selectedSeller
  );
  return (
    <LinearGradient
      colors={["#1a0033", "#4a148c", "#7b2ff7", "#ff4ecd"]}
      style={styles.container}
    >
      <ScrollView>
        <TouchableOpacity onPress={() => setSelectedSeller(null)}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>👤 {selectedSeller}</Text>

          <Text style={styles.detailText}>
            ⭐ Rating: {getSellerRating(selectedSeller)}/5
          </Text>

          <Text style={styles.detailText}>
            📝 Reviews: {getSellerReviewCount(selectedSeller)}
          </Text>

          <Text style={styles.detailText}>
            📦 Listings: {sellerProducts.length}
          </Text>
        </View>
        <Text style={styles.sectionTitle}>Products by {selectedSeller}</Text>

        {sellerProducts.map((item) => (
       <TouchableOpacity
  key={item.id}
  onPress={() => {
    setSelectedSeller(null);
    setSelectedProduct(item);

    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    }
  }}
>
  <View style={styles.card}>
    {item.imageUri && (
      <Image source={{ uri: item.imageUri }} style={styles.gridImage} />
    )}

    <Text style={styles.detailTitle}>{item.title}</Text>
    <Text style={styles.productPrice}>€{item.price}</Text>
    <Text style={styles.detailText}>{item.category}</Text>
  </View>
</TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
if (selectedProduct) {
  return (
    <LinearGradient
      colors={["#1a0033", "#4a148c", "#7b2ff7", "#ff4ecd"]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => setSelectedProduct(null)}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
          <View style={styles.productDetailLayout}>
  {selectedProduct.imageUri && selectedProduct.imageUri.startsWith("http") ? (
  <Image
    source={{ uri: selectedProduct.imageUri }}
    style={styles.detailImageDesktop}
  />
) : (
  <View style={styles.placeholderDetailImage}>
    <Text style={styles.placeholderText}>CDW Marketshop</Text>
  </View>
)}

  <View style={styles.productDetailContent}>
    <View style={styles.detailCard}>
  <Text style={styles.detailTitle}>{selectedProduct.title}</Text>
<Text style={styles.productPrice}>€{selectedProduct.price}</Text>

<View style={styles.detailInfoBox}>
 <TouchableOpacity onPress={() => setSelectedSeller(selectedProduct.seller)}>
  <Text style={styles.detailText}>
    <Text style={styles.detailLabel}>Seller: </Text>
    👤 {selectedProduct.seller}
{VERIFIED_SELLERS.includes(selectedProduct.seller) ? " ✅ Verified" : ""}
  </Text>
</TouchableOpacity>

  <Text style={styles.detailText}>
    <Text style={styles.detailLabel}>Category: </Text>
    {selectedProduct.category}
  </Text>

  <Text style={styles.detailText}>
    <Text style={styles.detailLabel}>Condition: </Text>
    {selectedProduct.condition}
  </Text>

  <Text style={styles.detailText}>
    <Text style={styles.detailLabel}>Description: </Text>
    {selectedProduct.description || "No description provided"}
  </Text>

  <Text style={styles.detailText}>
    <Text style={styles.detailLabel}>Rating: </Text>
    ⭐ {getSellerRating(selectedProduct.seller)}/5
  </Text>
</View>

<View style={styles.sellerCard}>
  <Text style={styles.sectionTitle}>Seller Information</Text>

  <Text style={styles.detailText}>
    👤 {selectedProduct.seller}
  </Text>

  <Text style={styles.detailText}>
    ⭐ Rating: {getSellerRating(selectedProduct.seller)}/5
  </Text>

  <Text style={styles.detailText}>
    📝 Reviews: {getSellerReviewCount(selectedProduct.seller)}
  </Text>

  <Text style={styles.detailText}>
    📦 Listings: {getSellerListingsCount(selectedProduct.seller)}
  </Text>

  <TouchableOpacity
    style={styles.messageButton}
    onPress={() => contactSeller(selectedProduct)}
  >
   <Text style={styles.messageText}>💬 Contact Seller</Text>  
  </TouchableOpacity>
</View>
  <TouchableOpacity
    style={styles.favoriteButton}
    onPress={() => toggleFavorite(selectedProduct.id)}
  >
    <Text style={styles.favoriteText}>
      {favorites.includes(selectedProduct.id) ? "❤️ Favorited" : "🤍 Favorite"}
    </Text>
  </TouchableOpacity>

  <TextInput
    style={styles.input}
    placeholder="Write a review..."
    value={reviewText}
    onChangeText={setReviewText}
  />

 <TouchableOpacity
  style={styles.messageButton}
  onPress={() => submitReview(selectedProduct)}
>
  <Text style={styles.messageText}>Submit Review ⭐</Text>
</TouchableOpacity>

{reviews
  .filter((review) => review.productId === selectedProduct.id)
  .map((review) => (
    <View key={review.id} style={styles.card}>
      <Text style={styles.detailText}>⭐ {review.rating}/5</Text>
      <Text style={styles.detailText}>{review.text}</Text>
      <Text style={styles.detailText}>By: {review.reviewer || "Guest"}</Text>
    </View>
  ))}

  <TextInput
    style={styles.input}
    placeholder="Send a message to seller..."
    value={messageText}
    onChangeText={setMessageText}
  />
  <TouchableOpacity
    style={styles.messageButton}
    onPress={() => sendMessage(selectedProduct)}
  >
    <Text style={styles.messageText}>Send Message</Text>
  </TouchableOpacity>

  {selectedProduct.sold ? (
    <Text style={styles.sold}>SOLD</Text>
  ) : (
    <>
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => addToCart(selectedProduct)}
      >
        <Text style={styles.cartText}>🛒 Add to Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => contactSeller(selectedProduct)}
      >
      <TouchableOpacity
  style={styles.messageButton}
  onPress={pickImage}
>
  <Text style={styles.messageText}>📷 Change Image</Text>
</TouchableOpacity> 
      </TouchableOpacity>

      <TouchableOpacity onPress={() => buyProduct(selectedProduct)}>
        <LinearGradient colors={["#7b2ff7", "#f107a3"]} style={styles.button}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  )}
<TouchableOpacity
  style={styles.messageButton}
  onPress={() => setEditingProduct(selectedProduct)}
>
  <Text style={styles.messageText}>✏️ Edit Product</Text>
</TouchableOpacity>

{selectedProduct.ownerEmail === currentUserEmail && (
  <TouchableOpacity
    style={styles.deleteButton}
    onPress={() => deleteProduct(selectedProduct.id)}
  >
    <Text style={styles.deleteButtonText}>Delete 🗑️</Text>
  </TouchableOpacity>
)}
 
</View>   {/* closes detailCard */}
</View>   {/* closes productDetailContent */}
</View>   {/* closes productDetailLayout */}

</ScrollView>
</LinearGradient>
);
}


function getSellerRating(sellerName) {
  const sellerReviews = reviews.filter(
    (review) => review.productTitle && products.find(
      (p) => p.title === review.productTitle && p.seller === sellerName
    )
  );

  if (sellerReviews.length === 0) {
    return "5.0";
  }
  const average =
    sellerReviews.reduce((sum, review) => sum + (review.rating || 5), 0) /
    sellerReviews.length;

  return average.toFixed(1);
}

  const totalListings = products.length;
const totalOrders = orders.length;
const totalMessages = messages.length;
const totalReviews = reviews.length;

const averageRating =
  reviews.length > 0
    ? (
        reviews.reduce((sum, review) => sum + (review.rating || 5), 0) /
        reviews.length
      ).toFixed(1)
    : "5.0";
function getSellerReviewCount(sellerName) {
  return reviews.filter((review) =>
    products.find(
      (p) => p.title === review.productTitle && p.seller === sellerName
    )
  ).length;
}

function getSellerListingsCount(sellerName) {
  return products.filter((p) => p.seller === sellerName).length;
}
return (
    <LinearGradient colors={["#ffdde1", "#ee9ca7", "#a18cd1", "#fbc2eb"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoWrap}>
  <Image
    source={require("./assets/CDW Marketshop.png")}
    style={styles.logoImage}
    resizeMode="contain"
  />
</View>
<TouchableOpacity onPress={handleSignOut}>
  <LinearGradient
    colors={["#ff6b6b", "#ff4757"]}
    style={styles.button}
  >
    <Text style={styles.buttonText}>Sign Out</Text>
  </LinearGradient>
</TouchableOpacity>
        <View style={styles.card}>
          <TextInput placeholder="Email" style={styles.input} value={email} autoCapitalize="none" keyboardType="email-address" onChangeText={setEmail} />
          <TextInput placeholder="Password" secureTextEntry={!showPassword} style={styles.input} value={password} onChangeText={setPassword} />
<View style={styles.card}>
  <Text style={styles.sectionTitle}>📊 Dashboard</Text>

  <Text style={styles.detailText}>
    Listings: {totalListings}
  </Text>

  <Text style={styles.detailText}>
    Orders: {totalOrders}
  </Text>

  <Text style={styles.detailText}>
    Messages: {totalMessages}
  </Text>

  <Text style={styles.detailText}>
    Reviews: {totalReviews}
  </Text>

  <Text style={styles.detailText}>
    Average Rating: ⭐ {averageRating}/5
  </Text>
</View>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.linkText}>{showPassword ? "Hide password" : "Show password"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignIn}>
            <LinearGradient colors={["#5f2cff", "#8a4dff"]} style={styles.button}>
              <Text style={styles.buttonText}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignUp}>
            <LinearGradient colors={["#7b2ff7", "#f107a3"]} style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Post Product</Text>
          <TextInput placeholder="Product title" style={styles.input} value={title} onChangeText={setTitle} />
          <TextInput placeholder="Price (€)" style={styles.input} value={price} onChangeText={setPrice} />
          <TextInput placeholder="Seller name" style={styles.input} value={seller} onChangeText={setSeller} />
          <TextInput placeholder="Category" style={styles.input} value={category} onChangeText={setCategory} />
          <TextInput placeholder="Condition e.g. Used - Good" style={styles.input} value={condition} onChangeText={setCondition} />

          <TouchableOpacity onPress={pickImage}>
            <LinearGradient colors={["#ff8a00", "#ff3d8b"]} style={styles.button}>
              <Text style={styles.buttonText}>Choose Product Photo</Text>
            </LinearGradient>
          </TouchableOpacity>

          {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

          <TouchableOpacity onPress={addProduct}>
            <LinearGradient colors={["#7b2ff7", "#f107a3"]} style={styles.button}>
              <Text style={styles.buttonText}>Publish Product</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.searchRow}>
          <TextInput placeholder="Search products..." value={search} onChangeText={setSearch} style={styles.searchInput} />
          <TouchableOpacity onPress={() => setSearch(search.trim())}>
            <LinearGradient colors={["#7b2ff7", "#f107a3"]} style={styles.searchButton}>
              <Text style={styles.buttonText}>Search</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

       
       <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={{ marginBottom: 15, maxHeight: 50 }}
>
  {categories.map((cat) => (
    <TouchableOpacity
      key={cat}
    onPress={() => {
  if (cat.includes("Messages")) {
    setShowMessages(true);
  } else {
    setShowMessages(false);
    setActiveCategory(cat);
  }
}}
      style={[
        styles.categoryPill,
        activeCategory === cat && styles.categoryActive,
      ]}
    >
      <Text
        style={[
          styles.categoryText,
          activeCategory === cat && styles.categoryTextActive,
        ]}
      >
        {cat}
      </Text>
    </TouchableOpacity>
  ))}
<View style={styles.footer}>
  <Text style={styles.footerLink}>About Us</Text>
  <Text style={styles.footerLink}>Contact Us</Text>
  <Text style={styles.footerLink}>Privacy Policy</Text>
  <Text style={styles.footerLink}>Terms of Service</Text>
</View>
</ScrollView>
{activeCategory === "Cart" && (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>Shopping Cart</Text>
    <Text style={styles.cartTotal}>
      Total: €{cart.reduce((sum, item) => sum + Number(item.price || 0), 0)}
    </Text>

    <TouchableOpacity onPress={checkout}>
      <LinearGradient colors={["#7b2ff7", "#f107a3"]} style={styles.button}>
        <Text style={styles.buttonText}>Checkout</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
)}
{cart.map((item) => (
  <View key={item.id} style={styles.card}>
    <Text>{item.title}</Text>
    <Text>€{item.price}</Text>

    <TouchableOpacity
      style={styles.deleteButtonSmall}
      onPress={() => removeFromCart(item.id)}
    >
      <Text style={styles.deleteButtonText}>
        Remove
      </Text>
    </TouchableOpacity>
  </View>
))}
{activeCategory.startsWith("Reviews") && (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>Reviews</Text>

    {reviews.length === 0 ? (
      <Text style={styles.detailText}>No reviews yet.</Text>
    ) : (
      reviews.map((review) => (
        <View key={review.id} style={styles.card}>
          <Text style={styles.detailText}>Product: {review.productTitle}</Text>
          <Text style={styles.detailText}>⭐ {review.rating}/5</Text>
          <Text style={styles.detailText}>{review.text}</Text>
          <Text style={styles.detailText}>By: {review.reviewer || "Guest"}</Text>
        </View>
      ))
    )}
  </View>
)}
{activeCategory.startsWith("Orders") && (

  <View style={styles.card}>
    <Text style={styles.sectionTitle}>Purchase History</Text>

    {orders.length === 0 ? (
      <Text style={styles.detailText}>No orders yet.</Text>
    ) : (
      orders.map((order) => (
        <View key={order.id} style={styles.card}>
          <Text style={styles.detailTitle}>{order.title}</Text>
          
          <Text style={styles.detailText}>
            Seller: {order.seller}
          </Text>
        </View>
      ))
    )}
  </View>
)}
{activeCategory.startsWith("Messages") && (
  <View style={styles.detailCard}>
    <Text style={styles.sectionTitle}>Messages</Text>

    messages.map((msg, index) => (
  <View key={index} style={styles.card}>
    <Text style={styles.detailTitle}>
      {msg.sender || "Buyer"}
    </Text>

    <Text style={styles.detailText}>
      {msg.text}
    </Text>

    <Text style={styles.meta}>
      Product: {msg.productTitle}
    </Text>
  </View>
))
        <View key={msg.id} style={styles.card}>
          <Text style={styles.detailText}>Product: {msg.productTitle}</Text>
          <Text style={styles.detailText}>From: {msg.buyer || "Guest"}</Text>
          <Text style={styles.detailText}>{msg.text}</Text>
        </View>
      ))
    )}
  </View>
)}
<FlatList
  data={filteredProducts}
  keyExtractor={(item) => item.id}
  scrollEnabled={false}
  numColumns={2}
  columnWrapperStyle={{ gap: 12 }}
  renderItem={({ item }) => (
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
        <Text style={styles.placeholderText}>CDW Marketshop</Text>
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
        <Text style={styles.priceBadgeText}>€{item.price}</Text>
      </View>

      <View style={styles.newBadge}>
        <Text style={styles.newBadgeText}>🆕 New</Text>
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
      <Text style={styles.cartText}>🛒 Add to Cart</Text>
    </TouchableOpacity>

    {item.sold && (
      <Text style={styles.sold}>SOLD</Text>
    )}

    <TouchableOpacity
      style={styles.deleteButtonSmall}
      onPress={() => deleteProduct(item.id)}
    >
      <Text style={styles.deleteButtonText}>Delete 🗑️</Text>
    </TouchableOpacity>
  </TouchableOpacity>
)}
              
 />
 
    
<View style={styles.footer}>
  <TouchableOpacity>
    <Text style={styles.footerLink}>About Us</Text>
  </TouchableOpacity>
{editingProduct?.imageUri ? (
  <Image
    source={{ uri: editingProduct.imageUri }}
    style={styles.detailImageDesktop}
  />
) : (
  <View style={styles.placeholderDetailImage}>
    <Text style={styles.placeholderText}>CDW Marketshop</Text>
  </View>
)}
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

     
      </ScrollView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },

 

  logoWrap: {
  width: "100%",
  marginHorizontal: -20,
  marginTop: -60,
  marginBottom: 20,
},

logoImage: {
  width: "100%",
  height: 500,
  resizeMode: "cover",
},
  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4527a0",
    marginBottom: 12,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  linkText: {
    color: "#4527a0",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "right",
  },

  forgotText: {
    color: "#7b2ff7",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 14,
  },

  searchRow: { flexDirection: "row", gap: 10, marginBottom: 12 },

  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
  },

  searchButton: { padding: 14, borderRadius: 14 },

  categoryPill: {
  backgroundColor: "white",
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 14,
  marginRight: 6,
  alignSelf: "flex-start",
},

  categoryActive: { backgroundColor: "#7b2ff7" },
  categoryText: { color: "#4527a0", fontWeight: "bold", fontSize: 12 },
  categoryTextActive: { color: "#fff" },

  button: { padding: 16, borderRadius: 16, marginTop: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },

  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 18,
    marginTop: 12,
  },

  gridCard: {
  flex: 1,
  backgroundColor: "rgba(255,255,255,0.96)",
  borderRadius: 22,
  padding: 12,
  marginBottom: 14,
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 5 },
  elevation: 4,
},
placeholderImage: {
  width: "100%",
  height: 150,
  borderRadius: 18,
  marginBottom: 10,
  backgroundColor: "#1a0033",
  alignItems: "center",
  justifyContent: "center",
},
placeholderDetailImage: {
  width: "100%",
  height: 300,
  borderRadius: 24,
  marginBottom: 20,
  backgroundColor: "#1a0033",
  alignItems: "center",
  justifyContent: "center",
},
placeholderText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
},
  gridImage: {
  width: "100%",
  height: 150,
  borderRadius: 18,
  marginBottom: 10,
  resizeMode: "contain",
  backgroundColor: "#1a0033",
},
productDetailLayout: {
  width: "100%",
  maxWidth: 1100,
  alignSelf: "center",
},

productDetailContent: {
  width: "100%",
},
  productTitle: { fontSize: 15, fontWeight: "bold" },

  productPrice: {
    color: "#7b2ff7",
    fontSize: 15,
    marginTop: 4,
    fontWeight: "bold",
  },

  meta: { color: "#555", marginTop: 4 },

  sold: {
    color: "red",
    fontWeight: "bold",
    marginTop: 8,
  },

  detailImage: {
    width: "100%",
    height: 420,
    borderRadius: 24,
    marginBottom: 20,
    resizeMode: "contain",
    backgroundColor: "#fff",
  },

  detailTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4527a0",
  },

  detailText: {
    marginTop: 10,
    color: "#444",
  },

  back: {
  fontSize: 20,
  marginBottom: 20,
  color: "#ffffff",
  fontWeight: "bold",
  backgroundColor: "rgba(255,255,255,0.15)",
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 12,
  alignSelf: "flex-start",
},

  deleteButton: {
    marginTop: 14,
    backgroundColor: "#ff5252",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },

  deleteButtonSmall: {
    marginTop: 10,
    backgroundColor: "#ff5252",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
newBadge: {
  backgroundColor: "#ff4081",
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 12,
  alignSelf: "flex-start",
  marginBottom: 8,
},

newBadgeText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 12,
},
  favoriteButton: {
    marginTop: 8,
    backgroundColor: "#fff0f6",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },

  favoriteText: {
    color: "#d81b60",
    fontWeight: "bold",
  },
cartButton: {
  marginTop: 8,
  backgroundColor: "#ede7ff",
  paddingVertical: 8,
  borderRadius: 12,
  alignItems: "center",
},

cartText: {
  color: "#4527a0",
  fontWeight: "bold",
},

cartTotal: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#4527a0",
  marginBottom: 10,
},

messageButton: {
  marginTop: 10,
  backgroundColor: "#4caf50",
  paddingVertical: 10,
  borderRadius: 12,
  alignItems: "center",
},

messageText: {
  color: "#fff",
  fontWeight: "bold",
},
footer: {
  marginTop: 30,
  paddingVertical: 20,
  alignItems: "center",
},

footerLink: {
  fontSize: 14,
  color: "#666",
  marginVertical: 4,
},
detailCard: {
  backgroundColor: "rgba(255,255,255,0.95)",
  borderRadius: 24,
  padding: 24,
  marginBottom: 20,
  maxWidth: 900,
  alignSelf: "center",
  width: "100%",
},
detailInfoBox: {
  backgroundColor: "#f8f5ff",
  borderRadius: 18,
  padding: 16,
  marginTop: 14,
},
detailLabel: {
  fontWeight: "bold",
  color: "#4527a0",
},
priceBadge: {
  backgroundColor: "#7b2ff7",
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 12,
  alignSelf: "flex-start",
  marginTop: 6,
},
priceBadgeText: {
  color: "#fff",
  fontWeight: "bold",
},
detailImageDesktop: {
  width: "100%",
  height: 300,
  borderRadius: 24,
  marginBottom: 20,
  resizeMode: "contain",
  backgroundColor: "#fff",
},
sellerCard: {
  backgroundColor: "#fff",
  borderRadius: 18,
  padding: 18,
  marginTop: 16,
  marginBottom: 16,
},
});
