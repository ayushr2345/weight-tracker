/**
 * Service module for managing user profile API calls.
 * @remarks
 * Handles fetching and updating the user's biometric baseline.
 */
import apiClient from "./apiClient";
import type {
  Profile,
  UpdateProfilePayload,
} from "@weight-tracker/shared";

export const profileService = {
  /**
   * Fetches the user's profile from the backend.
   *
   * @returns A promise resolving to the user's Profile object.
   */
  getProfile: async (): Promise<Profile> => {
    const response = await apiClient.get<Profile>("/profile/getProfile");
    return response.data;
  },

  /**
   * Creates or updates the user profile.
   *
   * @param data - The profile fields to update (e.g., name, age, height, gender).
   * @returns A promise resolving to the updated Profile object.
   */
  upsertProfile: async (data: UpdateProfilePayload): Promise<Profile> => {
    const response = await apiClient.put<Profile>(
      "/profile/upsertProfile",
      data
    );
    return response.data;
  },
};