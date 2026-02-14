# 💝 Valentine's Day Gallery 💝

A beautiful, interactive website where people can share their Valentine's photos, comment on them with optional anonymous posting, and like their favorites!

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Set Up Supabase (Free)
- Create a free account at [supabase.com](https://supabase.com)
- Create a new project
- Copy your Project URL and Anon Key

### 3. Configure Environment
Create `.env.local`:
```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### 4. Set Up Database
Follow the SQL setup in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### 5. Run Locally
```bash
npm run dev
```

Visit `http://localhost:5173`

## ✨ Features

- 📤 Upload multiple photos at once
- 💬 Leave comments (anonymous or with name)
- ❤️ Like/unlike photos  
- 📱 Fully responsive design
- 🎨 Beautiful gradient UI

## 🌐 Deploy to Vercel

Push to GitHub, then connect to Vercel and add your environment variables. See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📚 Full Documentation

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete setup and troubleshooting.

---

Made with ❤️ for Valentine's Day
