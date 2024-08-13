---
name: Vercel Postgres + Prisma Next.js Application
description: Next.js Application that uses Vercel Postgres as the database and Prisma as the ORM.
framework: Next.js
css: Tailwind
database: Vercel Postgres
---

# Lil Networking

The Lil Networking App is a tool designed to help people form intentional networking habits that lead to meaningful professional relationships. Maintaining a strong community of peers and mentors is essential for achieving professional growth, and this app is designed to make networking easier and more intentional.

## Getting Started

- Run `cp .env.example .env` to open .env and set the environment variables to match the ones in the Vercel Storage Dashboard. The keys should be available under your database's `.env` tab.
- Use [`direnv`](https://direnv.net/) to inject `.env` into your shell
- Use [`asdf`](https://asdf-vm.com/) or [`nvm`](https://github.com/nvm-sh/nvm) to pick up `.nvmrc`
- Run `yarn install` to install all dependencies for local development
- Run `yarn dev` to run the Next.js app in development mode

## Deploy

This app is using Vercel's Git integration, which gives the ability to test new features and changes using [Preview Deployments](https://vercel.com/docs/concepts/deployments/preview-deployments) before merging to the main branch to automatically create a [Production Deployment](https://vercel.com/docs/concepts/deployments/environments#production)

The `staging` branch automatically deploys to Vercel Preview when pushing to `staging` branch

The `main` branch automatically deploys to Vercel Production when pushing to `main` branch, or triggering a one-time manual deploy of the `main` branch by `vercel --prod`
