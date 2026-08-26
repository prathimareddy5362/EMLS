# Employee Leave Management System (ELMS) - Frontend

This is a premium, state-of-the-art **Glassmorphic React.js** frontend for an Employee Leave Management System (ELMS). It features high-fidelity visual aesthetics (deep dark backgrounds, frosted glass containers, smooth hover scales, glow lights) and role-based permissions.

To enable standalone exploration without a backend server, this application comes equipped with a **localStorage-backed Mock Database Layer** that simulates database updates in real-time.

---

## 🚀 Features

- **Glassmorphic Theme**: Sophisticated translucent components, custom scrollbars, subtle transitions, and Outfit typography.
- **Role-Based Auth (Employee vs Admin)**:
  - **Employee**: Apply for leaves, view balances, check request lists, and update profile settings.
  - **Admin**: Approve or reject leaves, view staff logs, manage employees (Add/Edit/Delete), and read department analytics.
- **Dynamic Charting**: Custom zero-dependency SVG-based analytics bar graphs.
- **Real-Time Table Searches**: Dynamic multi-column searches and page filtering.
- **SEO & Responsiveness**: Fully responsive viewport styling down to mobile sizes.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (via Vite)
- **Routing**: React Router DOM (nested structure)
- **HTTP Client**: Axios (configured with intercepts for token validation)
- **Icons**: React Icons (Io5 family)
- **Styling**: Vanilla CSS Variables & Glass class utilities (zero Tailwind, keeping it clean and editable)

---

## 📦 Getting Started

### 1. Install Dependencies
Run the package manager from the directory:
```bash
npm install
```

### 2. Start Dev Server
Launch Vite's hot-reload server locally:
```bash
npm run dev
```

---

## 🔑 Demo Access Credentials

The mock database is pre-configured with the following default accounts for quick testing. Use the **Quick Demo Login** buttons on the Login page to sign in instantly, or enter these credentials:

| Role | Email | Password | Name |
| :--- | :--- | :--- | :--- |
| **Employee** | `employee@elms.com` | `password` | Jane Doe |
| **Employee** | `john@elms.com` | `password` | John Smith |
| **Admin / HR** | `admin@elms.com` | `password` | Admin Moderator |

---

## 📂 Project Architecture

```
src/
├── assets/          # Static elements
├── components/      # UI components
│   ├── charts/      # LeaveChart component
│   ├── common/      # Button, Card, Input, Loader, Modal, Table
│   └── layout/      # Navbar, Sidebar, Footer, Layout (Wrapper)
├── context/         # AuthContext session state
├── hooks/           # useAuth hook
├── pages/           # Page routers (Login, ApplyLeave, Employees, etc.)
├── routes/          # ProtectedRoute and AppRoutes mappings
├── styles/          # variables.css, glass.css, globals.css
├── App.jsx          # Root routing bind
├── main.jsx         # Render node mount
└── index.css        # Clear default overrides
```
