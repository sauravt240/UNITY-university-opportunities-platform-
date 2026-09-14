# University Opportunities Platform (OpportUnity) - Deployment Guide

This guide details how to deploy the **University Opportunities Platform** using **Vercel** for the frontend client and **Render** for the Node.js backend.

---

## 1. Architecture Overview

| Component | Platform | Directory | Framework / Runtime |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** | `client/` | React / Vite SPA |
| **Backend** | **Render** | `server/` | Node.js (Express) |
| **Database** | **MongoDB / Atlas** | Cloud | MongoDB URI (`MONGO_URI`) |

---

## 2. Frontend Deployment (Vercel)

1. Import this repository into Vercel.
2. In the project settings, set:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite` (or `Other`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Configure the following **Environment Variable**:
   - `VITE_API_URL`: The full URL of your deployed Render backend (e.g. `https://opportunity-backend.onrender.com`).
   - *(Optional)* `NEXT_PUBLIC_API_URL`: Also supported as a fallback if using Next.js conventions.

---

## 3. Backend Deployment (Render)

1. In Render, create a new **Web Service** pointing to this repository.
2. Configure the service settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (executes `node index.js`)
3. Configure the following **Environment Variables**:
   - `PORT`: Set automatically by Render (the server dynamically listens on `process.env.PORT`).
   - `MONGO_URI`: Your production MongoDB connection string (e.g. MongoDB Atlas cluster URL: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/opportunity_db?retryWrites=true&w=majority`).
   - `JWT_SECRET`: A secure, random string used to sign and verify JSON Web Tokens.
   - `CORS_ORIGIN`: *(Optional)* Your deployed Vercel frontend URL (e.g. `https://your-opportunity-app.vercel.app`).
   - *(Optional DB credentials)* `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`: If you connect an external relational or MySQL database.

---

## 4. Local Development Notes

- For local development, running `npm run dev` in the root workspace will concurrently start the backend server (on `http://localhost:5000`) and the Vite frontend (on `http://localhost:5173`).
- If `MONGO_URI` is not set locally, the server automatically boots an in-memory MongoDB instance (`MongoMemoryServer`) and seeds initial demo data. In production on Render, provide a persistent `MONGO_URI` (such as MongoDB Atlas).
