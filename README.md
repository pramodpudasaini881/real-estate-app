# Real-Estate Listing Search Platform

A full-stack project built for a mid-level engineering take-home assessment.
This repository includes a Node.js + Express backend using Prisma with PostgreSQL, and a Next.js (App Router) frontend.

## Architecture Highlights
- **Clear MVC Separation**: The backend isolates logic across `routes`, `controllers`, and `services`.
- **Sensible Indexing**: Core fields like `price`, `beds`, `baths`, `suburb`, and `propertyType` are explicitly indexed in `schema.prisma`.
- **Role-Aware API**: A `mockAuthMiddleware` inspects the `x-user-role` header to determine whether a user is an 'admin'.
- **Premium Custom Frontend**: The Next.js frontend uses vanilla CSS with CSS variables, omitting Tailwind to demonstrate custom responsive grid implementation and aesthetic capability without bulky frameworks. 

## Requirements fulfillment
- `/listings` & `/listings/:id` implemented with filters, pagination, and robust service layers.
- Admin status notes returned selectively based on "x-user-role" header.
- Jest integration tests included for endpoints.

---

## Prerequisites
- Node.js LTS (v18+)
- PostgreSQL installed and running (default: `localhost:5432`)

---

## Setup Instructions

### 1. Backend Setup

Open a terminal and navigate to the backend folder:
```bash
cd real-estate-backend
npm install
```

Copy the example environment file and configure it:
```bash
cp .env.example .env
```
Ensure your `.env` contains valid PostgreSQL credentials (the schema defaults to one on `localhost:5432/realestate`):
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/realestate"
PORT=4000
```

Deploy the database schema, generate Prisma, and run the seeder:
```bash
npx prisma db push
npx prisma generate
npm run prisma:seed
# Or just use the native command:
npx prisma db seed
```

Start the backend API server:
```bash
npm run dev
```
*(The server will run on http://localhost:4000)*

### 2. Frontend Setup

Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```

Start the Next.js development server:
```bash
npm run dev
```
*(The UI will be available on http://localhost:3000)*

---

## Example API Calls

**1. Fetch basic page 1 properties (Normal user view):**
```bash
curl "http://localhost:4000/api/listings?page=1&limit=2"
```

**2. Fetch with price and bed filters:**
```bash
curl "http://localhost:4000/api/listings?price_min=200000&price_max=600000&beds=2"
```

**3. Fetch as an Admin (receives 'statusNote'):**
```bash
curl -H "x-user-role: admin" "http://localhost:4000/api/listings/1"
```

---

## Running Tests
Tests are built with Jest and Supertest.
Ensure the server is not binding to the test's automated execution ports, or just run them directly:
```bash
cd real-estate-backend
npm run test
```
