# Drivewise Demo

Drivewise is a demonstration car marketplace app built with Angular and mock data. It models a realistic product surface for learning, buying, and selling cars without authentication backends, real inventory APIs, or legally binding content.

The app is also a migration playground. Angular owns the application shell, routing, header, footer, and most feature areas. The legal pages can be rendered by a React microfrontend package behind a feature flag, while the original Angular legal page remains available as a rollback path. The profile page is isolated in a standalone Angular microfrontend package to represent a legacy feature that can later be transitioned independently.

## Application Areas

- Learn: marketing and education content, including buying guides and a payment estimator.
- Buy: searchable mock inventory with filters, result cards, and vehicle detail pages.
- Sell: seller valuation workflow with a mocked offer and draft confirmation.
- Profile: standalone Angular microfrontend for account, garage, and preference state.
- Legal: Terms of Service and Privacy Policy pages with lorem ipsum content.
- Mock auth: shared authentication state synchronized between Angular and React through `localStorage`, `sessionStorage`, and a framework-neutral workspace package.

## Workspace Packages

- `packages/auth-state`: shared mock authentication state package used by both Angular and React.
- `packages/profile-angular`: standalone Angular profile microfrontend hosted by the Angular shell.
- `packages/legal-react`: React legal-page microfrontend. Terms fetches mock data with React Query; Privacy receives Angular service data as props.

Generated package outputs and package-local installs are ignored:

- `packages/*/dist`
- `packages/*/node_modules`

## Setup

Install dependencies from the repository root:

```bash
npm install
```

## Run Locally

Start the Angular development server:

```bash
npm start
```

Open `http://localhost:4200/`.

The `prestart` script builds the workspace packages before Angular starts so the in-process package imports are available.

## Build

Create a production build:

```bash
npm run build
```

This builds `@drivewise/auth-state`, `@drivewise/profile-angular`, `@drivewise/legal-react`, then the Angular app. Output is written to `dist/angular-project`.

## Test

Run all tests:

```bash
npm test -- --watch=false
```

This runs:

- `@drivewise/auth-state` package tests
- `@drivewise/profile-angular` package tests
- `@drivewise/legal-react` package tests
- Angular app tests

Package-specific tests are also available:

```bash
npm run test:auth-state
npm run test:profile-angular
npm run test:legal-react
```

## Feature Flags

React legal pages are enabled by default through `FeatureFlagsService`. Turning `legalReactEnabled` off routes the same Angular `/terms` and `/privacy` pages through the Angular fallback component instead of the React host.

## Notes

- All inventory, offers, auth users, sessions, and legal content are mocked.
- Legal pages are structured realistically, but their body content is lorem ipsum placeholder copy.
- The app intentionally keeps Angular chrome around the React legal microfrontend to demonstrate incremental migration.
- The profile page keeps a legacy Angular feature isolated behind a workspace package boundary so it can be migrated later without reshaping the shell first.
