/**
 * @fileoverview Shared Type Definitions for Weight Logs.
 * This file defines the data structure for daily weigh-in entries.
 */

export interface WeightLogEntry {
  /** The unique MongoDB document identifier. */
  _id: string;

  /** * The actual weight recorded. 
   * @remarks ALWAYS stored in kilograms on the backend, regardless of user preference.
   */
  weightKg: number;

  /** * The date this weigh-in represents.
   * @remarks Usually stored at midnight (00:00:00) UTC for that specific day to prevent timezone shifting.
   */
  date: Date;

  /** Optional journal entry or notes about this specific day (e.g., "Ate heavy dinner yesterday"). */
  note?: string;

  /** Optional URL linking to an S3/Cloudinary progress picture. */
  photoUrl?: string;

  /** Automatically managed by Mongoose timestamps. */
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payload for logging a new weight entry.
 */
export type CreateWeightLogPayload = Pick<
  WeightLogEntry,
  "weightKg" | "date"
> & Partial<Pick<WeightLogEntry, "note" | "photoUrl">>;

/**
 * Payload for editing a past weight entry (e.g., fixing a typo).
 */
export type UpdateWeightLogPayload = Partial<CreateWeightLogPayload>;