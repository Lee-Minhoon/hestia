# Hestia

A comprehensive full-stack application built with the Next.js App Router, serving as both a learning example and a practical reference.

This project demonstrates effective integration between Next.js and various libraries, showcasing common frontend patterns frequently used in real-world applications.

While it can be used as a template, it is primarily designed as an example project that illustrates one approach to building modern web applications.

## 🛠️ Tech Stack

### 1. Foundation

- **Framework** - Next.js 15 App Router
- **Language** - TypeScript

### 2. Frontend & UI

- **Styling** - Tailwind CSS + shadcn/ui + Radix UI
- **State Management** - TanStack Query (React Query)
- **Forms** - React Hook Form + Zod validation
- **Data Tables** - TanStack Table
- **Virtualization** - TanStack Virtual
- **Rich Text Editor** - TipTap

### 3. Backend & Data

- **Authentication** - NextAuth.js v5
- **Database & ORM** - Drizzle ORM + PostgreSQL

### 4. Misc

- **Utilities** - date-fns, lodash-es, clsx, tailwind-merge
- **Custom Hooks** - Scroll restoration, Breakpoint detection, Action progress

### 5. Quality Assurance & Tooling

- **Code Quality** - ESLint + Prettier + lint-staged + Husky
- **Testing** - Vitest + Playwright + Storybook

## ✨ Key Features

- **Authentication System** - User login, registration, and session management
- **User Management** - User profiles and administration
- **Content Management** - Posts and articles with rich text editing
- **Infinite Scroll** - Automatic content loading with intersection observer
- **Virtual Scrolling** - High-performance rendering for large datasets
- **Responsive Design** - Mobile-first, accessible UI components
- **Light/Dark Mode** - Theme switching with system preference detection
- **Internationalization** - English/Korean language support

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher

### Installation & Setup

1. **Clone the project**

   ```bash
   git clone <repository-url>
   cd hestia
   ```

2. **Environment variables setup**

   Edit `.env` file to configure necessary environment variables:

   ```env
   # Run `npx auth secret` to generate a new secret Read more: https://cli.authjs.dev
   AUTH_SECRET=""

   # If you want to use OAuth providers, you need to add their keys here
   AUTH_GITHUB_ID=""
   AUTH_GITHUB_SECRET=""
   AUTH_GOOGLE_ID=""
   AUTH_GOOGLE_SECRET=""
   AUTH_FACEBOOK_ID=""
   AUTH_FACEBOOK_SECRET=""
   ```

3. **Install dependencies**

   ```bash
   yarn install
   # or
   npm install
   # or
   pnpm install
   ```

4. **Start development server**

   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.
