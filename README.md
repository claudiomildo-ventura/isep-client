# ISEP | Integrated Software Engineering Platform - Client

## Project Overview

ISEP Client is the Angular frontend for the Integrated Software Engineering Platform. The application provides the user interface for collecting project information, generating structure data, configuring parameters, and interacting with the orchestration backend through HTTP endpoints.

The project is part of a modernization effort for a legacy application originally developed in Object Pascal (Delphi XE10).

## Technologies Used

[![Skills](https://skillicons.dev/icons?i=ts,angular,npm,docker,nginx,git,github,githubactions,md&theme=light)](https://skillicons.dev)

| Technology | Version / Usage |
| --- | --- |
| Angular | 21 |
| TypeScript | 5.9 |
| Angular Material | UI components |
| RxJS | Reactive programming |
| ngx-translate | Internationalization |
| Karma and Jasmine | Unit testing |
| Docker and NGINX | Containerized build and hosting |
| GitHub Actions | CI/CD |

## Project Structure

```text
src/
+-- app/
|   +-- components/    Application pages and reusable UI components
|   +-- core/          Services, interceptors, guards, and error routes
|   +-- shared/        Interfaces, validators, pipes, constants, and utilities
+-- assets/            Static assets and runtime configuration files
+-- environments/      Environment-specific Angular configuration
```

## Backend Integration

During local development, the Angular dev server uses `proxy.config.json` to forward requests from `/orchestrator/v1` to the backend running at `http://localhost:3001`.

The main environment configuration is defined in `src/environments/environment.ts`.

## Build and Run

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm start
```

The application runs on `http://localhost:3000`.

### Production Build

```bash
npm run build
```

## Testing

```bash
npm test
```

For a single headless run:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

On Windows without Chrome, use the installed Chromium-based Edge executable:

```powershell
$env:CHROME_BIN = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm test -- --watch=false --browsers=ChromeHeadless
```

Component tests mock backend requests and IndexedDB. Running backend services is not required.

## Docker

Build and run the frontend container with Docker Compose:

```bash
docker compose up --build
```

The Docker image builds the Angular application and serves the generated files with NGINX.
