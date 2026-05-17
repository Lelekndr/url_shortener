# 🔗 URL Shortener

A simple and modern URL shortener with QR Code generation, built by **Leandro Mendieta**.

---

## Preview

![Home](./assets/screenshot1.png)
![Result](./assets/screenshot2.png)

---

## Stack

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- nanoid — short ID generation
- CORS + dotenv

**Frontend**
- React + Vite
- Tailwind CSS v4 + DaisyUI
- Axios
- qrcode — QR Code generation

---

## Como rodar localmente / How to run locally

### 1. Clone o repositório / Clone the repository

```bash
git clone https://github.com/Lelekndr/url_shortener.git
cd url_shortener
```

### 2. Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend` / Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
```

Crie um arquivo `.env` na pasta `frontend` / Create a `.env` file inside the `frontend` folder:

```env
VITE_BACKEND_URL=http://localhost:5000
```

```bash
npm run dev
```

Acesse / Access: `http://localhost:5173`

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/shorten` | Shortens a URL |
| `GET` | `/:shortId` | Redirects to the original URL |

### POST `/shorten`

**Body:**
```json
{ "originalUrl": "https://your-long-url.com" }
```

**Response:**
```json
{ "shortUrl": "http://localhost:5000/abc12345" }
```

---

## Features

- ✂️ Instant URL shortening
- 🔁 Duplicate detection — same URL always returns the same short link
- 📊 Click tracking
- 📷 QR Code generation + download
- 📋 One-click copy

---

*Made by [Leandro Mendieta](https://github.com/Lelekndr)*