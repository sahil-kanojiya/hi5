# Contributing to Hi5

Thank you for your interest in contributing to **Hi5**! We welcome all contributions from bug fixes to new features.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards & Formatting](#coding-standards--formatting)
5. [Git & Commit Conventions](#git--commit-conventions)
6. [Submitting a Pull Request](#submitting-a-pull-request)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by the [Hi5 Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## 🚀 Getting Started

### Prerequisites

- **Java 21** (JDK 21) & Maven (or included `./mvnw` wrapper)
- **Node.js** (v18+ or v20+) & npm (v9+)
- **MongoDB** (v6.0+ or v7.0+, or via Docker)
- **Docker & Docker Compose** (optional, recommended for DB)

### Clone & Setup

```bash
# Clone the repository
git clone https://github.com/Sahil-Kanojiya98/Hi5.git
cd Hi5

# Start local MongoDB (optional)
docker compose -f docker-compose.dev.yml up -d

# Setup Frontend
cd client
npm install

# Setup Backend
cd ../server
./mvnw clean install
```

---

## 🛠️ Development Workflow

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
2. Make your code changes.
3. Verify that all tests and formatters pass before committing.

---

## 🎨 Coding Standards & Formatting

### Backend (`server/`)
We use **Spotless** with Google Java Format (AOSP style, 4-space indentation):
```bash
cd server
./mvnw spotless:apply   # Automatically format code
./mvnw spotless:check   # Verify formatting
./mvnw test-compile     # Ensure clean compilation
```

- **Naming Conventions**:
  - Packages: all lowercase (`com.app.hi5.service`, `com.app.hi5.model.enums`)
  - Classes: PascalCase (`PostController`, `NotificationService`)
  - Methods & Variables: camelCase (`findUserById`, `isEmailVerified`)
  - Constants: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

### Frontend (`client/`)
We use **Prettier** with `prettier-plugin-tailwindcss` and **ESLint**:
```bash
cd client
npm run format         # Automatically format files and sort Tailwind CSS classes
npm run format:check   # Verify formatting
npm run build          # Validate production build
```

- **Naming Conventions**:
  - React Components: PascalCase (`CommentModal.jsx`, `Sidebar.jsx`)
  - Hooks: camelCase starting with `use` (`useAuth.jsx`, `useLogin.jsx`)
  - Utilities & Helpers: camelCase (`api.js`, `localStorage.js`)

---

## 💬 Git & Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Formatting, missing semi colons, etc (no production code change)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding or updating tests
- `chore:` Changes to the build process or auxiliary tools and libraries

---

## 🚀 Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request against the `main` branch.
3. Fill out the PR template with a clear description of the changes and any issue references.
4. Ensure all CI checks pass.
