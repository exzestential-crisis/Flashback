# 🌟 FlashBack

> _FlashBack is a sleek, user-friendly flashcards web app for effective studying, now rebuilt from the ground up using **Next.js** and **TypeScript** as part of a personal learning journey._

Originally developed as a school project for **IPT 101**, FlashBack started as a full-stack React + Express app. Since then, it has evolved into a passion project and a stepping stone for learning modern tools and practices in web development—including **Next.js**, **TypeScript**, **Supabase**, and **Tailwind CSS**.

---

## ✨ What’s New?

- 🔁 **Migrated to Next.js 15** using **App Router** and **Turbopack**.
- 🧠 **Rewritten in TypeScript** for better type safety and developer experience.
- 🔐 **Authentication via Supabase** with support for SSR session handling.
- 🔪 **Zod-powered validation** for clean, typed input checks.
- ⚙️ **Modern architecture**: Modular components, state management with Zustand, and animations with Framer Motion.
- 📧 **Email verification** using Nodemailer.
- 🌙 **Dark mode** powered by `next-themes`.

---

## 🚀 Features

- 📝 **Create & Manage Flashcards** – Organize content into decks, folders, and tags.
- 🔍 **Smart Filtering & Search** – Easily find cards by keyword.
- 📊 **Review Mode with Delayed Reappearances** – Study smarter with dynamic scheduling (e.g., “Again”, “Hard”, “Easy” buttons).
- 🌙 **Dark Mode Support** – Toggle themes seamlessly.
- 🧠 **User Stats & Progress Tracking** – (Coming soon!)
- 🎯 **Spaced Repetition Engine** – (Coming soon!)

---

## 🧰 Tech Stack (New)

### **Core**

- **Next.js 15** (App Router + Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**

### **Backend & Auth**

- **Supabase** (DB + Auth)
- **Nodemailer** (Email verification)
- **bcryptjs**, **jsonwebtoken**, **jose**

### **State & Validation**

- **Zustand** (State Management)
- **Zod** (Validation)

### **UI & Animations**

- **Framer Motion**
- **Lottie-React**
- **React Icons**
- **next-themes**

---

## 📦 Package.json Overview

Here are the key dependencies:

```json
"dependencies": {
  "@supabase/ssr": "^0.6.1",
  "@supabase/supabase-js": "^2.49.4",
  "bcryptjs": "^3.0.2",
  "framer-motion": "^12.12.1",
  "jose": "^6.0.11",
  "jsonwebtoken": "^9.0.2",
  "lottie-react": "^2.4.1",
  "next": "15.3.2",
  "next-themes": "^0.4.6",
  "nodemailer": "^7.0.3",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-icons": "^5.5.0",
  "zod": "^3.25.49",
  "zustand": "^5.0.5"
}
```

---

## 🛠️ Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-username/flashback.git
cd flashback
npm install
```

### 2. **Set Up Environment Variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

EMAIL_SERVER=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM=FlashBack <no-reply@flashback.com>
```

> 🔐 Keep your environment file private and never commit it to GitHub!

### 3. **Run Locally**

```bash
npm run dev
```

---

## 📚 Learning Goals

This project is part of my personal goal to:

- Learn and apply **TypeScript** best practices.
- Deepen understanding of **Next.js (App Router, SSR, Middleware)**.
- Build scalable app architecture with modern tooling.
- Explore **Supabase** as a backend-as-a-service.

---

## 🙌 Contributing

This is an active learning project, but contributions, suggestions, and bug reports are always welcome! Open an issue or submit a pull request. 🚀

---

## 📜 License

This project started as an academic submission and is now open source for educational purposes. Not licensed for commercial use.
