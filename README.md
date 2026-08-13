<p align="center">
  <img
    src="https://github.com/user-attachments/assets/c4ef30a2-99f9-4d9b-8da3-3c4f6777fda6"
    alt="CDW MarketShop"
    width="100%"
  />
</p>

# 🛒 CDW MarketShop

![Marketplace](https://img.shields.io/badge/Project-CDW_MarketShop-purple)
![Cloud Engineer](https://img.shields.io/badge/Role-Cloud_Engineer-blueviolet)
![React Native](https://img.shields.io/badge/React_Native-Expo-blue)
![AWS](https://img.shields.io/badge/AWS-Serverless-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

A modern cloud-native marketplace application built with **React Native (Expo)** and **AWS Serverless Services**.

CDW MarketShop enables users to buy and sell products through a secure marketplace with authentication, product listings, multi-image galleries, messaging, reviews, shopping carts, seller profiles, and a seller dashboard.

This project demonstrates practical skills in **Cloud Engineering**, **Serverless Architecture**, **Frontend Development**, and **Application Deployment**.

---

## 🌐 Live Demo

🚀 [View CDW MarketShop Live](https://cdw-marketshop.vercel.app)

---

## 🎥 Demo Video

[▶ Watch the CDW MarketShop Demo](https://github.com/chrisdaron2-hue/CDW-marketshop-/releases/download/v1.0/CDW.MarketShop.Demo.mov)

---

## ✨ Features

### 🔐 Authentication

- User registration and login
- Secure authentication with AWS Cognito
- Account management
- Signed-in and signed-out interface states

### 🛒 Marketplace

- Product listings
- Product search
- Category browsing
- Shopping cart
- Favorites / Wishlist
- Multi-image product gallery
- Product detail views

### 🏪 Seller Features

- Seller profiles
- Seller ratings
- Product management
- Edit and manage listings
- Sell-an-item form
- Seller dashboard
- Revenue overview
- Recent orders
- Seller activity summary

### 👤 Buyer Features

- Product reviews
- Orders and purchase history
- Messaging system
- Product gallery navigation
- Favorites and cart management

### 💬 Messaging

- Buyer and seller conversations
- Product-based messaging threads
- Reply functionality

### 📊 Seller Dashboard

- Active listings count
- Orders count
- Messages count
- Reviews count
- Revenue overview
- Recent orders
- Seller account summary

---

## ☁️ Cloud Services

- **AWS Cognito** – Authentication and user management
- **AWS Lambda** – Serverless backend APIs
- **Amazon API Gateway** – API routing
- **Amazon DynamoDB** – Marketplace data storage
- **Amazon S3** – Product image storage
- **Vercel** – Frontend deployment and hosting

---

## 🏗️ Architecture

```text
                    ┌─────────────────┐
                    │      Users      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ React Native    │
                    │ Expo Web App    │
                    └────────┬────────┘
                             │
                    Hosted on Vercel
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
   │ AWS Cognito  │   │ API Gateway  │   │  Amazon S3   │
   │Authentication│   │              │   │Product Images│
   └──────────────┘   └──────┬───────┘   └──────────────┘
                             │
                             ▼
                        AWS Lambda
                             │
                             ▼
                      Amazon DynamoDB
                   Products / Orders /
                  Reviews / Messages
```

---

## 🚀 Key Highlights

- Designed and developed a cloud-native marketplace application
- Implemented secure authentication using Amazon Cognito
- Built a serverless backend with AWS Lambda and DynamoDB
- Integrated Amazon S3 for product image uploads
- Developed buyer-seller messaging functionality
- Implemented reviews, favorites, cart, orders, and seller management
- Built a Seller Dashboard with revenue and Recent Orders
- Added smooth navigation between shopping and selling sections
- Deployed the production web application using Vercel

---

## 🛠️ Tech Stack

### Frontend

- React Native
- Expo
- JavaScript
- React Hooks

### Cloud & Backend

- AWS Cognito
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Amazon S3

### Development & Deployment

- Git
- GitHub
- Vercel

---

## 📸 Screenshots

### 🛒 Shopping Cart

<img
  src="https://github.com/user-attachments/assets/cd17bf81-2fe0-4b73-be07-6759cafc1cac"
  alt="Shopping cart"
  width="900"
/>

### 🏠 Marketplace Home

<img
  src="https://github.com/user-attachments/assets/b6c91806-8e36-4c0b-a05e-cc5bba8b02ae"
  alt="Marketplace home"
  width="900"
/>

### 📦 Product Details

<img
  src="https://github.com/user-attachments/assets/e754797a-ae90-4bf7-8154-862d34d1708c"
  alt="Product details"
  width="900"
/>

### 💬 Messaging

<img
  src="https://github.com/user-attachments/assets/35e5baf6-2050-4248-b0f0-4be2da24c2c5"
  alt="Messaging"
  width="900"
/>

---

## 💻 Run Locally

Clone the repository:

```bash
git clone https://github.com/chrisdaron2-hue/CDW-marketshop-.git
cd marketplace-app
```

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Build the web application:

```bash
npx expo export --platform web
```

---

## 📚 Skills Demonstrated

- Cloud Computing
- AWS Services
- Serverless Architecture
- Authentication & Authorization
- Frontend Development
- REST API Integration
- State Management
- Database Design
- Object Storage
- Deployment & Hosting
- Git & GitHub
- Problem Solving
- Full-Stack Development

---

## 🔮 Future Improvements

- Docker containerization
- GitHub Actions CI/CD
- Real-time messaging and notifications
- Mobile push notifications
- Payment integration
- Admin dashboard
- Analytics dashboard
- CloudWatch monitoring and logging
- Amazon CloudFront CDN integration

---

## 👩🏽‍💻 Author

**Elizabeth Gyamfi**

Cloud Engineer | AWS | React Native | Serverless Applications

- GitHub: https://github.com/chrisdaron2-hue
- LinkedIn: https://www.linkedin.com/in/elizabeth--gyamfi/
- Email: lizbethgyamfi1@gmail.com

---

## 📄 License

This project was built for educational and portfolio purposes to demonstrate practical cloud engineering, serverless architecture, and full-stack development skills.