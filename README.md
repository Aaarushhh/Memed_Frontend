# Meme'd — Campaign Payout Tracker (Frontend)

Next.js + TypeScript frontend for the Meme'd creator marketplace assignment. Brands create campaigns with milestone ladders; creators submit posts and track earnings.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- JWT auth (token stored in `localStorage`)

## Prerequisites

- Node.js 18+
- Backend API running (default: `http://localhost:3000`)
- Backend CORS must allow the frontend origin (`http://localhost:3001`)

## Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` if your API URL differs:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Run

```bash
npm run dev
```

Frontend: [http://localhost:3001](http://localhost:3001)  
(Backend stays on port `3000` so the two don't conflict.)

Production build:

```bash
npm run build
npm start
```

## Environment variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL **including** `/api`, no trailing slash | `http://localhost:3000/api` |

See `.env.example`.

## App routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Landing; redirects if already logged in |
| `/login` | Guest | Login |
| `/signup` | Guest | Signup (role: `brand` \| `creator`) |
| `/brand` | Brand only | Create campaigns, view budget spent vs remaining |
| `/creator` | Creator only | Browse live campaigns, submit posts, view earnings |

## API integration

All paths are relative to `NEXT_PUBLIC_API_URL` and defined in `src/lib/constants.ts` (`ENDPOINTS`).

| Action | Method | Path |
|--------|--------|------|
| Signup | `POST` | `/auth/signup` |
| Login | `POST` | `/auth/login` |
| Me | `GET` | `/auth/me` |
| Create / list brand campaigns | `POST` / `GET` | `/campaigns` |
| List live campaigns | `GET` | `/campaigns/live` |
| Submit post | `POST` | `/submissions` |
| Earnings | `GET` | `/submissions/earnings` |
| Update views (no auth) | `PATCH` | `/submissions/:id/views` |

Auth header: `Authorization: Bearer <token>`

Expected backend envelopes (from API collection):

- Success: `{ data, message }`
- Error: `{ success: false, error }`

## Project structure

```
src/
├── app/                 # Routes (login, signup, brand, creator)
├── components/
│   ├── auth/            # Forms + route guards
│   ├── brand/           # Campaign create + list
│   ├── creator/         # Browse, submit, earnings
│   ├── providers/       # App providers
│   └── ui/
├── context/             # AuthContext
├── lib/
│   ├── api.ts           # Fetch wrapper
│   ├── constants.ts     # Routes + ENDPOINTS
│   ├── normalize.ts     # Response adapters
│   └── services/        # Auth, campaigns, submissions
└── types/
```

## Assumptions

1. **API base URL** includes `/api` (Postman `baseUrl` style: `http://localhost:3000/api`).
2. **Milestones** use `{ views, payout }` (not `viewThreshold`).
3. **Auth response** lives under `data`: `{ data: { token, user } }`. Mongo-style `_id` is normalized to `id`.
4. **Brand campaign list** is `GET /campaigns` (authenticated brand). **Creator live list** is `GET /campaigns/live`.
5. **Earnings** endpoint returns at least `{ totalEarnings }`. If it does not include submissions, the UI still shows total earnings and keeps any locally known submissions after submit.
6. **Payout / budget cap logic** lives on the backend. Updating views is done via `PATCH /submissions/:id/views` (e.g. Postman); the frontend exposes a service helper for it.
7. **Role dashboards** are separated: wrong role is redirected to the correct dashboard.
8. Styling is intentionally minimal — focus is functionality and structure.

## Suggested manual test flow

1. Signup / login as **brand** → create a campaign with milestones.
2. Signup / login as **creator** → open live campaigns → submit a post URL.
3. From Postman (or backend tool): `PATCH /submissions/:id/views` with a view count that crosses a milestone.
4. Refresh earnings on the creator page; refresh brand campaigns to see budget spent vs remaining.

## Deploy notes

- Set `NEXT_PUBLIC_API_URL` to your deployed backend API base (including `/api`).
- Ensure backend CORS allows the frontend deploy origin.
- Free tiers (Vercel for frontend) are fine for this assignment.
