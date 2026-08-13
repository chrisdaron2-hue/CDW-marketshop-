import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "./src/components/Footer";
import ProductCard from "./src/components/ProductCard";
import CartScreen from "./src/screens/CartScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ReviewsScreen from "./src/screens/ReviewsScreen";
import { VERIFIED_SELLERS } from "./src/constants/verifiedSellers";
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
  useWindowDimensions,
} from "react-native";
import {
  ORDERS_API_URL,
  PRODUCTS_API_URL,
  IMAGE_UPLOAD_API_URL,
  REVIEWS_API_URL,
  MESSAGES_API_URL,
} from "./src/constants/api";
import {
  loadProducts,
  saveProduct,
  hydrateProductImages,
} from "./src/services/productService";
import {
  fetchReviews,
  createReview,
} from "./src/services/reviewService";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Amplify } from "aws-amplify";
import { signIn, signUp, resetPassword, signOut } from "aws-amplify/auth";
import awsConfig from "./src/aws-exports";
Amplify.configure(awsConfig);
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
function notify(message) {
  if (typeof window !== "undefined") {
    window.alert(message);
  } else {
    Alert.alert(message);
  }
}
export default function App() {
  const { width } = useWindowDimensions();

const isPhone = width < 600;
const productColumns = 2;
const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
const [profileName, setProfileName] = useState("Elizabeth Gyamfi");
const [profileBio, setProfileBio] = useState("Cloud Engineer | AWS | React Native");
const [profileLocation, setProfileLocation] = useState("Germany");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [seller, setSeller] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [imageUri, setImageUri] = useState(null);
const [imageUri2, setImageUri2] = useState(null);
const [imageUri3, setImageUri3] = useState(null);
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
  const [storageReady, setStorageReady] = useState(false);
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
  "Profile",
  "My Listings",
  `Messages (${messageCount})`,
  `Reviews (${reviewCount})`,
  `Orders (${orderCount})`,
];
useEffect(() => {
  async function initializeApp() {
  const loadedProducts = await loadProducts();

  const uniqueProducts = Array.from(
    new Map(
      [...sampleProducts, ...loadedProducts].map((product) => [
        String(product.id),
        product,
      ])
    ).values()
  );

  setProducts(uniqueProducts);

  const loadedReviews = await fetchReviews();
  setReviews(loadedReviews);

  loadMessages();
  loadOrders();
}

  initializeApp();
}, []);

useEffect(() => {
  async function loadStoredData() {
    try {
      await Promise.all([
        AsyncStorage.removeItem("email"),
        AsyncStorage.removeItem("password"),
      ]);

      setEmail("");
      setPassword("");

      const [savedFavorites, savedCart] = await Promise.all([
        AsyncStorage.getItem("favorites"),
        AsyncStorage.getItem("cart"),
      ]);

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load saved app data:", error);
    } finally {
      setStorageReady(true);
    }
  }

  loadStoredData();
}, []);

useEffect(() => {
  if (!storageReady) return;

  AsyncStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  ).catch((error) => {
    console.error("Failed to save favorites:", error);
  });
}, [favorites, storageReady]);

useEffect(() => {
  if (!storageReady) return;

  AsyncStorage.setItem(
    "cart",
    JSON.stringify(cart)
  ).catch((error) => {
    console.error("Failed to save cart:", error);
  });
}, [cart, storageReady]);

  
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

async function pickImage2() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.7,
  });

  if (!result.canceled) {
    setImageUri2(result.assets[0].uri);
  }
}

async function pickImage3() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.7,
  });

  if (!result.canceled) {
    setImageUri3(result.assets[0].uri);
  }
}
   
