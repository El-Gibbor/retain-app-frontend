# Retain

**Retain** is a personal expense and budget manager. Users record and search their expenses, set a monthly budget and see where their money goes. Admins manage the shared expense categories and review platform activity.

- **Live app:** https://retain-app-frontend-dusky.vercel.app
- **Backend:** [GitHub repo](https://github.com/El-Gibbor/retain-app-backend) | [Live API](https://retain-app-backend-6pyt.onrender.com/api/health)
- **Demo login:** `demo@retain.app` / `DemoPass2026` (a regular user)

> The API runs on Render's free tier and sleeps after about 15 minutes without traffic. The first request after a quiet spell can take up to a minute; the app shows a "Waking up the server" notice while it does.

## Features

### For users

- **Sign up, sign in and sign out**, with the session restored automatically on reload.
- **Expenses**: create, view, edit and delete expenses with a title, amount, category, date, payment method and optional notes.
- **Search, filter and sort**: search title and notes, filter by categories, payment methods, date range and amount range, sort by date or amount, and page through results (10, 20 or 50 per page). Filters persist while moving around the app.
- **Monthly budget**: set or update a budget for any month and see spent, remaining and percent used, with a green, amber or red status for *within*, *approaching* (80%+) and *over* budget.
- **Dashboard**: total spending, remaining budget, highest expense and expense count for the selected month, a spending-by-category chart (with a table view) and recent expenses.

### For admins

- **Category management**: create, rename and delete categories. Deleting a category moves its expenses to the protected **Uncategorized** category, and the confirmation says how many will move.
- **Platform insights**: registered users, total expenses and value, expenses this month, spending per category, top 5 and bottom 5 categories, recently added expenses and recently registered users.

### Experience

- Responsive layout: a sidebar on desktop and a slide-out drawer on mobile; tables become cards on small screens.
- Loading skeletons, empty states, inline validation, success notifications and retry on errors.
- Error boundaries, per-page titles, lazy-loaded pages and a skip-to-content link.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | React 19, TypeScript (strict), Vite |
| UI | Material UI 9, Lexend font |
| Routing | React Router 7 |
| Authentication state | React Context |
| Filter, search and sort state | Redux Toolkit + React Redux |
| Data fetching | Typed `fetch` client with cancellable requests |
| Hosting | Vercel |

## State Management

The project keeps the two required state concerns strictly separate.

### Authentication: React Context

- `src/context/AuthProvider.tsx` owns the signed-in user, the session status (`loading`, `authenticated`, `unauthenticated`) and the `signIn`, `signUp` and `signOut` actions. The token is stored in `localStorage` and the session is restored from `/auth/me` on load.
- `useAuth()` (`src/hooks/useAuth.ts`) exposes it to components.
- Route guards in `src/components/routing/` read the context:
  - `ProtectedRoute` sends signed-out users to `/signin` and remembers where they were going.
  - `AdminRoute` lets only users with the `ADMIN` role into `/admin`.
  - `GuestRoute` keeps signed-in users away from the sign-in and sign-up pages.
- If the API ever rejects the token, the user is signed out automatically.

### Expense filtering, searching and sorting: Redux

- `src/store/expenseFiltersSlice.ts` holds the search text, selected categories and payment methods, date and amount ranges, sort field and order, page and page size.
- Every filter change returns to page 1. Clearing filters keeps the chosen sort and page size.
- `selectExpenseQuery` is a memoised selector that turns the Redux state into the API's query parameters, so the expense list only refetches when a filter actually changes.
- Other pages reuse the same state: "View expenses for October 2026" on the budget page sets the date range in Redux and opens the expense list already filtered.

## Getting Started

### Prerequisites

- Node.js 20.19 or newer
- The [Retain API](https://github.com/El-Gibbor/retain-app-backend) running locally or a deployed URL

### Setup

```bash
git clone https://github.com/El-Gibbor/retain-app-frontend.git
cd retain-app-frontend
npm install
cp .env.example .env   # point VITE_API_URL at your API
npm run dev            # http://localhost:5173
```

The dev server is pinned to port 5173 so it matches the API's CORS allow-list.

### Environment Variables

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL of the API including `/api`, e.g. `http://localhost:4000/api`. It is compiled into the build, so set it before building or deploying. |

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Type-check and build for production into `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Lint with oxlint. |
| `npm run typecheck` | Type-check without building. |

## Routes

| Path | Access | Page |
| --- | --- | --- |
| `/signin`, `/signup` | Guests | Sign in and create an account |
| `/` | Signed in | Dashboard (`?month=YYYY-MM`) |
| `/expenses` | Signed in | Expense list with filters |
| `/expenses/:id` | Signed in | Expense details |
| `/budget` | Signed in | Monthly budget (`?month=YYYY-MM`) |
| `/admin` | Admins | Insights and category management (`?tab=categories`) |

## Deployment

The app is deployed on Vercel. `vercel.json` rewrites every path to `index.html` so deep links work, and `VITE_API_URL` is set in the Vercel project to the Render API URL. The API's `CLIENT_ORIGIN` must include this site's origin for CORS.
