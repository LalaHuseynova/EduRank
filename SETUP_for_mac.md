# 🛠 EduRank — macOS Setup Guide

This guide explains how to run **EduRank** locally on **macOS** from scratch.

---

## 📋 Requirements

Make sure you have:
- **macOS** (Apple Silicon or Intel)
- **Node.js ≥ 18**
- **Docker Desktop**
- **npm**
- **Homebrew** (recommended)

---

## 1️⃣ Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Verify:
```bash
brew --version
```

---

## 2️⃣ Install Node.js

```bash
brew install node
```

Verify:
```bash
node -v
npm -v
```

---

## 3️⃣ Install Docker Desktop

Download and install Docker Desktop:

👉 [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

After installing:
* Open **Docker Desktop**
* Wait until it says **"Docker is running"** 🟢

Verify:
```bash
docker info
```

---

## 4️⃣ Install `dos2unix` (IMPORTANT)

The project includes a SQL dump that **must be UTF-8 + Unix format**.

```bash
brew install dos2unix
```

Verify:
```bash
dos2unix --version
```

---

## 5️⃣ Clone the repository

```bash
git clone <YOUR_REPO_URL>
cd EduRank
```

---

## 6️⃣ Install dependencies

```bash
npm install
```

---

## 7️⃣ Prepare the SQL file (CRITICAL STEP)

Convert the SQL dump to UTF-8 Unix format:

```bash
dos2unix edurank_fixed.sql
```

Verify encoding:
```bash
file edurank_fixed.sql
```

✅ Expected output:
```
ASCII text
```
or
```
UTF-8 Unicode text
```

❌ If you see `UTF-16`, **do not continue**.

⚠️ Important:
* Do **NOT** open `edurank_fixed.sql` in TextEdit
* If opening in VS Code, ensure the encoding is **UTF-8**

---

## 8️⃣ Start the database (Docker)

```bash
docker compose down -v
docker compose up
```

Wait until you see:
```
database system is ready to accept connections
```

Leave this terminal **running**.

---

## 9️⃣ Generate Prisma Client (new terminal tab)

Open a **new terminal tab** and run:

```bash
npm run db:generate
```

---

## 🔍 Optional: Open Prisma Studio

```bash
npm run db:studio
```

Open in browser:
```
http://localhost:5555
```

---

## 🔟 Start the development server

```bash
npm run dev
```

Open in browser:
```
http://localhost:3000
```

---

## ✅ Success Checklist

* ✔ PostgreSQL running in Docker
* ✔ Prisma Client generated
* ✔ Prisma Studio accessible
* ✔ Next.js app running
* ✔ No UTF-8 / `0xff` errors

---

## 🧯 Common Issues & Fixes

### ❌ Docker daemon not running

```bash
open -a Docker
```

---

### ❌ SQL UTF-8 / encoding errors

```bash
dos2unix edurank_fixed.sql
docker compose down -v
docker compose up
```

---

### ❌ Prisma cannot connect to database

* Ensure Docker is running
* Check `.env` file contains a valid `DATABASE_URL`

---

## 📌 Useful Commands

| Command                  | Description            |
| ------------------------ | ---------------------- |
| `docker compose down -v` | Reset database         |
| `docker compose up`      | Start database         |
| `npm run dev`            | Start Next.js          |
| `npm run db:generate`    | Generate Prisma client |
| `npm run db:studio`      | Open Prisma Studio     |

---

## 🎉 You're ready!

EduRank is now fully running on macOS 🚀

If something breaks, reset the database and repeat **steps 7–10**.