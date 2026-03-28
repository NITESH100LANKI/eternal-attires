# 🌟 Eternal Attires

A premium, modern e-commerce platform built with the MERN stack (MongoDB, Express, React.js, Node.js) featuring a Redux state management system, JWT authentication, and Tailwind CSS for Myntra-like responsive design.

## Features Built
- Full User Authentication (Login / Register) using JWT in HTTP-Only cookies.
- Complete backend RESTful API architecture.
- Modular React frontend styled beautifully with Tailwind CSS.
- Global State Management with Redux Toolkit (Auth and Cart operations).
- Responsive UI including product listings, dynamic Hero Carousel, Product Detail page, and Cart.
- MongoDB data modeling for Orders, Users, Products, and Reviews.
- Ready for Razorpay and Stripe Integration.

---

## 🚀 How to Run Locally

### 1. Prerequisites
- Node.js installed (v16+)
- MongoDB installed locally or a MongoDB Atlas URI

### 2. Configure Environment Variables
Navigate to the `server` directory and rename or clone the `.env.example` file to `.env`:
```bash
cd server
```
Ensure your `.env` contains the required keys (especially `MONGO_URL` and `JWT_SECRET`).

### 3. Install Dependencies
You need to install packages for both the backend (`server`) and the frontend (`client`).

**Install server dependencies:**
```bash
cd server
npm install
```

**Install client dependencies:**
```bash
cd ../client
npm install
```

### 4. Start the Application
You need to start both the server and client concurrently.

**Start the Backend (Port 5000):**
```bash
cd server
npm run dev
```

**Start the Frontend (Port 3000):**
```bash
cd client
npm start
```

### 5. Access the Platform
Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)
