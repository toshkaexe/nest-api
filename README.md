# Blogger Platform API

REST API for a blogging platform built with NestJS, MongoDB, and JWT authentication.

## Features

- **Users** — CRUD operations with Basic Auth protection, pagination, search by login/email
- **Blogs** — create, update, delete blogs with sorting and pagination
- **Posts** — manage posts within blogs, extended likes info
- **Authentication** — JWT access tokens (10min expiry), login via email or username
- **Registration** — email confirmation flow with UUID codes (1hr expiry)
- **Password Recovery** — email-based recovery with confirmation codes
- **Rate Limiting** — 5 requests per 10 seconds on auth endpoints (per IP)
- **Email Service** — confirmation and recovery emails via SMTP (mail.ru)

## Tech Stack

- **Framework:** NestJS (Node.js + TypeScript)
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (access tokens), Basic Auth (admin endpoints)
- **Validation:** class-validator + class-transformer
- **Email:** Nodemailer (SMTP)
- **Rate Limiting:** @nestjs/throttler
- **Docs:** Swagger (auto-generated)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally or in the cloud

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
ACCESS_JWT_SECRET=your_access_jwt_secret
REFRESH_JWT_SECRET=your_refresh_jwt_secret
MONGO_URI_CLOUD=mongodb://localhost:27017
DB_NAME=nest_base
EMAIL=your_email@mail.ru
EMAIL_PWS=your_email_password
AUTH_LOGIN=admin
AUTH_PASSWORD=qwerty
```

### Running

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Testing

```bash
# e2e tests
npm run test:e2e
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | Sign in, returns JWT |
| POST | /auth/registration | Register new user |
| POST | /auth/registration-confirmation | Confirm email |
| POST | /auth/registration-email-resending | Resend confirmation email |
| POST | /auth/password-recovery | Request password reset |
| POST | /auth/new-password | Set new password |
| GET | /auth/me | Get current user info |

### Users (Basic Auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | Get all users (paginated) |
| POST | /users | Create user |
| DELETE | /users/:id | Delete user |

### Blogs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /blogs | Get all blogs |
| POST | /blogs | Create blog |
| GET | /blogs/:id | Get blog by ID |
| PUT | /blogs/:id | Update blog |
| DELETE | /blogs/:id | Delete blog |
| POST | /blogs/:id/posts | Create post for blog |
| GET | /blogs/:id/posts | Get posts for blog |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /posts | Get all posts |
| POST | /posts | Create post |
| GET | /posts/:id | Get post by ID |
| PUT | /posts/:id | Update post |
| DELETE | /posts/:id | Delete post |

### Testing
| Method | Endpoint | Description |
|--------|----------|-------------|
| DELETE | /testing/all-data | Clear all database collections |

## Swagger

Available at `/swagger-doc` when the app is running.
