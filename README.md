# 💰 Financial Assistant: MERN Stack Expense Tracker

A **full-stack personal finance management app** built using the **MERN (MongoDB, Express, React, Node.js)** stack.
It provides a secure and intuitive platform to **manage income, track expenses, and visualize financial health**, with added AI-powered (mocked) features like **receipt scanning** and **PDF statement parsing**.

---

## ✨ Key Features

| Feature                           | Description                                                                                                          | Status        |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------- |
| 🔐 **Full User Authentication**   | Secure registration and login using JWT (JSON Web Tokens). All core API routes are protected via Axios interceptors. | ✅ Implemented |
| 📊 **Dashboard & Analytics**      | Real-time summary cards and Recharts visualizations (Monthly Trend, Category Pie).                                   | ✅ Implemented |
| 💸 **Transaction Management**     | CRUD operations for manual entries, plus filtering by date, type, and search term.                                   | ✅ Implemented |
| 📄 **AI Receipt Scanning (Mock)** | Simulated AI endpoints to auto-generate transactions from receipt or PDF input.                                      | ✅ Implemented |

---

## 🛠️ Tech Stack

### 🖥️ Frontend (Client)

| Technology        | Purpose                                    |
| ----------------- | ------------------------------------------ |
| **React & Hooks** | SPA development and state management       |
| **Tailwind CSS**  | Responsive, utility-first UI styling       |
| **Axios**         | API requests with JWT interceptors         |
| **Recharts**      | Interactive data visualizations and charts |

### ⚙️ Backend (Server/API)

| Technology               | Purpose                                    |
| ------------------------ | ------------------------------------------ |
| **Node.js / Express.js** | RESTful API development                    |
| **MongoDB / Mongoose**   | NoSQL database and ODM                     |
| **JWT & Bcrypt**         | Secure authentication and password hashing |
| **dotenv**               | Environment variable management            |

---

## 📁 Project Structure

```
.
├── backend/
│   ├── config/             # DB connection and environment variables
│   ├── controllers/        # Business logic (Auth, Transaction processing)
│   ├── middleware/         # JWT authentication middleware
│   ├── models/             # Mongoose schemas (User.js, Transaction.js)
│   ├── routes/             # Express API routes (authRoutes.js, transactionRoutes.js)
│   └── server.js           # Express application entry point
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main app entry point and routing
│   │   ├── components/     # UI components (AuthForm, Charts, List, etc.)
│   │   └── utils/          # Helper and config files
│   └── package.json        # Frontend dependencies
│
└── .gitignore              # Ignore node_modules, .env, etc.
```

---

## 🚀 Getting Started

### 📋 Prerequisites

* [Node.js](https://nodejs.org/) (v18+)
* [MongoDB](https://www.mongodb.com/) URI (local or cloud)

---

### 🔧 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `/backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend server:

```bash
npm start
```

API will be available at:
👉 `http://localhost:5000/api`

---

### 💻 2. Frontend Setup

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm run dev
```

Frontend will be available at:
👉 `http://localhost:5173/`

---

## 🔐 Environment Variables

| Variable     | Description                         |
| ------------ | ----------------------------------- |
| `PORT`       | Backend server port (default: 5000) |
| `MONGO_URI`  | MongoDB connection URI              |
| `JWT_SECRET` | Secret key for JWT token signing    |

---

## 📈 Future Enhancements

* ✅ Real-time expense insights using AI
* 🧾 PDF statement import (actual parsing)
* 📤 CSV / Excel export integration
* 🔔 Email / SMS budget reminders

---

## 🧑‍💻 Author

**Madhur Jain**
🚀 MERN Stack Developer | AI & Fullstack Enthusiast
📧 [Contact me](mailto:your.email@example.com) | 🌐 [GitHub](https://github.com/your-github-username)

---

Would you like me to make it **auto-generate GitHub badges** (for tech stack, license, stars, etc.) and make the README look **more professional like a top open-source repo** (with preview image and buttons)?
