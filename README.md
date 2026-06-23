# CDW Marketshop
<img width="1693" height="929" alt="CDW Marketshop" src="https://github.com/user-attachments/assets/80ce24d0-e349-45b9-8bf3-8407d12baae8" />


# CDW MarketShop

A modern cloud-native marketplace application built with **React Native (Expo)** and **AWS Serverless Services**.

CDW MarketShop enables users to buy and sell products through a secure, scalable marketplace featuring authentication, product listings, multi-image galleries, messaging, reviews, shopping carts, and seller profiles.

This project was built to demonstrate practical skills in **Cloud Engineering**, **Serverless Architecture**, **Frontend Development**, and **Application Deployment**.

---

## 🌐 Live Demo

**Application:** https://dist-laiyz6sjg-market-shop-s-projects.vercel.app

---

## ✨ Features

### 🔐 Authentication

* User registration and login
* Secure authentication with AWS Cognito
* Account management

### 🛒 Marketplace

* Product listings
* Product search
* Category browsing
* Shopping cart
* Favorites/Wishlist
* Multi-image product gallery

### 🏪 Seller Features

* Seller profiles
* Seller ratings
* Product management
* Edit and manage listings

### 👤 Buyer Features

* Product reviews
* Orders and purchase history
* Messaging system
* Product gallery navigation

### 💬 Messaging

* Buyer and seller conversations
* Product-based messaging threads
* Reply functionality

---

## ☁️ Cloud Services

* **AWS Cognito** – Authentication and user management
* **AWS Lambda** – Serverless backend APIs
* **AWS DynamoDB** – Data storage
* **AWS S3** – Product image storage
* **Vercel** – Frontend deployment and hosting

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
                    │ Expo Frontend   │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼

 ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
 │ AWS Cognito  │   │ AWS Lambda   │   │   AWS S3    │
 │Authentication│   │ Serverless   │   │ Product     │
 │              │   │ APIs         │   │ Images      │
 └──────────────┘   └──────┬────────┘   └──────────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ AWS DynamoDB     │
                  │                  │
                  │ Products         │
                  │ Orders           │
                  │ Reviews          │
                  │ Messages         │
                  └──────────────────┘
                           │
                           ▼
                    ┌─────────────────┐
                    │     Vercel      │
                    │   Deployment    │
                    └─────────────────┘
```

---

## 🚀 Key Highlights

* Designed and developed a cloud-native marketplace application from scratch
* Implemented secure user authentication with Amazon Cognito
* Built a serverless backend using AWS Lambda and DynamoDB
* Integrated Amazon S3 for multi-image product uploads and galleries
* Developed buyer-seller messaging functionality
* Implemented reviews, favorites, orders, and seller management features
* Deployed the application to production using Vercel

---

## 🛠️ Tech Stack

### Frontend

* React Native
* Expo
* JavaScript
* React Hooks

### Cloud & Backend

* AWS Cognito
* AWS Lambda
* AWS DynamoDB
* AWS S3

### Development & Deployment

* Git
* GitHub
* Vercel

---

## 📸 Screenshots



---

## 💻 Run Locally

```bash
git clone https://github.com/chrisdaron2-hue/CDW-marketshop-.git
cd marketplace-app
npm install
npx expo start
```

For web:

```bash
npx expo export --platform web
```

---

## 📚 Skills Demonstrated

* Cloud Computing
* AWS Services
* Serverless Architecture
* Authentication & Authorization
* Frontend Development
* REST APIs
* State Management
* Database Design
* Deployment & Hosting
* Git & GitHub
* Problem Solving
* Full-Stack Development

---

## 🔮 Future Improvements

* Docker containerization
* GitHub Actions CI/CD pipeline
* Real-time chat and notifications
* Mobile push notifications
* Stripe payment integration
* Admin dashboard
* Analytics dashboard
* CloudWatch monitoring and logging
* CDN integration with Amazon CloudFront

---

## 👩🏽‍💻 Author

**Elizabeth Gyamfi**

Cloud Engineer | AWS | React Native | Serverless Applications

* GitHub: https://github.com/chrisdaron2-hue
* Email: [lizbethgyamfi1@gmail.com](mailto:lizbethgyamfi1@gmail.com)

---

## 📄 License

This project was built for educational purposes and to demonstrate practical cloud engineering and full-stack development skills.
