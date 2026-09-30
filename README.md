# Task Reminder System

<p align="center">
  <strong>A TypeScript + Express API for authenticated task management and timezone-aware reminders.</strong>
</p>

<p align="center">
  <a href="https://github.com/updpujan/Task-Reminder-System"><img src="https://img.shields.io/badge/status-in%20development-orange" alt="Project status: in development"></a>
  <img src="https://img.shields.io/badge/Node.js-ESM-339933?logo=node.js&logoColor=white" alt="Node.js ESM">
  <img src="https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express 5">
  <img src="https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

## Contents

- [What this project does](#what-this-project-does)
- [Features](#features)
- [How the system works](#how-the-system-works)
- [Technology and repository layout](#technology-and-repository-layout)
- [Prerequisites](#prerequisites)
- [Installation and local setup](#installation-and-local-setup)
- [Environment variables](#environment-variables)
- [Database and migrations](#database-and-migrations)
- [API documentation](#api-documentation)
- [API examples](#api-examples)
- [Reminder behavior](#reminder-behavior)
- [Development commands](#development-commands)
- [Troubleshooting](#troubleshooting)
- [Security notes](#security-notes)
- [Project status and contributing](#project-status-and-contributing)

## What this project does

Task Reminder System is a backend service for:

- registering users and authenticating them with JWT access tokens;
- creating, reading, updating, and deleting a user's tasks;
- attaching a reminder schedule to each task;
- calculating the next reminder occurrence in the task's timezone;
- exposing administrator-only views of all users and tasks; and
- checking application and PostgreSQL health.

The service is an API-first backend. It does not include a web frontend in this repository.

## Features

- **Authentication:** registration, password hashing through `bcrypt`, login, and JWT verification.
- **Authorization:** authenticated user routes plus role-based administrator routes.
- **Task lifecycle:** create, list, retrieve by ID, patch, and delete tasks.
- **Reminder scheduling:** one-time and recurring schedules, timezone conversion with Luxon, and a cron worker.
- **OpenAPI UI:** Swagger UI generated from route annotations and available at `/api-docs`.
- **Versioned schema changes:** ordered, reversible SQL migrations managed by dbmate.
- **Quality tools:** TypeScript build, ESLint, Prettier, Husky, and lint-staged.

## How the system works

### Request and runtime flow

```mermaid
flowchart LR
    Client["API client<br/>curl / Postman / frontend"] -->|HTTP JSON| Express["Express application"]
    Express --> Docs["Swagger UI<br/>/api-docs"]
    Express --> Auth["Auth routes"]
    Express --> Tasks["Task routes"]
    Express --> Admin["Admin routes"]
    Auth --> JWT["JWT token"]
    Tasks --> Middleware["JWT middleware<br/>and validation"]
    Admin --> Role["Admin role middleware"]
    Middleware --> Services["Application services"]
    Role --> Services
    Services --> Repositories["Repositories"]
    Repositories --> PostgreSQL[("PostgreSQL")]
    Scheduler["node-cron<br/>every minute at second 10"] --> ReminderService["Reminder service"]
    ReminderService --> PostgreSQL
    ReminderService --> Console["Application logs"]
```

### Creating and processing a reminder

```mermaid
sequenceDiagram
    participant C as Client
    participant A as Express API
    participant M as JWT middleware
    participant S as Task service
    participant DB as PostgreSQL
    participant W as Reminder scheduler

    C->>A: POST /createTask + Bearer token
    A->>M: Verify JWT and user identity
    M-->>A: Authenticated request
    A->>S: Validate task and reminder fields
    S->>DB: Insert task and calculate next_reminder_at
    DB-->>S: Transaction result
    S-->>C: 201 Task Created Successfully
    W->>DB: Find due active reminders
    DB-->>W: Due tasks
    W->>W: Log reminder and calculate next occurrence
    W->>DB: Disable one-time reminder or save next occurrence
```

### Database relationships

```mermaid
erDiagram
    USERS ||--o{ TASKS : owns
    USERS {
        integer id PK
        varchar name
        varchar email UK
        varchar role
        varchar password
        timestamptz created_at
        timestamp updated_at
    }
    TASKS {
        integer task_id PK
        integer user_id FK
        varchar task_name
        text task_description
        varchar status
        date reminder_date
        time reminder_time
        varchar timezone
        varchar repeat
        boolean is_active
        timestamptz next_reminder_at
        timestamptz created_at
        timestamp updated_at
    }}
```

`reminders` was used in the early migration history, then merged into `tasks` by
`004_merge_reminders_into_tasks.sql`. A fresh database ends with `users` and
`tasks`, plus dbmate's `schema_migrations` table.

## Technology and repository layout

| Area                   | Location                                                                 | Responsibility                                                    |
| ---------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| HTTP bootstrap         | [`src/server.ts`](./src/server.ts)                                       | Loads configuration, checks PostgreSQL, starts HTTP and scheduler |
| Express application    | [`src/app.ts`](./src/app.ts)                                             | JSON parsing, Swagger UI, and route registration                  |
| Routes                 | [`src/Routes/`](./src/Routes/)                                           | API paths and OpenAPI annotations                                 |
| Controllers            | [`src/controller/`](./src/controller/)                                   | HTTP request/response handling                                    |
| Application services   | [`src/application/`](./src/application/)                                 | Authentication, task, and reminder use cases                      |
| Repositories           | [`src/repository/`](./src/repository/)                                   | PostgreSQL queries                                                |
| Middleware             | [`src/middleware/`](./src/middleware/)                                   | Validation, JWT, and admin authorization                          |
| Database configuration | [`src/config/databaseConnection.ts`](./src/config/databaseConnection.ts) | PostgreSQL connection pool and health query                       |
| Reminder worker        | [`src/jobs/reminderSchedular.ts`](./src/jobs/reminderSchedular.ts)       | Periodic reminder processing                                      |
| Migrations             | [`database/migrations/`](./database/migrations/)                         | Ordered dbmate up/down SQL files                                  |
| Schema snapshot        | [`db/schema.sql`](./db/schema.sql)                                       | PostgreSQL schema dump                                            |

## Prerequisites

- Node.js compatible with the repository's current TypeScript and dependency versions.
- npm.
- PostgreSQL (the checked-in schema was dumped from PostgreSQL 18.6).
- [dbmate](https://github.com/amacneil/dbmate) installed and available on `PATH`.
- A PostgreSQL database and a role that can create and alter its tables.

## Installation and local setup

```bash
git clone https://github.com/updpujan/Task-Reminder-System.git
cd Task-Reminder-System
npm install
```

Create a local `.env` file (it is ignored by Git):

```dotenv
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=change-me
DB_DATABASE=task_reminder

JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRE_ACCESS_TOKEN=1h
```

Create the database if it does not exist, then configure dbmate's connection:

```bash
createdb task_reminder
export DATABASE_URL="postgres://postgres:change-me@localhost:5432/task_reminder?sslmode=disable"
npm run db:migrate
```

Start the development server:

```bash
npm run dev
```

The default local URLs are:

- API: `http://localhost:3000`
- OpenAPI/Swagger UI: `http://localhost:3000/api-docs`
- Health check: `http://localhost:3000/health`

Verify the service:

```bash
curl http://localhost:3000/health
```

Expected healthy response:

```json
{
  "status": "healthy",
  "services": {
    "server": "up",
    "database": "up"
  }
}
```

## Environment variables

| Variable                  | Required   | Example          | Purpose                                               |
| ------------------------- | ---------- | ---------------- | ----------------------------------------------------- |
| `PORT`                    | Yes        | `3000`           | HTTP port used by the server                          |
| `DB_HOST`                 | Yes        | `localhost`      | PostgreSQL host used by `pg`                          |
| `DB_PORT`                 | Yes        | `5432`           | PostgreSQL port used by `pg`                          |
| `DB_USER`                 | Yes        | `postgres`       | PostgreSQL user used by `pg`                          |
| `DB_PASSWORD`             | Yes        | `change-me`      | PostgreSQL password used by `pg`                      |
| `DB_DATABASE`             | Yes        | `task_reminder`  | PostgreSQL database used by `pg`                      |
| `JWT_SECRET`              | Yes        | a random secret  | Signs and verifies access tokens                      |
| `JWT_EXPIRE_ACCESS_TOKEN` | Yes        | `1h`             | `jsonwebtoken` expiration value, such as `1h` or `7d` |
| `DATABASE_URL`            | For dbmate | `postgres://...` | Connection URL consumed by dbmate                     |

The application and dbmate currently use different database configuration
interfaces: the application reads `DB_*` variables, while dbmate conventionally
reads `DATABASE_URL`. Keep both configured for local development and deployment.

## Database and migrations

Migration files are in [`database/migrations/`](./database/migrations/) and use
dbmate's `-- migrate:up` and `-- migrate:down` sections.

| Migration                                | Change                                                      |
| ---------------------------------------- | ----------------------------------------------------------- |
| `001_create_users.sql`                   | Creates users, roles, and unique email constraint           |
| `002_create_tasks.sql`                   | Creates tasks linked to users                               |
| `003_create_reminders.sql`               | Creates the original separate reminders table               |
| `004_merge_reminders_into_tasks.sql`     | Moves reminder fields onto tasks and removes `reminders`    |
| `005_add_column_updatedAt.sql`           | Adds update timestamps and triggers                         |
| `006_deleteColumn_is_delete_tasks.sql`   | Removes the old `is_deleted` column                         |
| `007_addColumn_nextReminderAt_tasks.sql` | Adds the next scheduled occurrence                          |
| `008_alter_tasks_repeat.sql`             | Adds weekday repeat values and updates the check constraint |

Apply all pending migrations:

```bash
export DATABASE_URL="postgres://postgres:change-me@localhost:5432/task_reminder?sslmode=disable"
npm run db:migrate
```

Before changing a shared or production database:

1. Back up the database.
2. Review the migration's `up` and `down` SQL.
3. Apply it in a staging environment first.
4. Confirm the application and `/health` endpoint still work.

Do not edit an already-applied migration. Add a new numbered migration so the
schema history remains reproducible. `db/schema.sql` is a snapshot, not a
replacement for the migration history.

## API documentation

Swagger UI is generated from the OpenAPI comments in the route files and is
served at:

```text
http://localhost:3000/api-docs
```

The OpenAPI definition is assembled in
[`src/config/swagger.ts`](./src/config/swagger.ts). Use Swagger UI's **Authorize**
button with the JWT returned by `/login` to try protected endpoints.

### Authentication model

1. Register or log in.
2. Copy the returned JWT.
3. Send it on protected requests:

```http
Authorization: Bearer <access-token>
```

Admin endpoints require a token whose `role` is `admin`.

## API examples

Set a shell variable for convenience:

```bash
API_URL=http://localhost:3000
```

### Register

```bash
curl -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pujan Upadhyay",
    "email": "pujan@example.com",
    "password": "Pujan@123",
    "role": "user"
  }'
```

### Login and save the token

```bash
curl -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pujan@example.com",
    "password": "Pujan@123"
  }'
```

The response contains a JWT in `token`. Export it for the remaining examples:

```bash
TOKEN="<token returned by /login>"
```

### Create a task with a reminder

```bash
curl -X POST "$API_URL/createTask" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "task_name": "Complete Node.js backend project",
    "task_description": "Finish the task and reminder API",
    "reminder_date": "2026-10-01",
    "reminder_time": "18:30:00",
    "timezone": "Asia/Kathmandu",
    "repeat": "day"
  }'
```

Successful creation returns:

```json
{
  "success": true,
  "message": "Task Created Successfully"
}
```

### Read, update, and delete tasks

```bash
# List the authenticated user's tasks
curl "$API_URL/getAllUserTasks" \
  -H "Authorization: Bearer $TOKEN"

# Read one task
curl "$API_URL/gettask/9" \
  -H "Authorization: Bearer $TOKEN"

# Partially update one task
curl -X PATCH "$API_URL/updateTask/9" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "task_name": "Complete the backend",
    "repeat": "monday",
    "is_active": true
  }'

# Delete one task (successful response has no body)
curl -X DELETE "$API_URL/deleteTask/9" \
  -H "Authorization: Bearer $TOKEN"
```

### Administrator endpoints

The token must belong to an `admin` user:

```bash
curl "$API_URL/admin/getAllTasks" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

curl "$API_URL/admin/getAllUsers" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Endpoint summary

| Method   | Path                 | Auth      | Purpose                          |
| -------- | -------------------- | --------- | -------------------------------- |
| `GET`    | `/health`            | None      | Check server and database health |
| `POST`   | `/register`          | None      | Register a user                  |
| `POST`   | `/login`             | None      | Return a JWT                     |
| `POST`   | `/createTask`        | User JWT  | Create a task and reminder       |
| `GET`    | `/getAllUserTasks`   | User JWT  | List the current user's tasks    |
| `GET`    | `/gettask/:id`       | User JWT  | Read one owned task              |
| `PATCH`  | `/updateTask/:id`    | User JWT  | Update one owned task            |
| `DELETE` | `/deleteTask/:id`    | User JWT  | Delete one owned task            |
| `GET`    | `/admin/getAllTasks` | Admin JWT | List all tasks                   |
| `GET`    | `/admin/getAllUsers` | Admin JWT | List registered users            |

For the authoritative request schemas, response examples, and status codes,
use `/api-docs` and the annotations in [`src/Routes/`](./src/Routes/).

## Reminder behavior

- The server starts the scheduler only after the database connection succeeds.
- `node-cron` invokes the reminder processor at second 10 of every minute.
- Due reminders are read from `tasks.next_reminder_at`.
- One-time reminders (`repeat: "off"`) are cleared after being logged.
- Recurring reminders are recalculated with Luxon in the task's `timezone` and
  stored as the next UTC occurrence.
- Current delivery is application logging (`🔔 REMINDER!`); no email, push, or
  external notification provider is configured.

## Development commands

| Command                | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Run the TypeScript server with `tsx watch`           |
| `npm run build`        | Type-check and compile TypeScript                    |
| `npm start`            | Run the compiled server                              |
| `npm run db:migrate`   | Apply pending dbmate migrations                      |
| `npm run lint`         | Run ESLint                                           |
| `npm run lint:fix`     | Fix ESLint findings where possible                   |
| `npm run format:check` | Check Prettier formatting                            |
| `npm run format`       | Format the repository                                |
| `npm test`             | Placeholder script; no test runner is configured yet |

## Troubleshooting

| Symptom                          | Checks                                                                                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Database connection fails        | Confirm PostgreSQL is running and all `DB_*` values match the database                                                                         |
| Migration command cannot connect | Confirm `DATABASE_URL` is exported and dbmate is installed                                                                                     |
| Protected endpoint returns `401` | Send `Authorization: Bearer <token>` and verify `JWT_SECRET` matches the login process                                                         |
| Admin endpoint returns `403`     | Log in with a user whose database role is `admin`                                                                                              |
| Port is already in use           | Change `PORT` or stop the process using the configured port                                                                                    |
| `npm start` cannot find a file   | Build first and use `node dist/server.js`; see the build output note                                                                           |
| No reminder appears              | Confirm `reminder_date`, `reminder_time`, `timezone`, `is_active`, and `next_reminder_at`; reminders are logged(console) by the server process |
