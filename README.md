
# EventHorizon - Event Booking System

A premium, responsive Event Booking System built with the MERN stack (Next.js variant). Inspired by Eventbrite and Ticketmaster.

## 🚀 Features

- **Dynamic Event Browsing**: Explore concerts, summits, and festivals with a modern UI.
- **Secure Payments**: Integrated with **Stripe** for real-world booking flows.
- **User Authentication**: Secure Login/Signup using **NextAuth.js**.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **Admin Dashboard**: Generate fake data and manage events (Seeding functionality included).
- **Calendar Management**: Visual availability checks for event tickets.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB (Mongoose)
- **Payments**: Stripe
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS & Lucide Icons
- **Animation**: Framer Motion (Transitions) / CSS Keyframe Animations

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account (or local)
- Stripe Account (for API keys)

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI="your_mongodb_connection_string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_key"

# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

### 4. Database Seeding
Once the app is running, visit:
`http://localhost:3000/api/seed`
This will automatically connect to MongoDB, log "**✅ MongoDB connected**" in the console, and populate the database with sample events and users.

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 👥 Test Credentials
| Email | Password | Role |
| :--- | :--- | :--- |
| `admin@example.com` | `password123` | Admin |
| `user@example.com` | `password123` | User |

## 📸 Design Focus
The application features a dark-themed, glassmorphic design inspired by high-end ticketing platforms. It uses smooth gradients, micro-animations, and a mobile-first approach to ensure a premium user experience.
