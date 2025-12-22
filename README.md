[![CodeFactor](https://www.codefactor.io/repository/github/dmitriy-iliyov/aid-compass-frontend/badge)](https://www.codefactor.io/repository/github/dmitriy-iliyov/aid-compass-frontend)

![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)

## Overview

This repository contains the frontend implementation for the Aid Compass platform — an application for discovering specialists and managing appointment scheduling.

The frontend is built as a SPA using Angular and communicates with the backend via REST APIs.  
It provides a user-friendly interface for authentication, schedule management, and appointment booking.

Project components:
- core backend – https://github.com/dmitriy-iliyov/aid-compass-backend  

## Key Features

- user and specialist authentication;
- role-based UI behavior;
- specialist search and filtering;
- appointment booking and cancellation;
- personal schedule visualization;
- responsive UI based on Angular Material;
- integration with backend APIs.

## Architecture & Tech Stack

- Angular 18 with standalone components;
- TypeScript 5.5;
- Angular Router for client-side routing;
- Angular Material for UI components;
- RxJS for reactive state and async flows;
- REST-based communication with the backend.

The application is designed to be stateless and relies on backend-managed authentication using secure HTTP-only cookies.

## Development

Install dependencies:

```bash
npm install
```

Run the application locally:

```bash
npm start
```

Build a production-ready bundle:

```bash
npm run build
```

The production build is intended to be served by the backend as static resources.
