# 🔗 TinyLink — URL Shortener (Node.js + Express + PostgreSQL)

TinyLink is a simple, fast, and production-ready URL shortener service built using  
**Node.js, Express, PostgreSQL, and TailwindCSS**.  
It includes a clean UI dashboard, link statistics, and full REST API support.

Deployed on **Railway** and ready for public use.

---

## 🚀 Live Demo (Production URL)
👉 https://tinylink-production-d45a.up.railway.app/ 


---

## 📂 GitHub Repository
👉 https://github.com/badri143-alt/tinylink

---

## ✨ Features

### 🔧 Backend (Node.js + Express)
- Create short URLs  
- Redirect short URL → long URL  
- Auto-increment click count  
- Track last clicked timestamp  
- Fetch link statistics  
- Delete a link  
- Health check endpoint (`/healthz`)  
- PostgreSQL database using `pg` module

### 🎨 Frontend (HTML + TailwindCSS)
- Dashboard listing all shortened links  
- Create link form  
- Link stats page (`/code.html?code=XYZ`)  
- Buttons: open, copy, delete  
- Clean, modern UI

### 🗄 Database (PostgreSQL)
- Table: `links`  
- Fields: id, code, long_url, clicks, last_clicked, created_at

---

## 📦 Installation (Run Locally)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/badri143-alt/tinylink
cd tinylink
2️⃣ Install dependencies
npm install
3️⃣ Create .env file
DATABASE_URL=your_postgresql_url_here
PORT=3000
BASE_URL=http://localhost:3000
4️⃣ Start the server
npm run dev
Server will run at:
http://localhost:3000
🗂 Environment Variables

Your .env.example should include:

  DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
  PORT=8080
  BASE_URL=https://your-railway-url
  

Copy .env.example → .env and fill real values.

  🛠 API Endpoints
  🔹 Health Check
  GET /healthz

  
  Response:
  
  { "ok": true, "version": "1.0" }

🔹 Create short link
POST /api/links
Content-Type: application/json
{
  "url": "https://example.com"
}


Response:

{ "message": "Created", "code": "abc123" }

🔹 Get all links
GET /api/links

🔹 Get statistics for a code
GET /api/links/:code

🔹 Redirect short URL
GET /:code


Redirects (302) → long URL
Updates click count + last_clicked

🔹 Delete a code
DELETE /api/links/:code


Response:

{ "message": "Deleted" }

🗄 Database Schema

Table: links

CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  last_clicked TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

🌐 Deployment (Railway)

Project uses:

  Railway PostgreSQL
  
  Railway Node.js service
  
  Environment variables in dashboard

To deploy:
  
  Push code to GitHub
  
  Create new Railway project
  
  Connect GitHub repo
  
  Add environment variables
  
  Railway auto-deploys the backend
