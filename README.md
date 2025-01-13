
# **Backend Application for EasyGenerator**

This repository contains the backend code for the **EasyGenerator** platform. It is built using **NestJS** with a focus on modularity, scalability, and robust authentication.

---

## **Table of Contents**

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Authentication Flow](#authentication-flow)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## **Tech Stack**

- **NestJS** - Progressive Node.js framework.
- **MongoDB** - Database for storing user data.
- **Mongoose** - ORM for MongoDB integration.
- **bcryptjs** - Library for hashing passwords.
- **JWT** - Token-based authentication.
- **Class-Validator** - Validation for DTOs.
- **Dotenv** - Manage environment variables.

---

## **Features**

1. **User Authentication**:
   - Signup and Login endpoints.
   - Access tokens for authentication.
   - Refresh tokens for session management.

2. **Protected Routes**:
   - `/users/me` route for retrieving user details.

3. **Validation**:
   - DTOs validated with class-validator.

4. **Scalable Structure**:
   - Modular structure for easy expansion.

5. **CORS Support**:
   - Configured to allow requests from frontend clients.

---

## **Setup and Installation**

### **1. Prerequisites**
- Node.js (v16 or above)
- MongoDB (running locally or on a cloud provider like MongoDB Atlas)

### **2. Clone the Repository**
```bash
git clone https://github.com/harshitanand/easygenerator-backend.git
cd easygenerator-backend
```

### **3. Install Dependencies**
```bash
npm install
```

### **4. Set Up Environment Variables**
Create a `.env` file in the root directory with the following variables:
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/easygenerator
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d
```

### **5. Run the Application**

#### Development Mode:
```bash
npm run start:dev
```

#### Production Mode:
```bash
npm run build
npm run start:prod
```

The server will run on `http://localhost:8000`.

---

## **Folder Structure**

```plaintext
src
├── auth                # Authentication module
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts # JWT-based authentication strategy
│   ├── dto             # DTOs for Signup and Login
│   │   ├── signup.dto.ts
│   │   └── login.dto.ts
├── users               # User management module
│   ├── schema          # User schema for MongoDB
│   │   └── user.schema.ts
│   ├── users.service.ts
├── app.module.ts       # Root module
├── main.ts             # Application entry point
```

---

## **Environment Variables**

| Variable Name             | Description                              |
|---------------------------|------------------------------------------|
| `PORT`                    | Port on which the application runs.     |
| `MONGO_URI`               | MongoDB connection URI.                 |
| `JWT_SECRET`              | Secret key for signing JWT tokens.      |
| `JWT_EXPIRES_IN`          | Expiration time for access tokens.      |
| `REFRESH_TOKEN_SECRET`    | Secret key for signing refresh tokens.  |
| `REFRESH_TOKEN_EXPIRES_IN`| Expiration time for refresh tokens.     |

---

## **Authentication Flow**

1. **Signup**:
   - User provides name, email, and password.
   - Password is hashed and stored in the database.
   - An access token is generated and sent to the user.

2. **Login**:
   - User provides email and password.
   - Password is validated, and an access token is generated.

3. **Protected Routes**:
   - JWT access tokens are used to authenticate requests to protected routes.
   - Example: `/users/me`.

4. **Token Refresh**:
   - Refresh tokens are sent as HTTP-only cookies.
   - A new access token is generated when the refresh endpoint is called.

---

## **Usage**

### **Available Scripts**

- **Start Development Server**:
  ```bash
  npm run start:dev
  ```

- **Start Production Server**:
  ```bash
  npm run build
  npm run start:prod
  ```

- **Linting**:
  ```bash
  npm run lint
  ```

### **Running with Docker**
If you prefer Docker, create a `Dockerfile` and a `docker-compose.yml` file. Here's an example:

**Dockerfile**:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "run", "start:prod"]
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/easygenerator
      - JWT_SECRET=your_jwt_secret
      - JWT_EXPIRES_IN=1h
      - REFRESH_TOKEN_SECRET=your_refresh_token_secret
      - REFRESH_TOKEN_EXPIRES_IN=7d
  mongo:
    image: mongo:4.4
    ports:
      - "27017:27017"
```

---

## **API Endpoints**

| Endpoint            | Method | Description                        |
|---------------------|--------|------------------------------------|
| `/users/signup`     | POST   | Create a new user.                |
| `/users/login`      | POST   | Authenticate and return tokens.   |
| `/users/me`         | GET    | Retrieve authenticated user data. |
| `/auth/refresh`     | POST   | Refresh access token.             |

---

## **Troubleshooting**

### **1. Cannot Connect to MongoDB**
- Ensure MongoDB is running locally or use a cloud-based MongoDB URI.

### **2. 401 Unauthorized on Protected Routes**
- Verify the `Authorization` header contains a valid JWT.
- Check if the token is expired.

### **3. CORS Errors**
- Make sure `enableCors` is configured in `main.ts`.

---

## **License**

This project is licensed under the MIT License.
