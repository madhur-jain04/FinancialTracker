# 💰 Financial Assistant: MERN Stack Expense Tracker

A **full-stack personal finance management app** built using the **MERN (MongoDB, Express, React, Node.js)** stack.
It provides a secure and intuitive platform to **manage income, track expenses, and visualize financial health**, with added AI-powered (mocked) features like **receipt scanning** and **PDF statement parsing**.

---

## Key features

| Feature                  |                                                      What it does | Status |
| ------------------------ | ----------------------------------------------------------------: | :----: |
| User auth (JWT + bcrypt) |         Secure registration, login, token refresh, protected APIs |    ✅   |
| Multi-user isolation     |                  Each user has separate transactions and profiles |    ✅   |
| Transaction CRUD         |          Create, read (with filters & pagination), update, delete |    ✅   |
| Filters & search         | Date range, type (income/expense), category, and full-text search |    ✅   |
| Dashboard charts         |                     Monthly trend + category breakdown (Recharts) |    ✅   |
| Receipt parsing (mock)   |    Upload image/PDF → mocked AI returns structured transaction(s) |    ✅   |
| PDF table parsing        |             Pulls rows from tabular PDFs and creates transactions |    ✅   |


---

## 🛠️ Tech Stack

###  Frontend (Client)

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

##  Project Structure

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

##  Getting Started

###  Prerequisites

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
 `http://localhost:5000/api`

---

###  2. Frontend Setup

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm run dev
```

Frontend will be available at:
 `http://localhost:5173/`

---

##  Environment Variables

| Variable     | Description                         |
| ------------ | ----------------------------------- |
| `PORT`       | Backend server port (default: 5000) |
| `MONGO_URI`  | MongoDB connection URI              |
| `JWT_SECRET` | Secret key for JWT token signing    |

---

## 📈 Future Enhancements

*  Real-time expense insights using AI
*  PDF statement import (actual parsing)
*  CSV / Excel export integration
*  Email / SMS budget reminders

---

##  Author

**Madhur Jain**
