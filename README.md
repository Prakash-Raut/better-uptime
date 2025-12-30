# better-uptime

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Hono, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework for the web application
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Hono** - Lightweight, performant server framework
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Inngest** - Background job processing and task scheduling
- **Redis Streams** - Task queuing system
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
│   └── server/           # Backend API (Hono) - Handles all monitor operations and background tasks via Inngest
├── packages/
│   ├── shared-types      # Shared TypeScript types
│   ├── auth/             # Authentication configuration & logic
│   ├── db/               # Database schema & queries
│   └── queues/           # Redis streams configuration for task queuing
```

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:web`: Start only the web application
- `pnpm run dev:server`: Start only the API server
- `pnpm run check-types`: Check TypeScript types across all apps
- `pnpm run db:push`: Push schema changes to database
- `pnpm run db:studio`: Open database studio UI
- `pnpm run db:generate`: Generate database migrations
- `pnpm run db:migrate`: Run database migrations
- `pnpm run format`: Format code with Biome
- `cd apps/web && pnpm run generate-pwa-assets`: Generate PWA assets

## Architecture

Better Uptime uses a simplified, modern architecture:

### Core Components

1. **Web Application** (Next.js) - Client-side web application for managing monitors and viewing status
2. **Server** (Hono) - Unified backend API that handles:
   - Monitor CRUD operations
   - Background task scheduling via **Inngest**
   - Monitor health checks and status updates
   - All business logic in a single service

### Background Processing

- **Inngest** - Handles all scheduled tasks and background jobs:
  - Cron-based scheduler that runs every 5 minutes
  - Monitor check execution
  - Status evaluation and updates
- **Redis Streams** - Used for queuing monitor checks between scheduler and checker functions

### Prerequisites

- PostgreSQL database
- Redis instance (for streams)
- Inngest account and API key
- Environment variables configured (see `apps/server/.env.example`)

### Quick Start

```bash
# Install dependencies
pnpm install

# Set up database schema
pnpm db:push

# Start the application
pnpm run dev          # Starts both web and server
# OR separately:
pnpm dev:web          # Start web app only
pnpm dev:server       # Start server only
```

The server integrates with Inngest for background task processing. Make sure your Inngest configuration is set up in your environment variables.