async function uploadImageToS3(localImageUri) {
  if (!localImageUri) {
    return null;
  }

  // Convert the selected local image into a Blob.
  const imageResponse = await fetch(localImageUri);

  if (!imageResponse.ok) {
    throw new Error("Could not read the selected image.");
  }

  const imageBlob = await imageResponse.blob();
  const lowerCaseUri = localImageUri.toLowerCase().split("?")[0];

  let contentType = imageBlob.type;

  if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) {
    if (lowerCaseUri.endsWith(".png")) {
      contentType = "image/png";
    } else if (lowerCaseUri.endsWith(".webp")) {
      contentType = "image/webp";
    } else {
      contentType = "image/jpeg";
    }
  }

  // Request a temporary upload URL from API Gateway and Lambda.
  const urlResponse = await fetch(IMAGE_UPLOAD_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contentType,
    }),
  });

  const responseText = await urlResponse.text();

  let uploadData;

  try {
    uploadData = JSON.parse(responseText);
  } catch {
    console.log("UPLOAD URL RESPONSE:", responseText);
    throw new Error("The upload service returned an invalid response.");
  }

  if (
    !urlResponse.ok ||
    !uploadData.uploadUrl ||
    !uploadData.objectKey
  ) {
    throw new Error(
      uploadData.message ||
        uploadData.error ||
        "Could not create the upload URL."
    );
  }

  // Upload the image directly to the private S3 bucket.
  const s3Response = await fetch(uploadData.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: imageBlob,
  });

  if (!s3Response.ok) {
    const errorText = await s3Response.text();
    console.log("S3 UPLOAD ERROR:", errorText);

    throw new Error("The image could not be uploaded to S3.");
  }

  console.log("IMAGE UPLOADED:", uploadData.objectKey);

  // Store the S3 object key rather than the temporary upload URL.
  return uploadData.objectKey;
}
  async function addProduct() {
  if (!title || !price || !seller || !category || !condition) {
    notify("Fill all product fields.");
    return;
  }

let uploadedImageUrl = null;
let uploadedImageUrl2 = null;
let uploadedImageUrl3 = null;
 console.log("IMAGE URI 1:", imageUri);
console.log("IMAGE URI 2:", imageUri2);
console.log("IMAGE URI 3:", imageUri3); 
try {
  if (imageUri) {
    uploadedImageUrl = await uploadImageToS3(imageUri);
  }

  if (imageUri2) {
    uploadedImageUrl2 = await uploadImageToS3(imageUri2);
  }

  if (imageUri3) {
    uploadedImageUrl3 = await uploadImageToS3(imageUri3);
  }
} catch (error) {
  console.log("IMAGE UPLOAD ERROR:", error);
  notify("Image upload failed.");
  return;
}
  
const productImages = [
    uploadedImageUrl,
    uploadedImageUrl2,
    uploadedImageUrl3,
  ].filter(Boolean);
      

  
console.log("PRODUCT IMAGES:", productImages);
  const newProduct = {
  id: Date.now().toString(),
  title,
  price,
  seller,
  category,
  condition,
  imageUri: productImages[0] || null,
  images: productImages,
  sold: false,
  rating: 5,
  ownerEmail: currentUserEmail,
};

try {
  const productSaved = await saveProduct(newProduct);

  if (!productSaved) {
    throw new Error("The product could not be saved.");
  }

  const productWithViewUrls =
    await hydrateProductImages(newProduct);

  setProducts((currentProducts) => [
    productWithViewUrls,
    ...currentProducts,
  ]);

  setTitle("");
  setPrice("");
  setSeller("");
  setCategory("");
  setCondition("");
  setImageUri(null);
  setImageUri2(null);
  setImageUri3(null);

    notify("Product posted.");
  } catch (error) {
  console.log("SAVE PRODUCT ERROR:", error);
  console.log("PRODUCT:", newProduct);
  notify("Could not save product.");
}

  }

async function deleteProduct(productId) {
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
  setFavorites((prevFavorites) => {
    const updatedFavorites = prevFavorites.includes(productId)
      ? prevFavorites.filter((id) => id !== productId)
      : [...prevFavorites, productId];


    return updatedFavorites;
  });
}
function addToCart(product) {
  setCart((prevCart) => {
    const existingItem = prevCart.find(
      (item) => String(item.id) === String(product.id)
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = prevCart.map((item) =>
        String(item.id) === String(product.id)
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );

      notify("Quantity updated.");
    } else {
      updatedCart = [
        ...prevCart,
        {
          ...product,
          quantity: 1,
        },
      ];

      notify("Added to cart.");
    }


    return updatedCart;
  });
}
function removeFromCart(productId) {
  const updatedCart = cart.filter(
    (item) => String(item.id) !== String(productId)
  );

  setCart(updatedCart);


  notify("Removed from cart.");
}



function increaseQuantity(productId) {
  setCart((prevCart) => {
    const updatedCart = prevCart.map((item) =>
      String(item.id) === String(productId)
        ? {
            ...item,
            quantity: Number(item.quantity || 1) + 1,
          }
        : item
    );


    return updatedCart;
  });
}

