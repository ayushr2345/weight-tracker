import express from "express";
import {
  getProfile,
  upsertProfile,
} from "../controllers/Profile.js";

/**
 * Express Router for User Profile.
 * @remarks
 * Defines the API endpoints for fetching and updating the user's biometric baseline.
 * Base path: `/api/profile` (configured in app.ts).
 */
const router = express.Router();

/**
 * @route GET /getProfile
 * @description Retrieves the user's profile data.
 * @remarks
 * - Since this is a personal app, fetches the single active profile document.
 * @access Public
 */
router.get("/getProfile", getProfile);

/**
 * @route PUT /upsertProfile
 * @description Creates the profile if it doesn't exist, or updates it if it does.
 * @remarks
 * - Expects a JSON body with profile fields (`name`, `age`, `heightCm`, `gender`, etc.).
 * - Validates all biometrics against `APP_LIMITS` before saving.
 * @access Public
 */
router.put("/upsertProfile", upsertProfile);

export default router;