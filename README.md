# Turborepo + Supabase + Drizzle Minimal starter

A minimal monorepo starter: [Turborepo](https://turborepo.com) + [Next.js](https://nextjs.org) + [Drizzle ORM](https://orm.drizzle.team) + Supabase (Postgres).

## Use this template

Scaffold a new project from this starter with a single command:

```bash
npx create-turbo@latest my-app --example https://github.com/ruucm/turborepo-drizzle-starter
```

This copies the repo into `my-app/` and starts a fresh git history. Requires Node.js 18+ and pnpm (run `corepack enable` first if you don't have pnpm).

## Setup

```bash
# Configure environment variables — set DATABASE_URL in each
cp apps/web/.env.example apps/web/.env
cp packages/database/.env.example packages/database/.env
```

```bash
pnpm install
```

> The web app runs without `DATABASE_URL` (it shows a placeholder page); add a Postgres connection string to enable database queries.

## Run

```bash
pnpm dev
```

Open http://localhost:3000.

## What's inside

- `apps/web` — Next.js app (App Router, Turbopack)
- `packages/database` — Drizzle ORM schema, migrations, and seed
- `packages/ui` — shared React components
- `packages/eslint-config`, `packages/typescript-config` — shared configs
