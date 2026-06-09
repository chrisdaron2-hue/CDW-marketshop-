# CDW Marketshop

A modern full-stack marketplace application built with React Native (Expo) and AWS serverless services.

## Live Demo

https://dist-p0ekfib99-market-shop-s-projects.vercel.app

## Features

### Authentication

* AWS Cognito Login & Registration
* Secure user accounts

### Marketplace

* Product listings
* Product search
* Categories
* Shopping cart
* Favorites

### Seller Features

* Seller profiles
* Seller ratings
* Product management

### Buyer Features

* Reviews
* Orders
* Purchase history
* Messaging

### Cloud Services

* AWS Cognito
* AWS Lambda
* AWS DynamoDB
* AWS S3
* Vercel

## Architecture

```text
                    ┌─────────────────┐
                    │     Users       │
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
 │ Authentication│  │ APIs         │   │ Images      │
 └──────────────┘   └──────┬───────┘   └──────────────┘
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

## Tech Stack

* React Native
* Expo
* JavaScript
* AWS Cognito
* AWS Lambda
* AWS DynamoDB
* AWS S3
* Vercel

## Future Improvements

* Stripe Payments
* Real-time Notifications
* Admin Dashboard
* Mobile Push Notifications

## Author

Elizabeth Gyamfi
