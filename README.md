# Campus Event Hub

A campus events app built for the ITUE301 Practical Exam (Set B). It includes a React frontend, an Express API, and a Mongoose event model with a MongoDB seed script.

## Requirements

- Node.js 18 or later and npm
- MongoDB Atlas or a local MongoDB server (only needed for the seed script)

## Run the app

Install and start the backend in one terminal:

```sh
cd backend
npm install
npm start
```

The API runs at `http://localhost:5001` by default. Check that it is reachable at `http://localhost:5001/`; it returns `{ "status": "ok" }`. To use another port, set `PORT` in `backend/.env`.

In a second terminal, install and start the frontend:

```sh
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The frontend includes event listings, registration, and an organisers page. The sample event listings are defined in `frontend/src/data/events.js`.

## MongoDB seed

The events API uses an in-memory array and does not require MongoDB. MongoDB is used separately by the seed script to demonstrate the Mongoose event model.

Create the backend environment file and add your connection string:

```sh
cd backend
cp .env.example .env
```

Edit `backend/.env` and replace the example `MONGO_URI` with your Atlas or local MongoDB connection string. Do not commit `.env`; it may contain credentials. If the URI has no database name, the seed uses `eventhub` by default. `DB_NAME` can override that fallback.

Run the seed from the backend directory:

```sh
npm run seed
```

The seed saves an event, reads it back, and prints the database and collection to check in MongoDB Compass: database **`eventhub`**, collection **`events`**.

## API

Base URL: `http://localhost:5001`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Health check |
| `GET` | `/api/v1/events` | List events |
| `GET` | `/api/v1/events?maxFee=150` | List events with a fee at or below the limit |
| `GET` | `/api/v1/events/:id` | Get one event by numeric ID |
| `POST` | `/api/v1/events` | Add an event |
| `DELETE` | `/api/v1/events/:id` | Delete an event |
| `GET` | `/api/v1/boom` | Diagnostic route that exercises the JSON error handler (returns 500) |

Example request:

```sh
curl -X POST http://localhost:5001/api/v1/events \
  -H 'Content-Type: application/json' \
  -d '{"title":"Chess","capacity":40}'
```

The title must contain 1–80 characters, capacity must be a whole number from 1 to 500, and fee must be zero or greater. Fee defaults to `0`. Events added through this API remain in memory and reset when the server restarts.

## Tests and production build

Run the backend tests:

```sh
cd backend
npm test
```

Build the frontend:

```sh
cd frontend
npm run build
```

## Project layout

```text
backend/    Express API, Mongoose model, seed script, and tests
frontend/   React application built with Vite
evidence/   Screenshots captured for the exam project
FINDINGS.md Exam task findings and fixes
```
