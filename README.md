<img width="1693" height="929" alt="image" src="https://github.com/user-attachments/assets/c4ef30a2-99f9-4d9b-8da3-3c4f6777fda6" />

# CDW MarketShop
![Marketplace](https://img.shields.io/badge/Project-CDW_MarketShop-purple)
![Cloud Engineer](https://img.shields.io/badge/Role-Cloud_Engineer-blueviolet)

![React Native](https://img.shields.io/badge/React_Native-Expo-blue)
![AWS](https://img.shields.io/badge/AWS-Serverless-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)
---


A modern cloud-native marketplace application built with **React Native (Expo)** and **AWS Serverless Services**.

CDW MarketShop enables users to buy and sell products through a secure, scalable marketplace featuring authentication, product listings, multi-image galleries, messaging, reviews, shopping carts, and seller profiles.

This project was built to demonstrate practical skills in **Cloud Engineering**, **Serverless Architecture**, **Frontend Development**, and **Application Deployment**.

---

## 🌐 Live Demo

🌐 **Live Demo:** [CDW MarketShop](https://dist-3e7fe0ewv-market-shop-s-projects.vercel.app)

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

<img width="1470" height="956" alt="Screenshot 2026-06-23 at 18 34 41" src="https://github.com/user-attachments/assets/cd17bf81-2fe0-4b73-be07-6759cafc1cac" />
🛒 Shopping cart

<img width="1470" height="956" alt="Screenshot 2026-06-23 at 18 26 21" src="https://github.com/user-attachments/assets/b6c91806-8e36-4c0b-a05e-cc5bba8b02ae" />
🏠 Home page

<img width="1470" height="956" alt="Screenshot 2026-06-23 at 18 26 36" src="https://github.com/user-attachments/assets/e754797a-ae90-4bf7-8154-862d34d1708c" />
📦 Product details page

<img width="1470" height="956" alt="Screenshot 2026-06-23 at 18 02 32" src="https://github.com/user-attachments/assets/0668bdb7-0237-4f17-8385-127e92fd912e" />
🏠 Home page

<img width="1470" height="956" alt="Screenshot 2026-06-23 at 18 26 47" src="https://github.com/user-attachments/assets/b9897edc-80d9-4a53-9cfc-a884de27840d" />
📦 Product details page

<img width="1470" height="956" alt="Screenshot 2026-06-23 at 18 26 58" src="https://github.com/user-attachments/assets/35e5baf6-2050-4248-b0f0-4be2da24c2c5" />
💬 Messages page

<img width="1470" height="956" alt="Screenshot 2026-06-23 at 18 27 27" src="https://github.com/user-attachments/assets/22a96ff3-7b99-489d-b9e0-f0bb2816751c" />
🛒 Shopping cart

<img width="1470" height="956" alt="Screenshot 2026-06-23 at 18 27 40" src="https://github.com/user-attachments/assets/0d184444-7a66-4466-b37d-770e31178379" />
🛒 Shopping cart

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
