<div align="center">

# 📚 API Documentation

### *Fusion Network Forum REST API*

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Users](#user-endpoints)
  - [Forums](#forum-endpoints)
  - [Threads](#thread-endpoints)
  - [Posts](#post-endpoints)
  - [Uploads](#upload-endpoints)
  - [Server Status](#server-status-endpoints)
  - [Admin](#admin-endpoints)

---

<div align="center">

## 🌐 Overview

</div>

The Fusion Network Forum API is a RESTful API that provides programmatic access to forum functionality. All requests and responses are in JSON format.

**API Version**: 1.0  
**Protocol**: HTTPS (recommended for production)

---

<div align="center">

## 🔗 Base URL

</div>

### Development
```
http://localhost:5000/api
```

### Production
```
https://your-backend-domain.com/api
```

---

<div align="center">

## 🔐 Authentication

</div>

The API uses **JWT (JSON Web Tokens)** for authentication.

### Getting a Token

1. **Register** a new account or **login** with existing credentials
2. Receive a JWT token in the response
3. Include the token in subsequent requests

### Using the Token

Include the token in the `Authorization` header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Token Expiration

- **Expiration Time**: 7 days
- **Renewal**: Login again to get a new token

---

<div align="center">

## 📦 Response Format

</div>

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

<div align="center">

## ⚠️ Error Handling

</div>

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error occurred |

### Common Error Messages

```json
{
  "message": "Invalid credentials"
}
```

```json
{
  "message": "Token is not valid"
}
```

```json
{
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

<div align="center">

## 🚦 Rate Limiting

</div>

To prevent abuse, the API implements rate limiting:

- **Default**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per 15 minutes per IP

When rate limit is exceeded:
```json
{
  "message": "Too many requests, please try again later."
}
```

---

<div align="center">

## 📡 Endpoints

</div>

---

<div align="center">

### 🔑 Authentication Endpoints

</div>

#### Register User

Create a new user account.

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "player123",
  "email": "player@example.com",
  "password": "securePassword123",
  "minecraftUsername": "Player123" // Optional
}
```

**Validation Rules:**
- `username`: 3-20 characters
- `email`: Valid email format
- `password`: Minimum 8 characters
- `minecraftUsername`: Optional, alphanumeric

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "player123",
    "email": "player@example.com",
    "minecraftUsername": "Player123",
    "role": "user",
    "avatar": null,
    "joinDate": "2026-01-31T15:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "message": "User already exists with this email"
}
```

---

#### Login User

Authenticate and receive a JWT token.

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "identifier": "player123", // Username or email
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "player123",
    "email": "player@example.com",
    "role": "user",
    "avatar": null
  }
}
```

**Error Response (400):**
```json
{
  "message": "Invalid credentials"
}
```

---

#### Get Current User

Get authenticated user's information.

```http
GET /api/auth/user
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "player123",
  "email": "player@example.com",
  "minecraftUsername": "Player123",
  "role": "user",
  "avatar": null,
  "joinDate": "2026-01-31T15:30:00.000Z",
  "lastActive": "2026-01-31T16:00:00.000Z"
}
```

---

<div align="center">

### 👤 User Endpoints

</div>

#### Get User Profile

Get a user's public profile.

```http
GET /api/users/:id
```

**Success Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "player123",
  "minecraftUsername": "Player123",
  "avatar": "https://example.com/avatars/player123.jpg",
  "joinDate": "2026-01-31T15:30:00.000Z",
  "postCount": 42,
  "threadCount": 5
}
```

---

#### Update User Profile

Update authenticated user's profile.

```http
PUT /api/users/profile
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "minecraftUsername": "NewUsername",
  "bio": "I love playing on Fusion Network!",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "player123",
    "minecraftUsername": "NewUsername",
    "bio": "I love playing on Fusion Network!",
    "avatar": "https://example.com/new-avatar.jpg"
  }
}
```

---

<div align="center">

### 📁 Forum Endpoints

</div>

#### Get All Categories

Get all forum categories with subcategories.

```http
GET /api/forums
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Announcements",
    "description": "Official announcements from the Fusion Network team",
    "icon": "📢",
    "order": 1,
    "threadCount": 5,
    "postCount": 23,
    "subcategories": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Server News",
        "description": "Latest news about the server",
        "icon": "📰",
        "threadCount": 3,
        "postCount": 15
      }
    ]
  }
]
```

---

#### Get Category by ID

Get a specific forum category.

```http
GET /api/forums/:id
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Announcements",
  "description": "Official announcements",
  "icon": "📢",
  "order": 1,
  "subcategories": []
}
```

---

#### Get Category Threads

Get all threads in a category with pagination.

```http
GET /api/forums/:id/threads?page=1&limit=10
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Success Response (200):**
```json
{
  "category": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Announcements",
    "description": "Official announcements"
  },
  "threads": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Welcome to Fusion Network!",
      "author": {
        "_id": "507f1f77bcf86cd799439014",
        "username": "admin",
        "avatar": null
      },
      "category": "507f1f77bcf86cd799439011",
      "isPinned": true,
      "isLocked": false,
      "viewCount": 150,
      "replyCount": 5,
      "createdAt": "2026-01-31T15:30:00.000Z",
      "lastPost": {
        "author": "player123",
        "createdAt": "2026-01-31T16:00:00.000Z"
      }
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 3
  }
}
```

