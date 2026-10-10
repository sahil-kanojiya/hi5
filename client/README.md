# Hi5 - Frontend Client

The frontend client for **Hi5**, built with **React 18**, **Vite 6**, **Tailwind CSS**, and **Redux Toolkit**.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Material UI (MUI)](https://mui.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Real-Time Communication**: [STOMP / SockJS](https://stomp-js.github.io/)
- **Charts**: [ApexCharts](https://apexcharts.com/) / `react-apexcharts`
- **Formatting & Linting**: [Prettier](https://prettier.io/) with Tailwind Plugin & [ESLint](https://eslint.org/)

---

## 📁 Directory Structure

```
client/
├── public/                 # Static public assets
├── src/
│   ├── assets/             # Images, SVGs, and brand assets
│   ├── components/         # Reusable React components
│   │   ├── auth/           # OAuth2 and login/signup handlers
│   │   ├── chart/          # Analytics charts
│   │   ├── chat/           # Real-time chat box & messages
│   │   ├── comment/        # Post/Reel comment list & modal
│   │   ├── common/         # Common UI elements (NotFound, TimeAgo)
│   │   ├── layout/         # Main layout, Sidebar, Mobile Navbar
│   │   ├── modal/          # Reusable confirmation modals
│   │   ├── moderation/     # Content & user moderation dashboard
│   │   ├── post/           # Post cards & post creation
│   │   ├── preloader/      # Full-screen preloader animations
│   │   ├── profile/        # Connections, requests & profile tabs
│   │   ├── providers/      # Context providers (Auth, Theme, Store, Toast)
│   │   ├── reel/           # Reel player & reel upload modal
│   │   ├── skeletons/      # Loading skeleton components
│   │   ├── story/          # Story viewer, user avatars & creation
│   │   └── userSearch/     # User search cards
│   ├── guards/             # Route protection guards (AuthGuard, GuestGuard, RoleGuard)
│   ├── hooks/              # Custom React hooks (useLogin, useSignUp, useLogout, etc.)
│   ├── redux/              # Redux store & slices (authSlice, userSlice, themeSlice)
│   ├── services/           # Axios HTTP client & API service endpoints
│   ├── socket/             # WebSocket provider and connection management
│   ├── utils/              # Storage helpers, constants & formatting utils
│   ├── views/              # Page views (Home, Profile, Reels, Chat, Settings, Admin)
│   ├── App.jsx             # Main application component
│   ├── Routes.jsx          # Application routing configuration
│   ├── index.css           # Tailwind directives & custom global styles
│   └── main.jsx            # Application entry point
├── .env.example            # Environment variables template
├── eslint.config.js        # ESLint flat configuration
├── index.html              # HTML template
├── nginx.conf              # Production Nginx configuration
├── package.json            # Node dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite bundler configuration
```

---

## 🚀 Available Scripts

In the `client` directory, you can run:

| Command                | Description                                                            |
| ---------------------- | ---------------------------------------------------------------------- |
| `npm run dev`          | Starts the Vite development server with HMR on `http://localhost:3000` |
| `npm run build`        | Builds the production bundle to the `dist/` directory                  |
| `npm run preview`      | Locally preview the production build                                   |
| `npm run lint`         | Runs ESLint to check for code quality and syntax issues                |
| `npm run format`       | Formats all code files using Prettier and sorts Tailwind CSS classes   |
| `npm run format:check` | Checks code formatting without modifying files (used in CI/CD)         |

---

## ⚙️ Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Adjust configuration values as needed:
   ```properties
   VITE_HI5_API_REQUEST_TIMEOUT=100000000
   ```
