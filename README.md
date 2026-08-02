# Weight Tracker

Weight Tracker is a full-stack web application for monitoring body weight trends, BMI, and progress photos over time. It combines a polished React dashboard with a Node.js/Express backend and MongoDB persistence so users can log weigh-ins, review historical trends, and manage profile information from a single experience.

## Highlights

- Track daily weight entries with a simple logging flow
- Visualize trends with interactive charts for weight and BMI
- Review progress photos in a dedicated gallery view
- Manage profile details, height, age, and profile images
- Use a responsive, modern UI designed for daily use

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Recharts for charts and trend visualization
- Lucide React for icons
- Axios for API communication

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- Multer for image uploads
- CORS and dotenv support

### Shared
- TypeScript shared types and constants for frontend and backend consistency

## Project Structure

- frontend/: React application and UI components
- backend/: Express API, controllers, routes, models, and file upload handling
- shared/: Shared types, constants, and cross-package utilities

## Features

- Daily weight logging
- Historical weight trend analysis
- BMI trend calculations based on profile height
- Rolling average insights
- Photo uploads tied to weight logs
- Profile photo management
- Responsive dashboards and detail pages

## Local Development

### Prerequisites
- Node.js 18+
- npm or pnpm
- MongoDB running locally or a reachable MongoDB URI

### Installation

1. Clone the repository
2. Install dependencies from the workspace root:
   ```bash
   npm install
   ```
3. Create a local environment file for the backend if needed and provide your MongoDB connection string.
4. Start the development servers:
   ```bash
   npm --workspace backend run dev
   npm --workspace frontend run dev
   ```

### Available Scripts

- Root workspace: manages shared package dependencies
- Backend:
  - npm --workspace backend run dev
  - npm --workspace backend run build
- Frontend:
  - npm --workspace frontend run dev
  - npm --workspace frontend run build
  - npm --workspace frontend run lint

## Environment Notes

The backend expects a configured MongoDB connection and any required environment variables for the application runtime. Ensure your local environment points to a valid database instance before starting the API.

## Roadmap

The project continues to evolve with improvements around authentication, richer analytics, and more advanced reporting.
