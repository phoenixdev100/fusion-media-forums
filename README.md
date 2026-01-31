<div align="center">

# 🎮 Fusion Network Minecraft Server Forum

### *A Beautiful Minecraft-Themed Community Platform*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

<div align="center">

## 🌟 Overview

</div>

A beautiful Minecraft-themed forum website for the Fusion Network Minecraft server. This full-stack application provides a modern, responsive platform for server community members to connect, share, and engage with each other.

Built with **Next.js** on the frontend and **Node.js/Express** on the backend, this project showcases best practices in modern web development with a focus on user experience and scalability.

---

<div align="center">

## ✨ Features

</div>

### 🎨 User Interface
- 🎮 **Beautiful Minecraft-inspired design** with custom theming
- 📱 **Fully responsive** layout for all devices (mobile, tablet, desktop)
- 🌙 **Modern UI/UX** with smooth animations and transitions
- 🎨 **Custom Tailwind CSS** styling

### 👤 User Management
- 🔐 **Secure authentication** with JWT tokens
- 📝 **User registration and login**
- 👤 **User profiles** with customizable information
- 🔒 **Password hashing** with bcrypt

### 💬 Forum Features
- � **Forum categories** for organized discussions
- 📝 **Thread creation and management**
- 💬 **Post creation and replies**
- 🔍 **Search functionality**
- 📊 **Post statistics and tracking**

### 🖼️ Media Support
- 📷 **Image uploads** with optimization
- 🗂️ **File management** with Multer
- 🎨 **Image processing** with Sharp

### 🔧 Server Information
- 📊 **Server status page**
- � **Player statistics**
- 🌐 **Server IP display**

---

<div align="center">

## 🛠️ Tech Stack

</div>

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework for production |
| **React 18** | UI component library |
| **Tailwind CSS** | Utility-first CSS framework |
| **Axios** | HTTP client for API requests |
| **FontAwesome** | Icon library |
| **React Hook Form** | Form validation and management |
| **date-fns** | Date utility library |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 18** | JavaScript runtime |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB object modeling |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Multer** | File upload handling |
| **Sharp** | Image processing |
| **Morgan** | HTTP request logger |
| **Express Validator** | Request validation |

---

<div align="center">

## 📁 Project Structure

</div>

```
fusion-forums-with-media/
├── 📂 backend/
│   ├── 📂 config/          # Configuration files
│   ├── 📂 controllers/     # Route controllers
│   ├── 📂 middleware/      # Custom middleware
│   ├── 📂 models/          # Mongoose models
│   ├── 📂 routes/          # API routes
│   ├── 📂 scripts/         # Utility scripts
│   ├── 📂 utils/           # Helper functions
│   ├── 📂 uploads/         # User uploaded files
│   ├── 📄 server.js        # Express server entry point
│   ├── 📄 package.json     # Backend dependencies
│   └── 📄 vercel.json      # Vercel deployment config
│
├── 📂 frontend/
│   ├── 📂 components/      # React components
│   ├── 📂 context/         # React context providers
│   ├── 📂 pages/           # Next.js pages
│   ├── 📂 public/          # Static assets
│   ├── 📂 styles/          # Global styles
│   ├── 📂 utils/           # Utility functions
│   ├── 📂 fonts/           # Custom fonts
│   ├── 📂 images/          # Image assets
│   ├── 📄 next.config.js   # Next.js configuration
│   ├── 📄 tailwind.config.js # Tailwind configuration
│   └── 📄 package.json     # Frontend dependencies
│
├── 📄 README.md            # Project documentation
├── 📄 LICENSE              # MIT License
├── 📄 CONTRIBUTING.md      # Contribution guidelines
├── 📄 CODE_OF_CONDUCT.md   # Community guidelines
├── 📄 SECURITY.md          # Security policy
├── 📄 API.md               # API documentation
├── 📄 DEPLOYMENT.md        # Deployment guide
├── 📄 CHANGELOG.md         # Version history
└── 📄 .gitignore           # Git ignore rules
```

---

<div align="center">

## 🚀 Getting Started

</div>

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account) - [Get Started](https://www.mongodb.com/)
- **Git** - [Download](https://git-scm.com/)

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/phoenixdev100/fusion-media-forums.git
cd fusion-media-forums
```

#### 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

#### 3️⃣ Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

<div align="center">

## ⚙️ Configuration

</div>

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/fusion-forum
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fusion-forum

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# CORS
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
```

### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Server Information
NEXT_PUBLIC_SERVER_IP=fusion-network.xyz
```

---

<div align="center">

## 🏃 Running the Application

</div>

### Development Mode

#### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

#### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### Production Mode

#### Build the Frontend

```bash
cd frontend
npm run build
npm start
```

#### Run the Backend

```bash
cd backend
npm start
```

---

<div align="center">

## 🌐 Deployment

</div>

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deployment Overview

#### Backend Deployment
- **Recommended**: Railway, Render, or Heroku
- Set environment variables
- Deploy from GitHub repository

#### Frontend Deployment
- **Recommended**: Vercel (optimized for Next.js)
- Connect GitHub repository
- Configure environment variables
- Automatic deployments on push

---

<div align="center">

## 📚 API Documentation

</div>

For complete API documentation, see [API.md](API.md).

### Quick API Overview

#### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Forum Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/threads` - Get all threads
- `POST /api/threads` - Create new thread
- `GET /api/posts` - Get posts
- `POST /api/posts` - Create new post

---

<div align="center">

## 🤝 Contributing

</div>

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on:

- Code of Conduct
- Development process
- How to submit pull requests
- Coding standards
- Testing guidelines

---

<div align="center">

## 🔒 Security

</div>

Security is a top priority. Please see [SECURITY.md](SECURITY.md) for:

- Reporting security vulnerabilities
- Security best practices
- Supported versions

---

<div align="center">

## 📄 License

</div>

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**Copyright © 2026 Deepak**

---

<div align="center">

## 🙏 Acknowledgements

</div>

- **Minecraft** is a trademark of Mojang Studios
- This project is not affiliated with Mojang or Microsoft
- Thanks to all contributors and the open-source community
- Built with ❤️ for the Fusion Network community

---

<div align="center">

## 📞 Support & Contact

</div>

- 🐛 **Issues**: [GitHub Issues](https://github.com/phoenixdev100/fusion-media-forums/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/phoenixdev100/fusion-media-forums/discussions)
- 🌐 **Server**: fusion-network.xyz

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with 💚 by Deepak**

</div>
