# MyWebsite Frontend

Modern, responsive frontend application for MyWebsite, built with React, TypeScript, Vite, and Tailwind CSS. Features an interactive cat-themed interface with real-time WebSocket communication, AI-powered chat, wheel of fortune rewards, and more.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Component Architecture](#component-architecture)
- [Pages](#pages)
- [Services](#services)
- [Hooks](#hooks)
- [Contexts](#contexts)
- [Styling](#styling)
- [Internationalization](#internationalization)
- [Routing](#routing)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [WebSocket Integration](#websocket-integration)
- [Development](#development)
- [Building](#building)
- [Deployment](#deployment)

---

## 🎯 Overview

This frontend application provides a beautiful, interactive user experience with:

- **User Authentication**: Login/registration with email and nickname
- **Real-time Features**: WebSocket cat state machine with live updates
- **AI Chatbot**: SmartChat that exclusively talks about cats
- **Wheel of Fortune**: Interactive reward system with temporary visual effects
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Multi-language Support**: English and Serbian (srpski)
- **Modern UI**: Beautiful animations, transitions, and visual effects

---

## 🛠 Tech Stack

- **Framework**: React 19.x
- **Language**: TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 3.x
- **Routing**: React Router DOM 7.x
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Red Hat Text, Barlow Semi Condensed)

---

## ✨ Features

### Authentication
- Email/nickname-based login/registration
- JWT token management
- Protected routes
- Forgot nickname functionality
- Account deletion

### Real-time WebSocket Cat
- Live cat state updates
- Interactive sleep/rest functionality
- Activity logging in terminal-style UI
- State synchronization across all clients

### SmartChat AI
- OpenAI-powered chatbot
- Cat-only conversation restriction
- Multi-language support
- Conversation history
- Text-only responses

### Wheel of Fortune
- 8 different prizes
- Weighted random selection
- Cooldown system
- Temporary reward effects (30 seconds)
- Spin history tracking

### Active Rewards System
- Avatar customization
- Nickname styling (cursive, size, prefix)
- Custom cursor (cat paw)
- Color theme swap
- Yarn ball animation

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancements
- Touch-friendly interactions

---

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running (see [Backend README](../mywebsite-backend/README.md))

### Install Dependencies

```bash
npm install
```

This will install all required dependencies including React, TypeScript, Vite, Tailwind CSS, and more.

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api
```

**Note**: In production, set `VITE_API_URL` to your production backend URL.

### API Configuration

The API URL is configured in `src/constants/index.ts`:

```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
```

---

## 📁 Project Structure

```
mywebsite-frontend/
├── public/
│   ├── images/              # Static images (SVG, PNG)
│   │   ├── user-profile-icons/  # Avatar icons
│   │   └── tools-icon/          # Technology icons
│   └── translations/        # Translation JSON files
│       ├── en.json          # English translations
│       └── sr.json          # Serbian translations
├── src/
│   ├── assets/              # Assets (images, fonts)
│   ├── components/          # React components
│   │   ├── atoms/           # Atomic components (Button, Input, Text, Image)
│   │   ├── molecules/       # Molecule components (Header, Footer, Modal, UserMenu)
│   │   ├── organisms/       # Organism components (complex features)
│   │   └── ProtectedRoute.tsx  # Route protection component
│   ├── config/              # Configuration files
│   │   └── wheel.ts         # Wheel of Fortune configuration
│   ├── constants/           # Constants and configuration
│   │   └── index.ts         # Routes, API endpoints, storage keys
│   ├── contexts/            # React contexts
│   │   └── i18n.tsx         # Internationalization context
│   ├── hooks/               # Custom React hooks
│   │   ├── useChatBot.ts    # Chat bot logic
│   │   ├── useWebsocketCat.ts  # WebSocket cat logic
│   │   └── useWheelOfFortune.ts  # Wheel of Fortune logic
│   ├── pages/               # Page components
│   │   ├── Login.tsx        # Login page
│   │   ├── Home.tsx         # Home page
│   │   ├── About.tsx        # About page
│   │   └── ForgotNickname.tsx  # Forgot nickname page
│   ├── services/            # API services
│   │   ├── api.ts           # Axios instance
│   │   ├── auth.ts          # Authentication service
│   │   ├── chat.ts          # Chat service
│   │   ├── contact.ts       # Contact form service
│   │   ├── socket.ts        # Socket.io client
│   │   ├── user.ts          # User service
│   │   └── wheel.ts         # Wheel service
│   ├── utils/               # Utility functions
│   │   ├── avatar.ts        # Avatar utilities
│   │   ├── colorSwap.ts     # Color swap effect
│   │   ├── cursor.ts        # Custom cursor effect
│   │   └── translations.ts  # Translation utilities
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

---

## 🧩 Component Architecture

The project follows **Atomic Design** principles:

### Atoms (Basic Building Blocks)

Located in `src/components/atoms/`:

- **Button**: Reusable button component with variants (primary, secondary, outline, danger)
- **Input**: Form input with validation and error states
- **Text**: Typography component with size, weight, and color variants
- **Image**: Image component with lazy loading and object-fit options

### Molecules (Simple Combinations)

Located in `src/components/molecules/`:

- **Header**: Navigation header with user menu and language switcher
- **Footer**: Footer with social links and copyright
- **Modal**: Reusable modal dialog component
- **UserMenu**: User profile dropdown menu

### Organisms (Complex Features)

Located in `src/components/organisms/`:

- **WebsocketCat**: Real-time cat state machine with terminal UI
- **SmartCat**: AI chatbot interface wrapper
- **ChatBot**: Chat interface with message bubbles
- **WheelOfFortuneCat**: Interactive wheel of fortune game
- **ActiveRewards**: Manages and applies active reward effects
- **ContactForm**: Contact form with validation
- **AboutMe**: About me section with tech stack
- **AboutProject**: Project information and documentation links
- **MyJourney**: Career journey timeline
- **CurvedBackground**: Animated curved background
- **AboutCurvedBackground**: Alternative curved background for About page
- **GoToAbout**: Call-to-action section
- **YarnBall**: Animated yarn ball reward effect

---

## 📄 Pages

### Login (`/`)
- Email and nickname input
- Form validation
- Login/registration
- Redirects to home if already authenticated

### Home (`/home`)
- Protected route (requires authentication)
- Features:
  - WebSocket Cat
  - SmartChat
  - Wheel of Fortune
  - Go to About section

### About (`/about`)
- Protected route (requires authentication)
- Features:
  - About Me section
  - About Project section
  - My Journey timeline
  - Contact Form

### Forgot Nickname (`/forgot-nickname`)
- Email input for nickname reminder
- Sends email with nickname

---

## 🔌 Services

### API Service (`services/api.ts`)

Axios instance with interceptors for:
- Request: Adds JWT token to headers
- Response: Handles errors and token expiration

### Authentication Service (`services/auth.ts`)

- `login(email, nickname)`: Login/register user
- `logout()`: Clear authentication
- `isAuthenticated()`: Check if user is logged in
- `getCurrentUser()`: Get current user from localStorage
- `getToken()`: Get JWT token

### Chat Service (`services/chat.ts`)

- `sendMessage(message, sessionId?, language?)`: Send message to AI
- `clearHistory(sessionId?)`: Clear conversation history

### Contact Service (`services/contact.ts`)

- `submitContactForm(data)`: Submit contact form

### User Service (`services/user.ts`)

- `getActiveRewards()`: Get all active rewards
- `getActiveAvatar()`: Get active avatar

### Wheel Service (`services/wheel.ts`)

- `spin(reward)`: Submit spin result
- `canSpin()`: Check cooldown status
- `getHistory()`: Get spin history

### Socket Service (`services/socket.ts`)

- Singleton Socket.io client instance
- Connects to backend WebSocket server

---

## 🎣 Custom Hooks

### `useChatBot`

Manages chat bot state and logic:
- Message state
- Input handling
- Send message
- Clear history
- Auto-scroll

### `useWebsocketCat`

Manages WebSocket cat state:
- Cat state (playing, sleeping, etc.)
- Sleep functionality
- Activity logs
- Countdown timer

### `useWheelOfFortune`

Manages wheel of fortune:
- Rotation state
- Spinning animation
- Cooldown management
- Confetti effects
- Modal state

---

## 🌐 Contexts

### I18n Context (`contexts/i18n.tsx`)

Internationalization context providing:
- `language`: Current language ('en' | 'sr')
- `setLanguage(lang)`: Change language
- `t(key)`: Translation function

**Usage:**
```tsx
const { t, language, setLanguage } = useI18n()
```

---

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS for styling with custom configuration:

**Custom Colors:**
- Primary: `#06B6D4` (cyan)
- Brand Pink: `#ec4899`, `#f472b6`, `#f9a8d4`
- Wheel Colors: 8 distinct colors for wheel segments

**Custom Fonts:**
- Sans: "Red Hat Text"
- Heading: "Barlow Semi Condensed"

**Configuration:**
See `tailwind.config.js` for full configuration.

### Global Styles

Located in `src/index.css`:
- Base styles
- Font definitions
- Color scheme
- Utility classes

---

## 🌍 Internationalization

### Translation Files

Located in `public/translations/`:
- `en.json`: English translations
- `sr.json`: Serbian translations

### Usage

```tsx
import { useI18n } from '../contexts/i18n'

const { t } = useI18n()
const text = t('key.path')
```

### Language Switching

Language is stored in localStorage and persists across sessions.

---

## 🛣 Routing

### Routes

Defined in `src/constants/index.ts`:

```typescript
export const ROUTES = {
  LOGIN: '/',
  HOME: '/home',
  ABOUT: '/about',
  FORGOT_NICKNAME: '/forgot-nickname',
}
```

### Protected Routes

Routes wrapped with `<ProtectedRoute>` require authentication:
- `/home`
- `/about`

If not authenticated, redirects to `/` (login).

### Route Configuration

Configured in `src/App.tsx` using React Router DOM.

---

## 📊 State Management

### Local State

Components use React hooks (`useState`, `useEffect`) for local state.

### Global State

- **Authentication**: Stored in localStorage (token, user)
- **Language**: Stored in localStorage
- **Wheel Cooldown**: Stored in localStorage

### Context API

- **I18n Context**: Global language state

---

## 🔗 API Integration

### API Base URL

Configured via environment variable:
```typescript
VITE_API_URL=http://localhost:3000/api
```

### Authentication

JWT tokens are automatically added to requests via Axios interceptors.

### Error Handling

- Network errors: Displayed to user
- 401 errors: Redirect to login
- Other errors: User-friendly error messages

---

## 🔌 WebSocket Integration

### Socket.io Client

Singleton instance in `services/socket.ts`:
```typescript
import getSocket from './services/socket'
const socket = getSocket()
```

### Events

**Client → Server:**
- `get-current-state`: Request current cat state
- `get-logs`: Request activity logs
- `activate-rest`: Put cat to sleep

**Server → Client:**
- `connect`: Connection established
- `cat-state-changed`: Cat state updated
- `cat-resting`: Cat is sleeping
- `rest-denied`: Rest request denied
- `cat-rest-ended`: Rest period ended
- `initial-logs`: Initial activity logs
- `new-log`: New activity log

See [Backend README](../mywebsite-backend/README.md) for detailed Socket.io documentation.

---

## 💻 Development

### Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5173` (Vite default port).

### Linting

```bash
npm run lint
```

### Type Checking

TypeScript type checking is done automatically by the IDE and during build.

### Hot Module Replacement (HMR)

Vite provides instant HMR for fast development experience.

---

## 🏗 Building

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Preview the production build locally.

---

## 🚀 Deployment

### AWS Amplify

The project is deployed on AWS Amplify with custom domain support.

#### Initial Setup

1. **Connect GitHub Repository:**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Select the branch (usually `main`)

2. **Configure Build Settings:**
   - Amplify will auto-detect the build settings from `amplify.yml`
   - The build configuration uses `npm install` and `npm run build`
   - Output directory: `dist`

3. **Set Environment Variables:**
   - Go to **App settings** → **Environment variables**
   - Add: `VITE_API_URL=https://api.meow-crafts.com/api`
   - (Replace with your actual backend API URL)

4. **Deploy:**
   - Amplify will automatically deploy on every push to the connected branch
   - Or manually trigger deployment from the console

#### Custom Domain Setup

The frontend is configured with a custom domain: `www.meow-crafts.com`

**Setup Process:**
1. **Add Domain in Amplify:**
   - Go to **Domain management** → **Add domain**
   - Enter your domain: `meow-crafts.com`
   - Amplify will automatically find your Route 53 hosted zone

2. **Configure Subdomain:**
   - Select subdomain: `www.meow-crafts.com` (or root domain)
   - Amplify will automatically add DNS records to Route 53
   - Wait for DNS propagation (5-60 minutes)

3. **SSL Certificate:**
   - Amplify automatically creates and manages SSL certificates
   - Certificate covers both `meow-crafts.com` and `www.meow-crafts.com`
   - Certificate validation happens automatically via DNS

4. **Verify:**
   - Check that the domain is active in Amplify Console
   - Test: `https://www.meow-crafts.com`

#### Build Configuration

The build is configured via `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

**Note:** Uses `npm install` instead of `npm ci` because `package-lock.json` is in `.gitignore`.

#### Environment Variables

**Production Environment Variables (AWS Amplify):**
- `VITE_API_URL=https://api.meow-crafts.com/api`

**Local Development:**
- Create `.env` file:
  ```env
  VITE_API_URL=http://localhost:3000/api
  ```

#### Educational Purpose Tags

To mark resources for educational purposes:
1. Go to **App settings** → **General** → **Tags**
2. Add tag: **Key**: `Purpose`, **Value**: `Educational`
3. Save

---

## 📚 Related Documentation

- [Wheel of Fortune Documentation](./WHEEL_OF_FORTUNE_DOCUMENTATION.md)
- [SmartChat Documentation](./SMARTCHAT_DOCUMENTATION.md)
- [Backend README](../mywebsite-backend/README.md)
- [Database Schema Documentation](../mywebsite-backend/database/SUPABASE_DATABASE_SCHEMA.md)

---

## 🎨 Design System

### Colors

**Primary:**
- Cyan: `#06B6D4`
- Cyan Hover: `#0891B2`

**Brand Pink:**
- Default: `#ec4899`
- Light: `#f472b6`
- Lighter: `#f9a8d4`

**Wheel Colors:**
- Pink: `#F76C9B`
- Blue: `#6EC1E4`
- Green: `#63D9A0`
- Yellow: `#F8D44C`
- Orange: `#FFA85C`
- Purple: `#B488E4`
- Teal: `#5ED3C3`
- Coral: `#F7A7A3`

### Typography

**Body Font:** Red Hat Text
- Weights: 300-700
- Used for: Body text, buttons, labels

**Heading Font:** Barlow Semi Condensed
- Weight: 600 (semibold)
- Used for: Headings (h1-h6)

### Spacing

Uses Tailwind's default spacing scale (4px base unit).

### Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## 🔧 Utilities

### Avatar Utilities (`utils/avatar.ts`)

- `getUserDefaultAvatar(userId)`: Generate default avatar based on user ID
- Avatar selection from 10 cat icons

### Color Swap (`utils/colorSwap.ts`)

- `applyColorSwap()`: Apply pink/blue color swap effect
- `removeColorSwap()`: Remove color swap effect
- Uses CSS filter: `hue-rotate(180deg)`

### Cursor (`utils/cursor.ts`)

- `applyCustomCursor()`: Apply cat paw cursor
- `removeCustomCursor()`: Remove custom cursor
- Intercepts history API for cursor persistence

---

## 🐛 Troubleshooting

### Common Issues

**API Connection Errors:**
- Verify `VITE_API_URL` is set correctly in AWS Amplify environment variables
- Check backend server is running and accessible
- Verify CORS configuration on backend (check `FRONTEND_URL` environment variable)
- Test API directly: `curl https://api.meow-crafts.com/health`

**CORS Errors:**
- Verify backend `FRONTEND_URL` environment variable matches your frontend domain
- Check that `FRONTEND_URL` doesn't have trailing slash (e.g., `https://www.meow-crafts.com` not `https://www.meow-crafts.com/`)
- Restart backend environment after changing `FRONTEND_URL`
- Check browser console for specific CORS error messages

**WebSocket Connection Issues:**
- Check backend WebSocket server is running
- Verify Socket.io version compatibility
- Check network/firewall settings
- Test WebSocket connection: Check browser Network tab → WS filter

**Build Errors in Amplify:**
- Check Amplify build logs for specific errors
- Verify `amplify.yml` configuration is correct
- Ensure `package.json` has all required dependencies
- Check that build output directory matches `amplify.yml` configuration (`dist`)

**Build Errors Locally:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check TypeScript errors: `npm run build`

**Translation Not Loading:**
- Verify translation files exist in `public/translations/`
- Check browser console for fetch errors
- Verify file paths are correct

**Custom Domain Issues:**
- Check DNS propagation: Use [dnschecker.org](https://dnschecker.org/)
- Verify DNS records in Route 53 match Amplify requirements
- Wait for SSL certificate validation (can take up to 24 hours)
- Check Amplify Console → Domain management for status

---

## 📝 Development Guidelines

### Component Structure

```tsx
import { useState, useEffect } from 'react'
import { useI18n } from '../contexts/i18n'

const Component = () => {
  const { t } = useI18n()
  const [state, setState] = useState()
  
  useEffect(() => {
    // Side effects
  }, [])
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  )
}

export default Component
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ChatBot.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useChatBot.ts`)
- **Services**: camelCase (e.g., `chat.ts`)
- **Utils**: camelCase (e.g., `avatar.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)

### File Organization

- One component per file
- Export default for components
- Named exports for utilities and services
- Index files for barrel exports

---

## 🔮 Future Enhancements

Potential improvements:
- Unit and integration tests
- E2E testing with Playwright/Cypress
- Storybook for component documentation
- Performance optimization (code splitting, lazy loading)
- PWA support
- Dark mode toggle
- More languages
- Accessibility improvements (ARIA labels, keyboard navigation)
- Animation library (Framer Motion)
- State management library (Zustand/Redux) if needed

---

## 📄 License

ISC

---

*Last updated: 2025*
