# ProofSite AI

ProofSite AI is organized as two separate applications:

- `frontend/`: Next.js 16, React, TypeScript, and Tailwind CSS.
- `backend/`: Node.js, Express, and TypeScript.

The backend owns API and business logic. The frontend calls it over HTTP.

## Requirements

- Node.js and npm

## Configure environment files

Copy each example file to `.env` in the same application directory:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

The backend example uses port `5000`, allows browser requests from
`http://localhost:3000`, and connects to a local MongoDB database. Replace the
blank `JWT_SECRET` with a random secret of at least 32 bytes before running the
backend. Do not commit real `.env` files. The frontend example points API
requests to `http://localhost:5000/api`.

You can generate a suitable JWT secret with:

```bash
openssl rand -base64 32
```

MongoDB must be running locally, or `MONGODB_URI` must point to a database you
can access.

## Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

## Run in development

Open two terminals from the project root.

Terminal 1 — backend:

```bash
cd backend
npm run dev
```

Terminal 2 — frontend:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Check the backend at
[http://localhost:5000/api/health](http://localhost:5000/api/health); a healthy
response is `{"status":"ok"}`.

## Provision the initial main contractor

Public registration always creates a `WORKER` account. To provision the initial
main contractor administrator, run this one-time operator command from the
backend directory after configuring `backend/.env` and connecting to a MongoDB
replica set:

```bash
cd backend
npm run bootstrap:admin
```

The command prompts for the administrator name, work email, and password; the
password is entered without terminal echo. It refuses to run if an administrator
or the one-time bootstrap record already exists. The administrator signs in at
`/login`, completes company, contact, and first-project onboarding, and is then
sent to the admin dashboard. Do not expose administrator provisioning through
public registration or an HTTP endpoint.

Onboarding draft and completion operations use MongoDB transactions, so the
configured deployment must support transactions (for example, a replica set).
The backend initializes the onboarding collections and indexes before serving
requests.

## Build and run the backend in production

```bash
cd backend
npm run build
npm start
```

Build the frontend separately with `npm run build` from `frontend/`, then serve
it with `npm start` from that directory.

## Current scope

The API provides a health check, JSON 404 responses, CORS for the configured
frontend origin, and centralized error handling. Authentication is available
through:

- `POST /api/auth/register` with `{ "fullName", "email", "password" }`
- `POST /api/auth/login` with `{ "email", "password" }`
- `GET /api/auth/me` for the authenticated account profile

Login and registration return a user profile and a one-hour JWT. The Next.js
frontend stores the token in an HttpOnly cookie. Public registration always
assigns the `WORKER` role; submitted roles are not used.

Authenticated main contractor onboarding endpoints:

- `GET /api/onboarding` retrieves only the authenticated administrator's draft.
- `PUT /api/onboarding/draft` saves one validated `company`, `contact`, or
  `firstProject` step.
- `POST /api/onboarding/complete` creates the initial project and marks the
  organization and administrator onboarding complete in a transaction. The
  operation is safe to retry.

The onboarding endpoints require an authenticated `ADMIN` and derive ownership
from the verified token. GPS attendance, AI verification, payment processing,
and live project integrations are not connected in the current product preview.
