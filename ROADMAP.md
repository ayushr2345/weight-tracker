# 🗺️ Weight Tracker Project Roadmap

## Phase 1: Core MVP (The 48-Hour Sprint & Fast Follows)
*   [ ] **Backend Setup (MERN):** Initialize Node/Express server and connect to MongoDB.
*   [ ] **Database Schema:** - [ ] Create `UserProfile` model (Name, Height, Metric/Imperial preference).
    *   [ ] Create `WeightLog` model (Date, Weight, Photo URL/Reference).
*   [ ] **Core UI & Aesthetics:** Clone and strip down the Activity Tracker React boilerplate to match the established design system.
*   [ ] **Profile Management:**
    *   [ ] Create an editable dashboard for Age, Gender, Height, and Unit System.
    *   [ ] Implement logic to lock profile fields after initial setup.
*   [ ] **Daily Logging Entry:** - [ ] Form to input daily weight.
    *   [ ] Form/Upload component for daily progress photos.
*   [ ] **Dashboard Metrics:** - [ ] Display "Today's Weight" and "Last Added Weight".
    *   [ ] Calculate and display the 7-day running average.
    *   [ ] Calculate and display daily BMI based on locked profile height.
*   [ ] **Data Visualization (The 3 Graphs):**
    *   [ ] Line chart for standard Weight Trend.
    *   [ ] Smoothed line chart for 7-Day Rolling Average.
    *   [ ] Line chart for BMI Trend over time.

## Phase 2: Reliability & Engineering Standards
*   [ ] **Refactoring & Cleanup:**
    *   [ ] **Custom Hooks:** Extract logic into `useWeightData`, `useProfileManager`, and `useMetrics`.
    *   [ ] **Utility Functions:** Create `utils.ts` for BMI calculation, rolling average math, and metric/imperial conversions.
    *   [ ] **Type Safety:** Ensure strict TypeScript interfaces for `UserProfile` and `WeightLog` across frontend and backend.
*   [ ] **Unit Testing Setup (Frontend):**
    *   [ ] Copy Vitest & React Testing Library setup from Activity Tracker.
*   [ ] **Critical Logic Tests:**
    *   [ ] Write unit tests for BMI math and running average calculators in `utils.test.ts`.
    *   [ ] Write unit tests for data hooks (`useWeightData.test.ts`).

## Phase 3: Infrastructure & DevOps (The "Copy-Paste" Setup)
*   [ ] **Dockerization:**
    *   [ ] Replicate `Dockerfile` for Frontend and Backend.
    *   [ ] Set up the 3-environment architecture (`docker-compose.prod.yml`, `docker-compose.dev.yml`, and local dev).
    *   [ ] Ensure MongoDB data persistence and 24H backup scripts are ported over.
*   [ ] **Dynamic Ports & Environment:**
    *   [ ] Port over single `.env` file dynamic routing.
*   [ ] **CI/CD Pipeline:**
    *   [ ] Clone `.github/workflows/ci.yml` for automated testing on master PRs.
    *   [ ] Set up CD script on the ThinkCentre server to auto-pull and build on new commits.

## Phase 4: Expansion (Features v2.0)
*   [ ] **Authentication:** - [ ] Implement Google OAuth.
    *   [ ] Implement standard Email/Password login.
*   [ ] **The Gallery View:**
    *   [ ] Build a grid/gallery layout to visually track physical changes over time via the daily photos.
    *   [ ] Add filtering (e.g., "Show me day 1 vs day 30").
*   [ ] **Gamification:**
    *   [ ] Calculate and display "Current Streak" (days logged in a row).
    *   [ ] Add visual milestones (e.g., "10 Days Logged", "5% Body Weight Lost").
*   [ ] **Live Hosting:** - [ ] Route the production Docker container to the live custom domain.

## Phase 5: Documentation & Polish
*   [ ] **PRD (Product Requirements Doc):** Document the core logic, especially around the math for the rolling averages.
*   [ ] **TRD (Technical Requirements Doc):** Map out the MongoDB schemas and the API routing.
*   [ ] **README:** Add screenshots of the 3 graphs, the gallery view, and deployment instructions.