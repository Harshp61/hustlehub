<div align="center">

# 💼 HustleHub

### *A Community of Freelancers.*

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?style=for-the-badge&logo=vercel)](https://hustlehub-two.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> A full-stack freelancer community platform where creators and clients connect, collaborate, and hustle.

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-hustlehub--two.vercel.app-purple?style=for-the-badge)](https://hustlehub-two.vercel.app)

---

</div>

## 🌟 About

**HustleHub** is a full-stack community platform built for freelancers. It brings together independent creators, developers, designers, and other professionals in one place — letting them showcase their work, connect with clients, and grow their freelance presence.

Built entirely in **TypeScript** with **Next.js 16** and powered by **Supabase** for both authentication and real-time data, HustleHub is a modern, performant, and type-safe application from the ground up.

<br/>

## ✨ Features

| | Feature | Description |
|--|---------|-------------|
| 👤 | **User Auth** | Secure sign-up, login, and session management via Supabase Auth |
| 🧑‍💻 | **Freelancer Profiles** | Create and manage a personal profile showcasing your skills and work |
| 🌐 | **Community Feed** | Browse and discover other freelancers and their posts |
| 📋 | **Form Validation** | Robust server-side validation powered by VineJS |
| 🔒 | **Protected Routes** | Middleware-level auth guards — unauthenticated users are redirected automatically |
| 🌙 | **Dark Mode** | Full light/dark theme switching via `next-themes` |
| 🔔 | **Toast Notifications** | Real-time user feedback with `react-toastify` |
| 📅 | **Relative Timestamps** | Human-friendly dates powered by `moment.js` |
| ♾️ | **Infinite Scroll** | Smooth content loading with `react-intersection-observer` |
| 🎨 | **Modern UI** | shadcn/ui + Radix UI + TailwindCSS v4 for a clean, accessible interface |

<br/>

## 🛠️ Tech Stack

### 🎨 Frontend
**Next.js 16** (App Router) · **React 19** · **TypeScript 5** · **TailwindCSS v4** · **shadcn/ui** · **Radix UI** · **Lucide React**

**react-intersection-observer** enables infinite scroll · **react-toastify** handles notifications · **next-themes** for dark mode · **moment.js** for date formatting · **tailwind-merge** + **clsx** for clean class handling.

### 🗄️ Backend & Database
**Supabase** handles everything on the backend — PostgreSQL database, authentication, row-level security, and real-time subscriptions. The `@supabase/ssr` package ensures seamless server-side integration with Next.js App Router.

### ✅ Validation
**VineJS** (`@vinejs/vine`) provides fast, expressive, and type-safe server-side form validation for all user inputs.

### 🔐 Auth & Routing
**Supabase Auth** manages user sessions. A **Next.js middleware** (`middleware.ts`) protects all private routes — redirecting unauthenticated users to the login page before the page ever loads.

<br/>

## 📁 Project Structure

```
hustlehub/
├── 📂 app/             # Next.js App Router — pages, layouts, API routes
├── 📂 actions/         # Server Actions — data mutations & Supabase calls
├── 📂 components/      # Reusable UI components
├── 📂 lib/             # Supabase client config & utility helpers
├── 📂 provider/        # React context providers (theme, etc.)
├── 📂 validations/     # VineJS validation schemas
├── 📂 public/          # Static assets & logo
├── 📄 middleware.ts    # Auth middleware for route protection
├── 📄 types.ts         # Shared TypeScript type definitions
└── 📄 env.ts           # Type-safe environment variable access
```

<br/>

## 🚀 Getting Started

### Prerequisites
- **Node.js** `v18+`
- A free [Supabase](https://supabase.com) account and project

### Installation

```bash
# Clone & install
git clone https://github.com/Harshp61/hustlehub.git
cd hustlehub
npm install

# Start the dev server
npm run dev
# → Open http://localhost:3000
```

> 💡 Make sure to configure your Supabase project URL and anon key before running locally.

<br/>

## 🌐 Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Harshp61/hustlehub)

1. Import the repo on [Vercel](https://vercel.com/new)
2. Add your Supabase environment variables in the Vercel dashboard
3. Hit **Deploy** 🚀

<br/>

## 🤝 Contributing

1. 🍴 Fork the repo
2. 🌿 Create a branch: `git checkout -b feature/YourFeature`
3. 💾 Commit: `git commit -m "✨ Add: YourFeature"`
4. 📤 Push & open a Pull Request

Found a bug or have an idea? [Open an issue →](https://github.com/Harshp61/hustlehub/issues)

<br/>

## 📄 License

Licensed under the [MIT License](LICENSE).

<br/>

<div align="center">

Made with ❤️ by **[Harsh](https://github.com/Harshp61)**

⭐ **If you like this project, give it a star!** ⭐

[![GitHub stars](https://img.shields.io/github/stars/Harshp61/hustlehub?style=social)](https://github.com/Harshp61/hustlehub/stargazers)

</div>
