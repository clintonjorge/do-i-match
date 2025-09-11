# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## High-Level Architecture

This is a single-page application (SPA) built with React and Vite. The main functionality is a chat-based job discovery tool that communicates with an n8n webhook backend.

- **`src/main.tsx`**: The application entry point that renders the main `App` component.
- **`src/App.tsx`**: Sets up routing with `react-router-dom` and global providers like `QueryClientProvider` and `TooltipProvider`.
- **`src/pages/Index.tsx`**: The main page, which renders the `JobDiscovery` component.
- **`src/components/JobDiscovery.tsx`**: The core component for the job discovery feature. It uses the `useJobDiscovery` hook to manage the chat state, user input, and API interactions.
- **`src/hooks/useJobDiscovery.ts`**: A custom hook that encapsulates the business logic for the job discovery chat, including state management and API calls to the `jobService`.
- **`src/services/jobService.ts`**: Handles the communication with the backend API, including making the request and processing the response.
- **`src/constants/api.ts`**: Contains the API endpoint for the n8n webhook.
- **`src/types/job.ts`**: Defines the TypeScript types for the application, such as `JobDiscoveryState`, `ChatMessage`, and `JobMatch`.
- **`src/components/ui/`**: Contains the UI components from `shadcn/ui`.
- **`src/components/job-discovery/`**: Contains components that are specific to the job discovery feature.

## Common Commands

- **`npm i`**: Install all necessary dependencies.
- **`npm run dev`**: Start the development server. The application will be available at `http://localhost:8080`.
- **`npm run build`**: Build the application for production.
- **`npm run lint`**: Run the linter to check for code quality and style issues.

