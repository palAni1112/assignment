# Appointment Board

A full-stack appointment management application.

## Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (Neon DB / Local PostgreSQL)
- **ORM:** Prisma

## Development Setup

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)
- PostgreSQL or Neon DB instance

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 4. Health Check Endpoint

```bash
curl http://localhost:8001/api/health
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```
