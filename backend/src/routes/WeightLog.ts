import express from "express";
import multer from "multer";
import path from "path";
import {
  getWeightLogs,
  createWeightLog,
  updateWeightLog,
  deleteWeightLog,
  uploadWeightLogPhoto,
} from "../controllers/WeightLog.js";

/**
 * Express Router for Weight Logs.
 * @remarks
 * Defines the API endpoints for logging and managing daily weigh-ins.
 * Base path: `/api/weight` (configured in app.ts).
 */
const router = express.Router();

const uploadDir = path.resolve(process.cwd(), "backend/uploads");
const storage = multer.diskStorage({
  destination: (
    _req: express.Request,
    _file: any,
    cb: (error: Error | null, destination: string) => void,
  ) => cb(null, uploadDir),
  filename: (
    _req: express.Request,
    file: any,
    cb: (error: Error | null, filename: string) => void,
  ) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

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
router.post("/uploadPhoto", upload.single("photo"), uploadWeightLogPhoto);

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
router.delete("/deleteWeightLog/:id", deleteWeightLog);

export default router;
