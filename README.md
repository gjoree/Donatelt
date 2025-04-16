# 📦 Donatelt — Deployment & Run Instructions

## Systems III Project Guide

This guide explains how to set up and run the Donatelt project on a server (like your faculty’s shared server).

---

## 🧱 Project Structure

```
Donatelt/
├── backend/           # Express API
├─ frontend files      # React frontend
```

---

## 🚀 Step-by-Step Deployment

### ✅ 1. Clone the Repository

```bash
git clone https://github.com/gjoree/donatelt.git
cd donatelt
```

Switch to a deployment branch if want to host the project on faculty server:

```bash
git checkout deploy-branch
```

---

### ✅ 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
npm install
```

---

### ✅ 3. Setup Environment Variables

#### Environment file `.env`

Create a `.env` file and copy the .env.SAMPLE variables and fill them out.

```
REACT_APP_API=http://YOUR_SERVER_IP:YOUR_BACKEND_PORT
DB_HOST=localhost
DB_USER=youruser
DB_PASSWORD=yourpass
DB_NAME=yourdb
DB_PORT=3306
```

If you want to test the project locally, you need to SSH into the famnit server with tunneling, so the database can work with:

```
ssh -L 3306:localhost:3306 enrollment_number@www.studenti.famnit.upr.si
```

When prompted, type yes, and enter your password.

---

### ✅ 4. Build the React Frontend

```bash
cd ../frontend
npm start
```

---

### ✅ 5. Run the Backend

```bash
cd ../backend
node index.js
```

---

## 🌍 Accessing the App

| Part     | URL Example                               |
| -------- | ----------------------------------------- |
| Frontend | `http://YOUR_SERVER_IP:YOUR_REACT_PORT`   |
| Backend  | `http://YOUR_SERVER_IP:YOUR_BACKEND_PORT` |

---

## 🛠 Tips

- Make sure if you are testing the project locally, to SSH -L before starting the backend
- Make sure to not create too many posts, because the database is not optimized yet
- Check faculty firewall rules if ports aren’t accessible externally.

---

## ✅ You're ready!
