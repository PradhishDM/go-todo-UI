Full-Stack Todo Application
📌 Overview

A full-stack Todo application built with a modern production-ready architecture.
The app supports secure authentication, CRUD operations, and persistent storage, and is fully deployed on the cloud.

This project demonstrates real-world backend + frontend integration, authentication, deployment, and environment management.

🧱 Tech Stack
Frontend:
React
Modern component-based UI
Fetch API for HTTP requests
Environment-based configuration (.env)
Deployed on Vercel

Backend:
Go (Golang)
Chi router
RESTful API design
Firebase Authentication (JWT-based)
PostgreSQL database
Deployed on Render

Database:
PostgreSQL (Render-managed)
User-scoped todos
Persistent storage

🔐 Authentication
Authentication is handled using Firebase Auth
Users sign up and log in with email & password
Frontend sends Firebase ID Token to backend
Backend verifies token using Firebase Admin SDK
Each Todo is associated with the authenticated user
No credentials are hardcoded or stored in the repository.


✨ Features
User authentication (Login / Signup)
Create, read, update, delete Todos
Todos are user-specific
Secure API access using JWT tokens
Responsive UI with clean design
Deployed frontend + backend (end-to-end)
