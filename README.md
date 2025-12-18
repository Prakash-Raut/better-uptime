# better-uptime

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Hono, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Hono** - Lightweight, performant server framework
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Biome** - Linting and formatting
- **PWA** - Progressive Web App support
- **Husky** - Git hooks for code quality

## Getting Started

First, install the dependencies:

```bash
pnpm install
```
## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:
```bash
pnpm run db:push
```


Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).







## Project Structure

```
better-uptime/
├── apps/
│   ├── web/              # Frontend application (Next.js)
│   ├── server/           # API Service (Hono) - Monitor CRUD
│   ├── scheduler-service # Scheduler Service - Time-bucket scheduling
│   ├── worker-check      # Checker Service - HTTP probe workers
│   ├── evaluator-service # Evaluator Service - State evaluation
│   ├── alert-service     # Alert Service - Alert delivery
│   └── worker-writer     # Writer Service - Bulk DB writes
├── packages/
│   ├── shared-types      # Shared TypeScript types
│   ├── auth/             # Authentication configuration & logic
│   ├── db/               # Database schema & queries
│   └── queues/           # Queue configuration (BullMQ)
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:web`: Start only the web application
- `pnpm run dev:server`: Start only the API server
- `pnpm run dev:scheduler`: Start scheduler service
- `pnpm run dev:checker`: Start checker service
- `pnpm run dev:evaluator`: Start evaluator service
- `pnpm run dev:alert`: Start alert service
- `pnpm run dev:writer`: Start writer service
- `pnpm run check-types`: Check TypeScript types across all apps
- `pnpm run db:push`: Push schema changes to database
- `pnpm run db:studio`: Open database studio UI
- `pnpm run check`: Run Biome formatting and linting
- `cd apps/web && pnpm run generate-pwa-assets`: Generate PWA assets

## Running the Uptime Monitoring Backend

The uptime monitoring system consists of multiple services that work together:

1. **API Service** - Handles monitor CRUD operations
2. **Scheduler Service** - Schedules checks based on monitor intervals
3. **Checker Service** - Executes HTTP checks
4. **Evaluator Service** - Evaluates results and detects state changes
5. **Alert Service** - Sends alerts on state transitions
6. **Writer Service** - Bulk writes check results to database

### Prerequisites

- PostgreSQL database
- Redis instance
- Environment variables configured (see `apps/server/.env.example`)

### Quick Start

```bash
# Install dependencies
pnpm install

# Set up database schema
pnpm db:push

# Start all services (in separate terminals)
pnpm dev:server      # Terminal 1
pnpm dev:scheduler   # Terminal 2
pnpm dev:checker     # Terminal 3
pnpm dev:evaluator   # Terminal 4
pnpm dev:alert       # Terminal 5
pnpm dev:writer      # Terminal 6
```

For production, use a process manager like PM2 or Docker Compose to orchestrate all services.
