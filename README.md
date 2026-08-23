# E-Commerce Drop-Shipping Platform

Welcome to your complete, custom-built drop-shipping e-commerce platform! 

## Folder Structure

The project has been cleaned up and is now organized into exactly **two main directories** for maximum simplicity and maintainability:

1. **`/backend`**
   - Contains the Node.js/Express server and MongoDB models.
   - Handles the main API logic, database connections, user authentication, and product serving.
   - Runs on `http://localhost:5000`.

2. **`/frontend`**
   - Contains all of your client-facing code. Inside, you'll find two independent Next.js applications:
     - **`/frontend/store`**: The public-facing mobile-first shopping experience. Runs on `http://localhost:3000`.
     - **`/frontend/admin`**: The secure admin dashboard for managing inventory and orders. Runs on `http://localhost:3001`.

## How to Start the Project

To launch the entire platform with one click, simply double-click the **`start.bat`** file in the root directory!

This script will automatically open three terminal windows and start the Backend API, the Admin Dashboard, and the Storefront simultaneously.

### Manual Startup
If you prefer to start them manually via the command line:

**1. Start the Backend:**
```bash
cd backend
npm run dev
```

**2. Start the Storefront:**
```bash
cd frontend/store
pnpm run dev
```

**3. Start the Admin Dashboard:**
```bash
cd frontend/admin
pnpm run dev
```

## Features Complete
- Full database seeding with demo products and categories.
- High-converting, mobile-first design with a sticky bottom navigation bar.
- Product Details page with dynamic trust badges and collapsible accordions for Shipping/Returns.
- Secure Admin dashboard with Shadcn UI components.