---

#### Create Category (Admin)

Create a new forum category.

```http
POST /api/forums
```

**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Request Body:**
```json
{
  "name": "New Category",
  "description": "Category description",
  "icon": "🎮",
  "order": 10,
  "parentCategory": null
}
```

**Success Response (201):**
```json
{
  "message": "Category created successfully",
  "category": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "New Category",
    "description": "Category description",
    "icon": "🎮",
    "order": 10
  }
}
```

---

<div align="center">

### 📝 Thread Endpoints

</div>

#### Get Thread by ID

Get a specific thread with its posts.

```http
GET /api/threads/:id?page=1&limit=20
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Posts per page (default: 20)

**Success Response (200):**
```json
{
  "thread": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Welcome to Fusion Network!",
    "content": "Thread content here...",
    "author": {
      "_id": "507f1f77bcf86cd799439014",
      "username": "admin",
      "avatar": null,
      "role": "admin"
    },
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Announcements"
    },
    "isPinned": true,
    "isLocked": false,
    "viewCount": 150,
    "createdAt": "2026-01-31T15:30:00.000Z"
  },
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "content": "Great server!",
      "author": {
        "_id": "507f1f77bcf86cd799439017",
        "username": "player123",
        "avatar": null
      },
      "createdAt": "2026-01-31T16:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "pages": 1
  }
}
```

---

#### Create Thread

Create a new thread in a category.

```http
POST /api/threads
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "title": "My New Thread",
  "content": "Thread content goes here...",
  "category": "507f1f77bcf86cd799439011"
}
```

**Validation Rules:**
- `title`: 5-200 characters
- `content`: Minimum 10 characters
- `category`: Valid category ID

**Success Response (201):**
```json
{
  "message": "Thread created successfully",
  "thread": {
    "_id": "507f1f77bcf86cd799439018",
    "title": "My New Thread",
    "content": "Thread content goes here...",
    "author": "507f1f77bcf86cd799439014",
    "category": "507f1f77bcf86cd799439011",
    "createdAt": "2026-01-31T17:00:00.000Z"
  }
}
```

---

#### Update Thread

Update an existing thread (author or admin only).

```http
PUT /api/threads/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "title": "Updated Thread Title",
  "content": "Updated content..."
}
```

**Success Response (200):**
```json
{
  "message": "Thread updated successfully",
  "thread": {
    "_id": "507f1f77bcf86cd799439018",
    "title": "Updated Thread Title",
    "content": "Updated content...",
    "updatedAt": "2026-01-31T17:30:00.000Z"
  }
}
```

---

#### Delete Thread

Delete a thread (author or admin only).

```http
DELETE /api/threads/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "message": "Thread deleted successfully"
}
```

---

<div align="center">

### 💬 Post Endpoints

</div>

#### Create Post

Create a new post in a thread.

```http
POST /api/posts
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "content": "This is my reply to the thread!",
  "thread": "507f1f77bcf86cd799439013"
}
```

**Validation Rules:**
- `content`: Minimum 1 character
- `thread`: Valid thread ID

**Success Response (201):**
```json
{
  "message": "Post created successfully",
  "post": {
    "_id": "507f1f77bcf86cd799439019",
    "content": "This is my reply to the thread!",
    "author": "507f1f77bcf86cd799439014",
    "thread": "507f1f77bcf86cd799439013",
    "createdAt": "2026-01-31T18:00:00.000Z"
  }
}
```

---

#### Update Post

Update an existing post (author or admin only).

```http
PUT /api/posts/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "content": "Updated post content..."
}
```

**Success Response (200):**
```json
{
  "message": "Post updated successfully",
  "post": {
    "_id": "507f1f77bcf86cd799439019",
    "content": "Updated post content...",
    "updatedAt": "2026-01-31T18:30:00.000Z"
  }
}
```

---

#### Delete Post

Delete a post (author or admin only).

```http
DELETE /api/posts/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "message": "Post deleted successfully"
}
```

---

<div align="center">

### 📤 Upload Endpoints

</div>

#### Upload Image

Upload an image file.

```http
POST /api/uploads/image
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `image`: Image file (JPEG, PNG, GIF)

