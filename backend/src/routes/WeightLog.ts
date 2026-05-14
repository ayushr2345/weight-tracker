import express from "express";
import {
  getWeightLogs,
  createWeightLog,
  updateWeightLog,
} from "../controllers/WeightLog.js";

/**
 * Express Router for Weight Logs.
 * @remarks
 * Defines the API endpoints for logging and managing daily weigh-ins.
 * Base path: `/api/weight` (configured in app.ts).
 */
const router = express.Router();

/**
 * @route GET /getWeightLogs
 * @description Retrieves a paginated list of historical weight logs.
 * @remarks
 * - Sorted newest to oldest.
 * - Supports pagination via query params (e.g., ?page=1).
 * @access Public
 */
router.get("/getWeightLogs", getWeightLogs);

/**
 * @route POST /createWeightLog
 * @description Logs a new daily weigh-in.
 * @remarks
 * - Expects a JSON body with `weightKg` and `date`.
 * - Prevents duplicate logs for the same day via Mongoose unique index.
 * @access Public
 */
router.post("/createWeightLog", createWeightLog);

/**
 * @route PATCH /updateWeightLog/:id
 * @description Edits an existing weight log.
 * @param {string} id - The MongoDB ObjectId of the log to update.
 * @remarks
 * - Expects a JSON body with partial fields (e.g., fixing a typo in weight, or adding a note).
 * - Re-runs database validation on the updated weight.
 * @access Public
 */
router.patch("/updateWeightLog/:id", updateWeightLog);

export default router;