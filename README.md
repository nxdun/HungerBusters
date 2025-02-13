# Hunger Busters

## Overview
An awesome project that integrates **MongoDB, JWT authentication, and Stripe payments** on the backend while utilizing **Expo SDK 51** for a smooth frontend experience.

## Table of Contents
- [Video Walkthrough](#video-walkthrough)
- [How to Run](#how-to-run)
- [Technologies Used](#technologies-used)

---

## Video Walkthrough

**Experts Walkthrough**
<div align="center">
  <video src="https://github.com/user-attachments/assets/d1b79693-a06b-43d5-9889-a8fbe48a695a.mp4" width="1080" />
</div>

**Video Specs:**
- Resolution: 1080 x 2400
- Size: 5MB
- Format: MP4

---

## How to Run
### Backend Setup
1. Navigate to the backend folder:
   
   ```sh
   cd backend
   ```

2. Install dependencies:
   
   ```sh
   npm update && npm install
   ```

3. Create a `.env` file and configure the following variables:
   
   ```env
   DB=your_mongodb_connection_url
   JWTPRIVATEKEY=your_own_private_key
   SALT=your_salt_number
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. Start the backend server:
   
   ```sh
   npm start  # Run with nodemon
   # OR
   npm run go  # Run in production mode
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   
   ```sh
   cd frontend
   ```

2. Install dependencies (Keep **EXPO SDK on version 51** and do not update):
   
   ```sh
   npm install
   ```

3. Start Expo development server:
   
   ```sh
   npx expo start
   ```

---

## Technologies Used
- **Backend:** Node.js, Express.js, MongoDB, JWT, Stripe
- **Frontend:** React Native, Expo SDK 51

