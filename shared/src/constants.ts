/**
 * Base time calculations (in milliseconds).
 * Useful for streak calculations, 7-day rolling averages, and date math.
 */
const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/**
 * Default ports for backend and frontend.
 * Shifted to 5060/5061 to prevent conflicts with the Activity Tracker (5050/5051).
 */
const BACKEND_PORT = 5060;
const FRONTEND_PORT = 5061;

/**
 * Standard HTTP Status Codes used across the application API.
 * Centralizing these prevents magic numbers in controllers and standardizes frontend API handling.
 */
export const HTTP_STATUS = {
  /** 200: Standard response for successful HTTP requests (e.g., GET, PUT). */
  OK: 200,
  /** 201: The request has been fulfilled, resulting in the creation of a new resource (e.g., POST new weight log). */
  CREATED: 201,
  /** 204: The server successfully processed the request and is not returning any content (e.g., DELETE). */
  NO_CONTENT: 204,
  /** 400: The server cannot process the request due to a client error (e.g., negative weight entered). */
  BAD_REQUEST: 400,
  /** 401: The request lacks valid authentication credentials for the target resource. */
  UNAUTHORIZED: 401,
  /** 404: The requested resource could not be found. */
  NOT_FOUND: 404,
  /** 409: The request could not be completed due to a conflict (e.g., trying to log weight twice on the same day). */
  CONFLICT: 409,
  /** 500: A generic error message, given when an unexpected condition was encountered on the server. */
  SERVER_ERROR: 500,
};

/**
 * Global application limits and thresholds for the Weight Tracker.
 * Shared between frontend validation and backend enforcement to ensure a single source of truth
 * and prevent database garbage data (like someone entering a height of 5000 cm).
 */
export const APP_LIMITS = {
  // --- Profile Text Limits ---
  /** Maximum allowed characters for a user's display name. */
  MAX_NAME_LENGTH: 50,
  
  /** Maximum allowed characters for the user's status/tagline to prevent UI breaking. */
  MAX_STATUS_LENGTH: 150,

  // --- Biometric Sanity Limits (Metric Baseline) ---
  /** Minimum valid weight in kilograms (e.g., 10kg to prevent negative/zero values). */
  MIN_WEIGHT_KG: 10,
  /** Maximum valid weight in kilograms (e.g., 500kg). */
  MAX_WEIGHT_KG: 500,

  /** Minimum valid height in centimeters (e.g., 50cm). */
  MIN_HEIGHT_CM: 50,
  /** Maximum valid height in centimeters (e.g., 300cm). */
  MAX_HEIGHT_CM: 300,

  /** Minimum valid age. */
  MIN_AGE: 10,
  /** Maximum valid age. */
  MAX_AGE: 120,

  // --- Enums & Options ---
  /** Valid gender options matching the Mongoose schema. */
  VALID_GENDERS: ["male", "female", "other"] as const,
  
  /** Valid unit system preferences. */
  VALID_UNIT_SYSTEMS: ["metric", "imperial"] as const,

  // --- Data & Media Limits ---
  /** Maximum file size for progress photo uploads (5MB in bytes). */
  MAX_PHOTO_SIZE_BYTES: 5 * 1024 * 1024,

  /** Number of daily weight logs to fetch per page for the History/Gallery views (30 = roughly 1 month). */
  WEIGHT_LOGS_PER_PAGE: 30,

  /** Number of days to use when calculating the running/rolling average trendline. */
  ROLLING_AVERAGE_DAYS: 7,
};

/**
 * MongoDB-specific error codes to avoid hardcoding database errors in the backend controllers.
 */
export const MONGO_DB_ERRORS = {
  /** Error code 11000: Thrown by Mongoose/MongoDB when a unique index constraint is violated. */
  DUPLICATE_KEY: 11000,
};

/**
 * Default ports for frontend and backend
 */
export const DEFAULT_PORTS = {
  DEFAULT_PORT_BACKEND: BACKEND_PORT,
  DEFAULT_PORT_FRONTEND: FRONTEND_PORT,
};

/**
 * Shared Time Constants for frontend/backend utility functions.
 */
export const TIME = {
  SEC,
  MIN,
  HOUR,
  DAY
};