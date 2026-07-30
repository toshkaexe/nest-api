# Blogger Platform API

REST API for a blogging platform built with NestJS, MongoDB, and JWT authentication.

## Project Overview (STAR)

### Situation

Developed a backend REST API for a blogging platform as part of a backend engineering course. The platform supports blogs, posts, comments, a like/dislike system, and full JWT-based authentication. The project was validated against an automated test suite that runs integration tests against a live deployed server.

### Task

Build a production-style REST API with the following requirements:
- CRUD operations for blogs, posts, and comments
- Like/dislike system with per-user status tracking and aggregated counters
- JWT authorization (access + refresh tokens) with token rotation
- Pagination, sorting, and input validation across all endpoints
- CQRS architecture (Command Query Responsibility Segregation) to separate write and read concerns

### Action

- Chose **NestJS + MongoDB (Mongoose)** for structured architecture and native CQRS support via `@nestjs/cqrs`
- Separated write logic (use-cases dispatched through `CommandBus`) from read logic (dedicated query repositories) to improve testability and maintainability
- Implemented the like/dislike system using a **separate collection** with a compound unique index `{entityId, userId}` to guarantee idempotency and prevent duplicate votes
- Used **atomic `$inc` operations** on counters to avoid race conditions when multiple users like simultaneously
- Built an `OptionalJwtAuthGuard` to support mixed endpoints where unauthorized users see `myStatus: "None"` while authorized users see their actual like status
- Solved a key architectural challenge: list endpoints (`GET /posts`, `GET /blogs/:id/posts`) initially returned zero counts because the mapper only read embedded document fields. Refactored to aggregate real-time like data from the `PostLike` collection at the query-repository level
- Applied input validation with `class-validator` + `class-transformer`, including whitespace trimming to reject empty-looking inputs

### Result

- All automated integration tests pass across every module (users, auth, blogs, posts, comments, likes)
- Gained hands-on experience with CQRS pattern, understanding when command/query separation adds value vs. overhead
- Learned the trade-offs between storing aggregated data in documents (fast reads, stale data risk) vs. computing on the fly (always accurate, higher read cost)
- In a production setting, would introduce Redis caching for like counters and event-driven updates instead of synchronous `$inc` to reduce database load at scale


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
