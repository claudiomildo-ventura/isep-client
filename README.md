# ISEP | Integrated Software Engineering Platform - frontend

---

## Project Overview

ISEP Client is the Angular frontend for the Integrated Software Engineering Platform. The application provides the user interface for collecting project information, generating structure data, configuring parameters, and interacting with the orchestration backend through HTTP endpoints.

The project is part of a modernization effort for a legacy application originally developed in Object Pascal (Delphi XE10).

## Technologies Used

The project uses a modern frontend and DevOps stack:

[![Skills](https://skillicons.dev/icons?i=ts,angular,npm,docker,nginx,git,github,githubactions,md&theme=light)](https://skillicons.dev)

- Angular 21
- TypeScript 5.9
- Angular Material
- RxJS
- ngx-translate
- Karma and Jasmine
- Docker and NGINX
- GitHub Actions

## Project Structure

```text
src/
  app/
    components/        Application pages and reusable UI components
    core/              Services, interceptors, guards, and error routes
    shared/            Interfaces, validators, pipes, constants, and utilities
  assets/              Static assets and runtime configuration files
  environments/        Environment-specific Angular configuration
```

## Backend Integration

During local development, the Angular dev server uses `proxy.config.json` to forward requests from `/orchestrator/v1` to the backend running at `http://localhost:3001`.

The main environment configuration is defined in `src/environments/environment.ts`.

## Available Scripts

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The application runs on `http://localhost:3000`.

Run tests:

```bash
npm test
```

Build for production:

```bash
npm run build
```

## Docker

Build and run the frontend container with Docker Compose:

```bash
docker compose up --build
```

The Docker image builds the Angular application and serves the generated files with NGINX.
