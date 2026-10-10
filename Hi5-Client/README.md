# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

<!-- folder structure -->

src/
├── assets/ # Static assets (fonts, images, videos, etc.)
│ ├── fonts/
│ ├── images/
│ ├── videos/
│ └── styles/ # Global CSS or SCSS styles (if any)
├── components/ # Reusable components
│ ├── common/ # Lower-level components (e.g., Button, Input, etc.)
│ │ ├── Button.jsx
│ │ ├── Input.jsx
│ │ └── ...
│ ├── layouts/ # Layouts (e.g., Navbar, Footer)
│ ├── auth/ # Auth-specific components (Login, Logout, Signup)
│ │ ├── Login.jsx
│ │ ├── Logout.jsx
│ │ ├── Signup.jsx
│ │ └── AuthForm.jsx # Shared between Login/Signup
│ ├── profile/ # Profile-related components
│ │ ├── Profile.jsx
│ │ ├── EditProfile.jsx
│ │ └── ...
│ └── skeletons/ # Skeleton loaders
│ ├── ProfileSkeleton.jsx
│ └── ...
├── context/ # React context for global state management
│ └── AuthContext.jsx # AuthContext to verify tokens and set user info
├── guards/ # Route guards
│ ├── AuthGuard.jsx # Guards private routes (only logged-in users)
│ ├── GuestGuard.jsx # Guards public routes (only logged-out users)
├── hooks/ # Custom React hooks
│ ├── useAuth.js # Hook for authentication-related logic
│ ├── useLocalStorage.js # Hook for localStorage operations
│ └── ...
├── redux/ # Redux-specific files
│ ├── store.js # Store configuration
│ ├── slices/ # Redux slices
│ │ ├── authSlice.js # Auth-related slice
│ │ ├── userSlice.js # User-specific data slice
│ │ └── ...
│ └── providers/
│ └── StoreProvider.jsx # Redux store provider
├── services/ # API services (e.g., Axios configuration)
│ ├── axios.config.js # Axios instance with interceptors
│ └── api.js # API methods (e.g., login, fetch user)
├── utils/ # Utility functions
│ ├── localStorage.js # Access token setter/getter/remover
│ ├── helpers.js # General utility functions
│ └── constants.js # App-wide constants
├── views/ # Main pages of the application
│ ├── LoginPage.jsx
│ ├── ProfilePage.jsx
│ ├── HomePage.jsx
│ └── ...
├── App.jsx # Main app component
├── index.js # Entry point
└── routes.js # Application routes configuration
