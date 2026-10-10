# Hi5 - Backend Server

The backend REST API and real-time WebSocket server for **Hi5**, built with **Spring Boot 3.3.2**, **Java 21**, **Spring Security (OAuth2 + JWT)**, and **MongoDB**.

---

## 🛠️ Tech Stack

- **Framework**: [Spring Boot 3.3.2](https://spring.io/projects/spring-boot)
- **Language**: Java 21 (LTS)
- **Database**: [MongoDB](https://www.mongodb.com/) (Spring Data MongoDB)
- **Authentication**: JWT (JSON Web Tokens via `jjwt`), OAuth2 (GitHub & Google)
- **Real-Time Communication**: Spring WebSocket & STOMP Message Broker
- **Email Service**: Spring Boot Mail (`JavaMailSender`)
- **Code Formatting**: [Spotless Maven Plugin](https://github.com/diffplug/spotless) (Google Java Format AOSP style)
- **Build Tool**: Apache Maven (`./mvnw`)

---

## 📁 Package Structure

```
server/src/main/java/com/app/hi5/
├── config/              # Application, Cache, Mongo, Security & WebSocket configurations
├── controller/          # REST API controllers (Auth, User, Post, Reel, Story, Chat, Admin, etc.)
├── dto/                 # Data Transfer Objects
│   ├── enums/           # FollowStatus, LikeStatus, ReportStatus, SaveStatus
│   ├── payload/         # WebSocket and Analytics payloads
│   ├── request/         # Incoming API request payloads
│   └── response/        # Outgoing API response structures
├── exceptions/          # Custom runtime exceptions
│   └── handler/         # Global exception handler (@ControllerAdvice)
├── filter/              # JWT Auth token filter
├── model/               # MongoDB entity documents (User, Post, Reel, Story, Chat, Comment, etc.)
│   └── enums/           # Entity enums (Role, Gender, IdentityProvider, ReportReason, etc.)
├── repository/          # Spring Data Mongo repositories
├── security/            # UserDetails service, Auth entry points, OAuth2 handlers
│   └── oauth2/          # OAuth2 user services and provider userInfo factories
├── service/             # Business logic layer
└── utility/             # File storage, conversion, validation & email templates
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 21** (JDK 21) installed
- **MongoDB** running locally on port `27017` (or via Docker)

### Build & Run

```bash
# Navigate to server directory
cd server

# Build the project
./mvnw clean install

# Run the Spring Boot application
./mvnw spring-boot:run
```

---

## ⚙️ Configuration & Environment Variables

The application is configured via `src/main/resources/application.yaml` with environment variable overrides:

| Variable | Default Value | Description |
| --- | --- | --- |
| `MONGODB_URI` | `mongodb://localhost:27017/hi5` | MongoDB connection URI |
| `SERVER_PORT` | `8080` | Server HTTP port |
| `MAIL_HOST` | `smtp.gmail.com` | SMTP host |
| `MAIL_PORT` | `587` | SMTP port |
| `MAIL_USERNAME` | `email` | SMTP username |
| `MAIL_PASSWORD` | `app_password` | SMTP password |
| `GITHUB_CLIENT_ID` | `github-client-id` | GitHub OAuth2 client ID |
| `GITHUB_CLIENT_SECRET` | `github-client-secret` | GitHub OAuth2 client secret |
| `GOOGLE_CLIENT_ID` | `google-client-id` | Google OAuth2 client ID |
| `GOOGLE_CLIENT_SECRET` | `google-client-secret` | Google OAuth2 client secret |
| `TOKEN_SECRET` | *(HMAC-SHA256 hex key)* | JWT signing secret |
| `TOKEN_EXPIRATION` | `60 minutes` | JWT validity duration |
| `IDENTIFICATION_TOKEN_SECRET` | *(HMAC-SHA256 hex key)* | OTP token signing secret |
| `IDENTIFICATION_TOKEN_EXPIRATION` | `10 minutes` | OTP token validity duration |
| `OTP_EXPIRATION` | `5 minutes` | OTP code expiration time |

---

## 🎨 Code Quality & Formatting

We use Spotless to enforce consistent Java formatting across the backend:

```bash
# Automatically format all Java files
./mvnw spotless:apply

# Verify formatting compliance (used in CI/CD)
./mvnw spotless:check

# Compile and run test suite
./mvnw test
```
