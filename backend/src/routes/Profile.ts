import express from "express";
import multer from "multer";
import path from "path";
import {
  getProfile,
  upsertProfile,
  uploadProfilePhoto,
} from "../controllers/Profile.js";

/**
 * Express Router for User Profile.
 * @remarks
 * Defines the API endpoints for fetching and updating the user's biometric baseline.
 * Base path: `/api/profile` (configured in app.ts).
 */
const router = express.Router();

// Multer storage: save uploads to backend/uploads
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

/**
 * @route POST /uploadPhoto
 * @desc Uploads a profile photo and returns an accessible URL
 */
router.post("/uploadPhoto", upload.single("photo"), uploadProfilePhoto);

export default router;
