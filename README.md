# Warehouse Management System

![License](https://img.shields.io/badge/License-ISC-blue.svg)

A full-stack warehouse management application built with Node.js, Express, MongoDB, and React. Provides user authentication, session management, and CRUD operations for inventory items.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- User registration and login with JWT authentication
- Session management with express-session and connect-mongo
- Secure password hashing with bcrypt
- CRUD operations for warehouse inventory items
- CORS configured for frontend-backend communication

## Tech Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Express Session
- **Frontend:** React (Create React App), React Router DOM, Axios

## Prerequisites
- Node.js v14+
- npm or yarn
- MongoDB Atlas account or local MongoDB instance

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Warehouse-main
   ```

2. Install dependencies for both backend and frontend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

## Environment Variables
Create a `.env` file in the `backend` directory with the following variables:
```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=5000
```

## Backend Setup
```bash
cd backend
npm start
```
The server will run at `http://localhost:5000`.

## Frontend Setup
```bash
cd frontend
npm start
```
The React app will run at `http://localhost:3000`.

## API Endpoints

### Auth
- **POST** `/register`: Register a new user  
  Request body: `{ "username": "user", "password": "pass" }`  
  Response: `{ "status": "ok" }`

- **POST** `/login`: Authenticate user and receive JWT  
  Request body: `{ "username": "user", "password": "pass" }`  
  Response: `{ "message": "Logged in", "token": "<jwt-token>" }`

- **POST** `/logout`: Destroy user session  

- **GET** `/session`: Check current session  

### Items
All item routes require an `Authorization: Bearer <jwt-token>` header.

- **POST** `/items`: Create a new item  
  Request body: `{ "name": "Item Name", "quantity": 10, "description": "Details" }`

- **GET** `/items`: Retrieve all items created by the authenticated user

## Project Structure
```
Warehouse-main/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
└── package.json
```

## Usage
1. Register a new account via the frontend.
2. Log in to receive a JWT token.
3. Manage your warehouse items through the UI.

## Contributing
Contributions are welcome! Please open issues and submit pull requests for improvements.

## License
This project is licensed under the ISC License.
