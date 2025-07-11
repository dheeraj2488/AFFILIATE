# 🔗 Affiliate++ — Affiliate Link Management SaaS Platform

Affiliate++ is a web-based SaaS application designed to simplify affiliate link management for content creators, influencers, digital marketers, and businesses. It helps users create, organize, and track affiliate links, analyze click and conversion metrics, manage campaigns, and boost performance — all from a single dashboard.

## 🧩 Features

| Feature             | Benefit                                                                 |
|---------------------|-------------------------------------------------------------------------|
| 🔗 Shortened Links   | Easy sharing on social media, blogs, or platforms with character limits |
| 📈 Click Analytics   | Track clicks, conversions, and engagement trends                        |
| 🗂️ Campaign Tags     | Organize links by campaign or category                                  |
| 🔐 Role-Based Access | Admin vs. User — collaborative teams made simple                        |
| 🧑‍💼 User Dashboard   | Personal space to manage, create, and monitor affiliate links            |
| 💳 Razorpay UPI      | Easy payment processing for buying credits to create links              |
| 📧 Email Services    | giving access to viewers by emailing them the auto generated password, confirmations using Nodemailer |
| 🔐 Google OAuth Login | Easy sign-in with Google accounts — faster onboarding |

---

## 🛠️ Tech Stack

### 🚧 Frontend
- **React.js**
- **Redux Toolkit** — state management
- **Bootstrap** — UI styling
- **Axios** — API requests

### ⚙️ Backend
- **Node.js**
- **Express.js**
- **Google OAuth 2.0** — third-party authentication
- **MongoDB + Mongoose** — NoSQL database
- **JWT Authentication** — secure login/registration
- **Nodemailer** — email notifications
- **Razorpay** — UPI integration for transactions

---

## 🎯 Target Audience & Use-Case

Affiliate++ is ideal for content creators, digital marketers, small business owners, students, and affiliate program managers who want to manage and track their affiliate links in one place. Whether you're a YouTuber sharing product links, a marketer running ad campaigns, a student ambassador promoting programs, or a business giving trackable links to your affiliates — this platform helps you shorten URLs, monitor clicks, analyze performance, and optimize campaigns with ease.

> _“Affiliate marketing = You promote, someone buys, and you earn a cut.”_  
This tool helps you track and scale that process effectively.

---

## 🧪 Installation & Setup

### 1. Clone the repo
```
  git clone https://github.com/yourusername/affiliate-plus.git
  cd frontend
  npm install
```
```
cd backend
npm install
```

# Create a .env file and add your config variables (Mongo URI, JWT secret, etc.)

npm run dev
