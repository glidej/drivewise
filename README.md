# Drivewise Demo

Drivewise is a demonstration car marketplace app built with Angular, React microfrontends, workspace packages, and mock data. It models a realistic product surface for learning, buying, bidding on, and selling cars without authentication backends, real inventory APIs, or legally binding content.

The app is also a migration playground. Angular owns the application shell, routing, header, footer, and most feature areas. The legal pages can be rendered by a React microfrontend package behind a feature flag, while the original Angular legal page remains available as a rollback path. Shared React presentation primitives live in a fledgling UI package so future React microfrontends, and eventually the core app, can converge on the same patterns. The profile page is isolated in a standalone Angular microfrontend package to represent a legacy feature that can later be transitioned independently.

## Application Areas

- Learn: marketing and education content, including buying guides and a payment estimator.
- Buy: searchable mock inventory with filters, result cards, and vehicle detail pages.
- Bids: app-owned bid list that reuses the buy result card with bid-specific conditional UI.
- Sell: seller valuation workflow with a mocked offer and draft confirmation.
- Profile: standalone Angular microfrontend for account, garage, and preference state.
- Legal: Terms of Service and Privacy Policy pages with lorem ipsum content.
- Mock auth: shared authentication state synchronized between Angular and React through `localStorage`, `sessionStorage`, and a framework-neutral workspace package.
- Vehicle result card: intentionally complex Angular component with signal inputs, RxJS activity streams, `@switch` template branches, inventory mode, and bid-list mode.

## Workspace Packages

- `packages/auth-state`: shared mock authentication state package used by both Angular and React.
- `packages/common-data`: framework-neutral mock vehicle and bid data, types, and fixture helpers used by Angular and React packages.
- `packages/react-ui`: shared React UI primitives for document shells, notice cards, status panels, buttons, and empty states, styled with `styled-components`.
- `packages/profile-angular`: standalone Angular profile microfrontend hosted by the Angular shell.
- `packages/legal-react`: React legal-page microfrontend styled with `styled-components`. Terms fetches mock data with React Query; Privacy receives Angular service data as props; common presentation comes from `packages/react-ui`.
- `packages/bids-react`: React bid-list microfrontend with package-owned React Query fetching, visible loading/error/empty states, and route-level Angular rollback.

## Styling

- The Angular application under `src/` uses SCSS for global and component styles.
- React-based workspace packages use `styled-components`.
- Package-local build output and installs stay ignored so generated artifacts do not leak into commits.

## Microfrontend Nesting

Angular owns the route shell, navigation, header, footer, and feature-flag decisions. Microfrontends sit behind Angular host wrappers that translate route state and service data into package mount/update/unmount calls.

```text
Angular application shell
|-- Header / navigation
|-- Router outlet
|   |-- /learn, /buy, /sell, /bids
|   |   `-- Angular feature components
|   |       `-- VehicleResultCardComponent
|   |           |-- inventory result mode
|   |           |-- bid-list mode
|   |           `-- mock RxJS vehicle activity stream
|   |-- /profile
|   |   `-- ProfilePageHostComponent
|   |       `-- host mount point
|   |           `-- @drivewise/profile-angular
|   |               `-- ProfileAppComponent
|   `-- /terms, /privacy
|       `-- LegalPageHostComponent
|           |-- Angular service data and feature flag
|           |-- Angular fallback: LegalDocumentComponent
|           `-- ReactLegalHostComponent
|               `-- host mount point
|                   `-- @drivewise/legal-react
|                       |-- LegalDocumentPage
|                       |-- React Query terms service
|                       `-- @drivewise/react-ui primitives
|-- Footer
`-- Shared browser state
    `-- @drivewise/auth-state
        |-- localStorage remembered profile
        `-- sessionStorage mock session
```

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

This builds the workspace packages, then the Angular app. Output is written to `dist/angular-project`.

## Test

Run all tests:

```bash
npm test -- --watch=false
```

This runs:

- `@drivewise/auth-state` package tests
- `@drivewise/common-data` package tests
- `@drivewise/profile-angular` package tests
- `@drivewise/react-ui` package tests
- `@drivewise/legal-react` package tests
- `@drivewise/bids-react` package tests
- Angular app tests

Package-specific tests are also available:

```bash
npm run test:auth-state
npm run test:common-data
npm run test:profile-angular
npm run test:react-ui
npm run test:legal-react
npm run test:bids-react
```

## Feature Flags

React legal pages are enabled by default through `FeatureFlagsService`. Turning `legalReactEnabled` off routes the same Angular `/terms` and `/privacy` pages through the Angular fallback component instead of the React host. The React bid list flag, `bidListReactEnabled`, defaults off so `/bids` can roll back to the Angular bid list while the React route package is validated.

## Notes

- All inventory, offers, auth users, sessions, and legal content are mocked.
- Legal pages are structured realistically, but their body content is lorem ipsum placeholder copy.
- The app intentionally keeps Angular chrome around the React legal microfrontend to demonstrate incremental migration.
- The React UI package is intentionally small and reusable, showing how React microfrontends can share UI patterns without depending on Angular shell internals.
- The bid list is intentionally app-owned and reuses the Angular vehicle result card to demonstrate how component complexity can grow before a migration.
- The profile page keeps a legacy Angular feature isolated behind a workspace package boundary so it can be migrated later without reshaping the shell first.
