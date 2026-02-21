# 🎯 ExpertConnect – Real-Time Expert Session Booking System

A full-stack web application for booking 1-on-1 expert sessions with real-time slot availability powered by Socket.io.

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io |
| Styling | Pure CSS Variables |

---

## 📁 Project Structure

```
expert-booking-system/
├── backend/
│   ├── src/
│   │   ├── config/       → db.js, seed.js
│   │   ├── models/       → Expert.js, Booking.js
│   │   ├── controllers/  → expertController.js, bookingController.js
│   │   ├── routes/       → expertRoutes.js, bookingRoutes.js
│   │   ├── middleware/   → errorHandler.js
│   │   └── socket/       → socketHandler.js
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/   → common, experts, booking, mybookings
    │   ├── pages/        → ExpertList, ExpertDetail, Booking, MyBookings
    │   ├── services/     → api.js (axios)
    │   └── context/      → SocketContext.jsx
    └── .env
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (running locally or Atlas URI)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**backend/.env**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expert-booking
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**frontend/.env**
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Seed Database

```bash
cd backend
node src/config/seed.js
```

This adds 12 sample experts with available time slots.

### 4. Run Development Servers

```bash
# Terminal 1 – Backend
cd backend
npm run dev   # runs on http://localhost:5000

# Terminal 2 – Frontend
cd frontend
npm run dev   # runs on http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/experts` | List experts with pagination & filters |
| GET | `/api/experts/:id` | Get expert with available slots |
| POST | `/api/bookings` | Create a new booking |
| PATCH | `/api/bookings/:id/status` | Update booking status |
| GET | `/api/bookings?email=` | Get bookings by email |

### Query Parameters for GET /api/experts:
- `page` – Page number (default: 1)
- `limit` – Items per page (default: 6)
- `search` – Search by name or specialization
- `category` – Filter by category (Technology, Finance, etc.)

---

## ⚡ Critical Features

### 🔒 Double Booking Prevention
Uses **MongoDB atomic operations** within a **transaction** to prevent race conditions:
```js
// Atomically find AND update slot — only if it's not already booked
Expert.findOneAndUpdate(
  { _id: expertId, 'availableSlots.time': timeSlot, 'availableSlots.isBooked': false },
  { $set: { 'availableSlots.$.isBooked': true } },
  { session }  // within transaction
)
```
+ A **compound unique index** on `(expertId, date, timeSlot)` as a final fallback.

### 🔴 Real-Time Updates
- Socket.io broadcasts `slotBooked` and `slotFreed` events to all connected clients
- ExpertDetailPage listens and instantly disables newly booked slots

---

## 📱 Pages

1. **Expert List** – Search, filter by category, paginated grid
2. **Expert Detail** – Profile + real-time slot picker
3. **Booking** – Validated form → success confirmation
4. **My Bookings** – Look up all bookings by email

---

## 📦 Deployment

### Backend (Railway / Render / Heroku)
1. Set `MONGODB_URI` to your MongoDB Atlas URI
2. Set `CLIENT_URL` to your frontend URL
3. Deploy and get your backend URL

### Frontend (Vercel / Netlify)
1. Set `VITE_API_BASE_URL` to your backend URL + `/api`
2. Set `VITE_SOCKET_URL` to your backend URL
3. Deploy
