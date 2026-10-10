# Solar System Calculator & Marketplace

A full-stack solar energy website with an electricity usage calculator and a solar products marketplace.

## Features

### Electricity Calculator
- 10 preset household appliances with editable wattage, quantity, days/month (max 30), and hours/day (max 24)
- Add custom appliances and reset to defaults
- Instant results as you type:
  - Total monthly units (kWh)
  - Daily usage
  - Connected load (W)
  - Estimated monthly bill (editable rate, default Rs 50/unit)
  - Recommended solar capacity (kW)
  - Number of 550W panels needed
- Appliance-wise usage breakdown with bar chart and percentages
- Common system sizes reference (3kW, 5kW, 8kW, 10kW)

### User Authentication
- Register and log in with email and password
- Passwords are hashed with bcrypt on the server
- JWT-based authentication
- Edit profile: name, phone, location, description, profile image
- View and manage your own product listings
- Normal users cannot register as admins

### Solar Products Marketplace
- Browse, search, and filter products by category
- Product detail pages with seller information
- Registered users can add, edit, and delete their own listings
- Product fields: title, category, price (PKR), description, brand, model, wattage, condition, quantity, images, location
- Users can only edit/delete their own products (enforced by backend)
- No payment integration — listings are for browsing and contact only

### Admin Panel
- Protected admin dashboard (admin role set via environment variables)
- View platform statistics
- Manage users (suspend/reactivate accounts)
- Moderate product listings (approve, reject, remove)
- Admin permissions enforced on the backend

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + React Router + Axios
- **Backend:** Node.js + Express + Mongoose
- **Database:** MongoDB Atlas
- **Auth:** bcrypt (password hashing) + JWT (tokens)

## Project Structure

```
/
├── src/                    # Frontend (React + Vite)
│   ├── components/         # Navbar, Footer, Calculator
│   ├── context/            # AuthContext (login/register/session)
│   ├── pages/              # Home, Marketplace, Profile, Admin, etc.
│   ├── utils/              # API client, calculator logic
│   ├── App.tsx             # Routes
│   └── index.css           # Tailwind + custom styles
├── server/                 # Backend (Node.js + Express)
│   ├── models/             # User.js, Product.js (Mongoose schemas)
│   ├── routes/             # auth.js, products.js, admin.js
│   ├── middleware/         # auth.js (JWT verification, admin guard)
│   ├── config.js           # Environment config
│   ├── db.js               # MongoDB connection
│   ├── seedAdmin.js        # Creates admin account on first start
│   └── server.js           # Express app entry point
├── .env.example            # Frontend env template
├── .gitignore
└── README.md
```

## Setup Instructions

### 1. Frontend

```bash
npm install
npm run dev
```

The frontend runs on http://localhost:5173.

Create a `.env` file (see `.env.example`):
```
VITE_API_URL=http://localhost:5000/api
```

### 2. Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder (see `server/.env.example`):
```
MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/solar_system?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-this
ADMIN_EMAIL=admin@solarsystem.pk
ADMIN_PASSWORD=admin12345
CLIENT_URL=http://localhost:5173
PORT=5000
```

Start the backend:
```bash
npm start
```

The backend runs on http://localhost:5000.

### 3. MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/atlas
2. Add your IP to the IP Access List
3. Create a database user
4. Get the connection string from Connect > Drivers > Node.js
5. Paste it as `MONGODB_URL` in `server/.env`

### 4. Admin Account

On first server start, an admin account is automatically created using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the environment variables. Log in with those credentials to access the admin panel at `/admin`.

## Calculator Formulas

- **Monthly units per appliance:** Watts × Quantity × Days × Hours ÷ 1000
- **Daily usage:** Total monthly kWh ÷ 30
- **Connected load:** Sum of (Watts × Quantity) for all appliances
- **Estimated bill:** Total monthly units × Rate per unit (default Rs 50)
- **Recommended solar capacity:** Daily kWh ÷ 5 peak sun hours ÷ 0.8 efficiency
- **Panel count:** Recommended kW ÷ 0.55, rounded up

All solar generation values are estimates, not guarantees. Actual output varies by location, weather, and installation quality.

## Important Notes

- The calculator works fully without a backend (client-side math only)
- The marketplace, authentication, and admin panel require the backend server to be running
- No payment system is implemented — do not claim products are purchased or paid for
- Image uploads use URL inputs (paste direct image URLs when creating listings)
- Never commit `.env` files or expose database credentials