**File Restrictions:**
- **Max Size**: 5MB
- **Allowed Types**: JPEG, PNG, GIF

**Success Response (200):**
```json
{
  "message": "Image uploaded successfully",
  "url": "https://example.com/uploads/image-123456.jpg"
}
```

---

<div align="center">

### 🖥️ Server Status Endpoints

</div>

#### Get Server Status

Get Minecraft server status.

```http
GET /api/server/status
```

**Success Response (200):**
```json
{
  "online": true,
  "players": {
    "online": 42,
    "max": 100
  },
  "version": "1.20.4",
  "motd": "Welcome to Fusion Network!"
}
```

---

#### Get Forum Statistics

Get forum statistics.

```http
GET /api/stats
```

**Success Response (200):**
```json
{
  "totalUsers": 1250,
  "totalThreads": 450,
  "totalPosts": 3200,
  "totalCategories": 12,
  "newestMember": {
    "username": "player123",
    "joinDate": "2026-01-31T15:30:00.000Z"
  }
}
```

---

<div align="center">

### 🔧 Admin Endpoints

</div>

All admin endpoints require authentication with an admin role.

#### Get All Users (Admin)

```http
GET /api/admin/users?page=1&limit=20
```

**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Success Response (200):**
```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "username": "player123",
      "email": "player@example.com",
      "role": "user",
      "joinDate": "2026-01-31T15:30:00.000Z",
      "lastActive": "2026-01-31T18:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "pages": 63
  }
}
```

---

#### Update User Role (Admin)

```http
PUT /api/admin/users/:id/role
```

**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Request Body:**
```json
{
  "role": "moderator"
}
```

**Success Response (200):**
```json
{
  "message": "User role updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439014",
    "username": "player123",
    "role": "moderator"
  }
}
```

---

#### Lock/Unlock Thread (Admin)

```http
PUT /api/admin/threads/:id/lock
```

**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Request Body:**
```json
{
  "isLocked": true
}
```

**Success Response (200):**
```json
{
  "message": "Thread locked successfully",
  "thread": {
    "_id": "507f1f77bcf86cd799439013",
    "isLocked": true
  }
}
```

---

<div align="center">

## 🧪 Testing the API

</div>

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "testuser",
    "password": "password123"
  }'

# Get forums (with token)
curl -X GET http://localhost:5000/api/forums \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the API endpoints into Postman
2. Set up environment variables for base URL and token
3. Use the Authorization tab to set Bearer token
4. Test each endpoint with sample data

---

<div align="center">

## 📝 Notes

</div>

- All timestamps are in ISO 8601 format (UTC)
- IDs are MongoDB ObjectIDs (24-character hex strings)
- Pagination is 1-indexed (first page is page 1)
- File uploads use multipart/form-data encoding
- All text fields support Markdown formatting

---

<div align="center">

## 🔄 Changelog

</div>

### Version 1.0.0 (2026-01-31)
- Initial API release
- Authentication endpoints
- Forum CRUD operations
- Thread and post management
- File upload support
- Admin functionality

---

<div align="center">

## 📞 Support

</div>

For API support:
- 📖 Check this documentation
- 🐛 Report issues on GitHub
- 💬 Join our Discord community

---

<div align="center">

**Made with 💚 by Deepak**

</div>
