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

## Build and run the backend in production

```bash
cd backend
npm run build
npm start
```

Build the frontend separately with `npm run build` from `frontend/`, then serve
it with `npm start` from that directory.

## Current scope

The API currently provides a health check, JSON 404 responses, CORS for the
local frontend origin, and centralized error handling. Authentication is
available through:

- `POST /api/auth/register` with `{ "fullName", "email", "password" }`
- `POST /api/auth/login` with `{ "email", "password" }`

Both authentication endpoints return a user object and a one-hour JWT. Public
registration always assigns the `WORKER` role; submitted roles are not used.
Authenticated routes can use the provided JWT authentication and role
authorization middleware. AI integrations and image storage are not configured
yet.
