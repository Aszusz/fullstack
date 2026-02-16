# NoDelulu Fullstack

A modern fullstack monorepo demonstrating best practices with TanStack Start, Fastify, and Drizzle ORM.

## Tech Stack

**Frontend (Web)**

- TanStack Start with React 19
- TanStack Router (file-based routing)
- Tailwind CSS v4
- Vite

**Backend (API)**

- Fastify v5
- TypeScript

**Database**

- PostgreSQL 16
- Drizzle ORM

**Infrastructure**

- Docker & Docker Compose
- npm workspaces

## Project Structure

```
fullstack/
├── apps/
│   ├── api/          # Fastify backend server
│   └── web/          # TanStack Start frontend
├── packages/
│   └── db/           # Shared database layer (Drizzle ORM)
├── docker/           # Docker configuration
└── package.json      # Root workspace configuration
```

## Prerequisites

- Node.js 22+
- Docker & Docker Compose
- npm

## Getting Started

1. **Clone and install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

3. **Start the database**

   ```bash
   npm run docker:up
   ```

4. **Push the database schema**

   ```bash
   npm run db:push
   ```

5. **Start development servers**
   ```bash
   # In separate terminals:
   npm run -w @fullstack/api dev    # API on port 3000
   npm run -w web dev               # Web on port 5173
   ```

## Scripts

| Command                 | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run format`        | Format code with Prettier            |
| `npm run lint`          | Lint with ESLint                     |
| `npm run typecheck`     | Type-check all workspaces            |
| `npm run pass`          | Run format, lint, and typecheck      |
| `npm run docker:up`     | Start PostgreSQL                     |
| `npm run docker:down`   | Stop all services                    |
| `npm run docker:up:all` | Start all services including pgAdmin |
| `npm run docker:reset`  | Reset database and restart           |
| `npm run db:push`       | Push schema to database              |
| `npm run db:studio`     | Open Drizzle Studio                  |

## API Endpoints

| Method | Endpoint     | Description                 |
| ------ | ------------ | --------------------------- |
| GET    | `/health`    | Health check with DB status |
| GET    | `/pings`     | List all pings              |
| GET    | `/pings/:id` | Get ping by ID              |
| POST   | `/pings`     | Create a new ping           |
| DELETE | `/pings/:id` | Delete a ping               |

## Environment Variables

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=fullstack
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fullstack
```

## License

MIT
