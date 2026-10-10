# Hi5 - Social Media Platform

Hi5 is a full-stack social media platform that allows users to share posts, engage in real-time interactions, and explore content through a modern, responsive interface.

---

## 🧠 Tech Stack

### 🔧 Backend

- **Spring Boot 3**
- **MongoDB**
- **JWT Authentication**
- **WebSockets** (Real-time messaging)
- **Spring Security**, OAuth2

### 🎨 Frontend

- **React 18**
- **Vite**
- **Tailwind CSS**
- **Material UI (MUI)**
- **Redux Toolkit**
- **Axios**
- **ApexCharts**

---

---

## Project Structure

```
Hi5/
├── client/   # Frontend application
├── server/   # Backend application
└── README.md # Project documentation
```

---

## Server

### Setup Instructions

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Configure environment variables:

   - Create an `application.yml` file in the `src/main/resources` directory.
   - Add the following properties:

   ```properties
   spring:
       data:
           mongodb:
           uri: mongodb://localhost:27017/hi5  # Replace 'hi5' with your actual database name if different

       # Email configuration for sending mails (e.g., verification, OTP)
       mail:
           username: your_email@gmail.com        # Replace with your actual email (e.g., 123alien@gmail.com)
           password: your_app_password_here      # Use your app-specific password (e.g., xxxx xxxx xxxx xxxx)

       security:
           oauth2:
           client:
               registration:
               github:
                   client-id: YOUR_GITHUB_CLIENT_ID
                   client-secret: YOUR_GITHUB_CLIENT_SECRET
               google:
                   clientId: YOUR_GOOGLE_CLIENT_ID
                   clientSecret: YOUR_GOOGLE_CLIENT_SECRET

       # JWT token configuration
       token:
       secret: YOUR_JWT_SECRET        # e.g., any long random string for signing JWTs

       # Token config for identification (e.g., 2FA, verification links)
       identification:
       token:
           secret: YOUR_IDENT_SECRET    # You can use the same as JWT secret or a different one
   ```

3. Build the project:
   ```
   ./mvnw clean install
   ```
4. Start the server:
   ```
   ./mvnw spring-boot:run
   ```

5. Format and check backend code (Spotless):
   ```bash
   ./mvnw spotless:apply   # Automatically format all Java files
   ./mvnw spotless:check   # Verify formatting in CI/CD
   ```

---

---

## Client

### Setup Instructions

1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Format and check frontend code (Prettier + Tailwind Plugin):
    ```bash
    npm run format         # Automatically format code and sort Tailwind classes
    npm run format:check   # Verify formatting in CI/CD
    ```

3.  Configure Vite server proxy for local development:

    - Open the `vite.config.js` (or vite.config.ts if using TypeScript).
    - Add or update the `server.proxy` section to forward API requests to your backend:

    ```properties
    export default {
    server: {
     port: 3000,
     strictPort: true,
     proxy: {
       "/api": {
         target: "http://localhost:8080",   // update here if nedded 
         changeOrigin: true,
         secure: false,
       },
       "/resource": {
         target: "http://localhost:8080",   // update here if nedded
         changeOrigin: true,
         secure: false,
       },
     },
    },
    };
    ```

4.  Start the development server:
    ```
    npm run dev
    ```

---

---

## 🖼️ UI Preview

---

### 🔐 Login Page  
![Login Page](https://i.postimg.cc/8zw3SSyH/login-Page.jpg)

---

### 📝 Signup Page  
![Signup Page](https://i.postimg.cc/rpmHyP3L/signup-Page.jpg)

---

### 🔑 Forgot Password Page  
![Forgot Password Page](https://i.postimg.cc/tJ5dxXnv/forgot-Password-Page.jpg)

---

### 🏠 Home Page  
![Home Page](https://i.postimg.cc/qM1XBvTz/homePage.jpg)

---

### 📸 Story Upload Modal  
![Story Upload Modal](https://i.postimg.cc/rwSVCKwp/story-Upload-Modal.jpg)

---

### 💬 Comments Modal  
![Comments Modal](https://i.postimg.cc/mkNjyYJw/comments-Modal.jpg)

---

### 🚨 Confirm Report Modal  
![Confirm Report Modal](https://i.postimg.cc/VkHRgLG3/confirm-Report-Modal.jpg)

---

### 🎞️ Reel Page  
![Reel Page](https://i.postimg.cc/fR3Xw7Cr/reelPage.jpg)

---

### ⬆️ Upload Reel Modal  
![Upload Reel Modal](https://i.postimg.cc/TP0TFFmM/upload-Reel-Modal.jpg)

---

### 💬 Chat Page  
![Chat Page](https://i.postimg.cc/GpHMnsTL/chatPage.jpg)

---

### 🔍 Search User Page  
![Search User Page](https://i.postimg.cc/xdDknwcX/search-User-Page.jpg)

---

### ⚙️ Setting Page  
![Setting Page](https://i.postimg.cc/d3LQ86hM/setting-Page.jpg)

---

### 🛡️ Admin Dashboard Page  
![Admin Dashboard Page](https://i.postimg.cc/jdbkn5mc/admin-Dashboard-Page.jpg)

---

### 📛 Content Control Page  
![Content Control Page](https://i.postimg.cc/N03xhCwD/content-Control-Page.jpg)

---

### 👤 User Control Page  
![User Control Page](https://i.postimg.cc/hjGKBsbJ/user-Control-Page.jpg)

---

### 🧑‍⚖️ Moderator Control Page  
![Moderator Control Page](https://i.postimg.cc/3RjmsK1r/moderator-Control-Page.jpg)

---