function decreaseQuantity(productId) {
  setCart((prevCart) => {
    const updatedCart = prevCart.map((item) =>
      String(item.id) === String(productId)
        ? {
            ...item,
            quantity: Math.max(
              1,
              Number(item.quantity || 1) - 1
            ),
          }
        : item
    );


    return updatedCart;
  });
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

  const success = await createReview(newReview);

  if (success) {
    setReviews((prev) => [...prev, newReview]);
    setReviewText("");
    notify("Review added.");
  } else {
    notify("Failed to save review.");
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
  try {
    await signOut();

    setCurrentUserEmail("");
    setEmail("");
    setPassword("");
    setSelectedProduct(null);
    setSelectedSeller(null);
    setShowMessages(false);
    setActiveCategory("All");

    notify("Signed out.");
  } catch (error) {
    console.log("SIGN OUT ERROR:", error);
    notify(error.message || "Sign out failed.");
  }
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

{Boolean(selectedMessage) && (
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
    {Boolean(item.imageUri) && (
      <Image
  source={{ uri: item.imageUri }}
  style={styles.gridImage}
  resizeMode="cover"
/>
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
    colors={["#ffdde1", "#ee9ca7", "#a18cd1", "#fbc2eb"]}
    style={styles.screen}
  >
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      
       
<TouchableOpacity onPress={() => setSelectedProduct(null)}>
  <Text style={styles.back}>← Back</Text>
</TouchableOpacity>

<View style={styles.productDetailLayout}>
  {selectedProduct.imageUri &&
  selectedProduct.imageUri.startsWith("http") ? (
    <View>
      <Image
        source={{
          uri:
            selectedProduct.images?.[selectedImageIndex] ||
            selectedProduct.imageUri,
        }}
        style={styles.detailImageDesktop}
        resizeMode="contain"
      />

      {selectedProduct.images?.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10, marginBottom: 20 }}
        >
          {selectedProduct.images.map((img, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => setSelectedImageIndex(index)}
            >
              <Image
                source={{ uri: img }}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 12,
                  marginRight: 10,
                  borderWidth: 2,
                  borderColor: "#fff",
                }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
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
        <TouchableOpacity
          onPress={() => setSelectedSeller(selectedProduct.seller)}
        >
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Seller: </Text>
            👤 {selectedProduct.seller}
            {VERIFIED_SELLERS.includes(selectedProduct.seller)
              ? " ✅ Verified"
              : ""}
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

        <TouchableOpacity
          style={styles.messageButton}
          onPress={pickImage}
        >
          <Text style={styles.messageText}>📷 Change Image</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(selectedProduct.id)}
      >
        <Text style={styles.favoriteText}>
          {favorites.includes(selectedProduct.id)
            ? "❤️ Favorited"
            : "🤍 Favorite"}
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
        .filter(
          (review) => review.productId === selectedProduct.id
        )
        .map((review) => (
          <View key={review.id} style={styles.card}>
            <Text style={styles.detailText}>
              ⭐ {review.rating}/5
            </Text>
            <Text style={styles.detailText}>{review.text}</Text>
            <Text style={styles.detailText}>
              By: {review.reviewer || "Guest"}
            </Text>
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
            onPress={() => buyProduct(selectedProduct)}
          >
            <LinearGradient
              colors={["#7b2ff7", "#f107a3"]}
              style={styles.button}
            >
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
          <Text style={styles.deleteButtonText}>
            Delete 🗑️
          </Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
</View>

</ScrollView>
</LinearGradient>
);
}




function getSellerRating(sellerName) {
const sellerReviews = reviews.filter(
(review) =>
review.productTitle &&
products.find(
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

const sellerProducts = products.filter(
(product) => product.ownerEmail === currentUserEmail
);

const sellerOrders = orders.filter((order) =>
sellerProducts.some((product) => product.id === order.productId)
);

const sellerMessages = messages.filter((msg) =>
sellerProducts.some((product) => product.id === msg.productId)
);

const sellerRevenue = sellerOrders.reduce(
(sum, order) => sum + Number(order.price || 0),
0
);

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
    <LinearGradient
      colors={["#ffdde1", "#ee9ca7", "#a18cd1", "#fbc2eb"]}
      style={styles.screen}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
  
    key={`product-grid-${productColumns}`}
    data={Array.from(
      new Map(
        filteredProducts.map((item) => [String(item.id), item])
      ).values()
    )}
    keyExtractor={(item) => String(item.id)}
    scrollEnabled={false}
    numColumns={productColumns}
    columnWrapperStyle={
      productColumns > 1
        ? { gap: 12 }
        : undefined
    }
    contentContainerStyle={styles.productGrid}
    extraData={favorites}
    renderItem={({ item }) => (
      <ProductCard
        item={item}
        styles={styles}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        addToCart={addToCart}
        deleteProduct={deleteProduct}
        currentUserEmail={currentUserEmail}
        setSelectedProduct={setSelectedProduct}
      />
    )}
  />

  <Footer styles={styles} />

     </ScrollView>
        </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
  },

  scrollView: {
    flex: 1,
    width: "100%",
  },

  container: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
    paddingTop: 32,
    paddingHorizontal: 12,
    paddingBottom: 100,
  },

  logoWrap: {
    width: "100%",
    marginHorizontal: -12,
    marginTop: -32,
    marginBottom: 16,
    alignSelf: "center",
  },

  logoImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 16 / 7,
    resizeMode: "cover",
  },

  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4527a0",
    marginBottom: 12,
  },

  input: {
    width: "100%",
    minHeight: 48,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
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

  searchRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },

  searchInput: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 220,
    minWidth: 0,
    minHeight: 48,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },

  searchButton: {
    minWidth: 48,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryPill: {
    minHeight: 40,
    backgroundColor: "#fff",
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 14,
    marginRight: 6,
    alignSelf: "flex-start",
    justifyContent: "center",
  },

  categoryActive: {
    backgroundColor: "#7b2ff7",
  },

  categoryText: {
    color: "#4527a0",
    fontWeight: "bold",
    fontSize: 12,
  },

  categoryTextActive: {
    color: "#fff",
  },

  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  previewImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 4 / 3,
    borderRadius: 18,
    marginTop: 12,
    resizeMode: "cover",
    backgroundColor: "#fff",
  },

  productGrid: {
    width: "100%",
    paddingBottom: 8,
  },

  gridCard: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 20,
    padding: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 4,
  },

  placeholderImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 4 / 3,
    borderRadius: 18,
    marginBottom: 10,
    backgroundColor: "#1a0033",
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderDetailImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 4 / 3,
    maxHeight: 520,
    borderRadius: 20,
    marginBottom: 16,
    backgroundColor: "#1a0033",
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 10,
  },

  gridImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 4 / 3,
    borderRadius: 18,
    marginBottom: 10,
    resizeMode: "cover",
    backgroundColor: "#fff",
  },

  productDetailLayout: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
  },

  productDetailContent: {
    width: "100%",
  },

  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
  },

  productPrice: {
    color: "#7b2ff7",
    fontSize: 16,
    marginTop: 4,
    fontWeight: "bold",
  },

  meta: {
    color: "#555",
    marginTop: 4,
    flexShrink: 1,
  },

  sold: {
    color: "red",
    fontWeight: "bold",
    marginTop: 8,
  },

  detailImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 4 / 3,
    maxHeight: 520,
    borderRadius: 20,
    marginBottom: 16,
    resizeMode: "contain",
    backgroundColor: "#fff",
  },

  detailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4527a0",
    flexShrink: 1,
  },

  detailText: {
    marginTop: 10,
    color: "#444",
    lineHeight: 21,
  },

  back: {
    minHeight: 44,
    fontSize: 18,
    marginBottom: 16,
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  deleteButton: {
    minHeight: 48,
    marginTop: 14,
    backgroundColor: "#ff5252",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButtonSmall: {
    minHeight: 44,
    marginTop: 10,
    backgroundColor: "#ff5252",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
    minHeight: 44,
    marginTop: 8,
    backgroundColor: "#fff0f6",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteText: {
    color: "#d81b60",
    fontWeight: "bold",
    textAlign: "center",
  },

  cartButton: {
    minHeight: 44,
    marginTop: 8,
    backgroundColor: "#ede7ff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  cartText: {
    color: "#4527a0",
    fontWeight: "bold",
    textAlign: "center",
  },

  cartTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4527a0",
    marginBottom: 10,
  },

  messageButton: {
    minHeight: 44,
    marginTop: 10,
    backgroundColor: "#4caf50",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  messageText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  footer: {
    width: "100%",
    marginTop: 30,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  footerLink: {
    fontSize: 14,
    color: "#666",
    marginVertical: 6,
    textAlign: "center",
  },

  detailCard: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },

  detailInfoBox: {
    width: "100%",
    backgroundColor: "#f8f5ff",
    borderRadius: 18,
    padding: 14,
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
    height: undefined,
    aspectRatio: 4 / 3,
    maxHeight: 500,
    borderRadius: 20,
    marginBottom: 16,
    resizeMode: "contain",
    backgroundColor: "#fff",
  },

  sellerCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },

  welcomeCard: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    alignItems: "center",
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a148c",
    textAlign: "center",
  },

  welcomeText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },

  welcomeButtons: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },

  dashboardGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 10,
  },

  dashboardBox: {
    flexGrow: 1,
    flexBasis: 150,
    minWidth: 0,
    backgroundColor: "#f8f5ff",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },

  dashboardNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a148c",
  },

  dashboardLabel: {
    marginTop: 6,
    fontSize: 14,
    color: "#555",
    fontWeight: "bold",
    textAlign: "center",
  },

  heroButton: {
    flexGrow: 1,
    flexBasis: 140,
    minHeight: 48,
    backgroundColor: "#7b2ff7",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  heroButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  infoRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 24,
  },

  infoCard: {
    flexGrow: 1,
    flexBasis: 260,
    minWidth: 0,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 16,
  },
});
