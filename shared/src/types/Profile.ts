/**
 * @fileoverview Shared Type Definitions for User Profile.
 * This file defines the core Biometric and Preference data for the user.
 * It strictly avoids Node.js/Mongoose dependencies to remain lightweight for the Frontend.
 */

export interface Profile {
  /** The unique MongoDB document identifier. */
  _id: string;

  /** The display name of the user. */
  name: string;

  /** An optional short bio or current fitness goal. */
  status?: string;

  /** The user's age. */
  age: number;

  /** The user's gender for baseline biometric calculations. */
  gender: "male" | "female" | "other";

  /** The user's height strictly stored in centimeters for backend consistency. */
  heightCm: number;

  /** The user's preferred unit system for frontend display conversions. */
  unitSystem: "metric" | "imperial";

  /** Timestamp when the profile was created. */
  createdAt: Date;

  /** Timestamp when the profile biometrics were last updated. */
  updatedAt: Date;
}

/**
 * Payload for creating a new profile.
 */
export type CreateProfilePayload = Omit<
  Profile,
  "_id" | "createdAt" | "updatedAt"
>;

/**
 * Payload for updating an existing profile.
 * All fields are optional so the user can update just their weight or just their status.
 */
export type UpdateProfilePayload = Partial<CreateProfilePayload>;