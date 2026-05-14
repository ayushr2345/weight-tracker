/**
 * Service module for managing weight log API calls.
 * @remarks
 * Handles CRUD operations for daily weigh-in entries.
 */
import apiClient from "./apiClient";
import type {
  WeightLogEntry,
  CreateWeightLogPayload,
  UpdateWeightLogPayload,
} from "@weight-tracker/shared";

// Interface for the paginated backend response
export interface PaginatedWeightLogs {
  data: WeightLogEntry[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export const weightLogService = {
  /**
   * Fetches a paginated list of weight logs from the backend.
   *
   * @param page - The page number to fetch (defaults to 1).
   * @returns A promise resolving to an array of logs and pagination metadata.
   */
  getWeightLogs: async (
    userId: string,
    page: number = 1
  ): Promise<PaginatedWeightLogs> => {
    const response = await apiClient.get<PaginatedWeightLogs>(
      `/weight/getWeightLogs?userId=${encodeURIComponent(userId)}&page=${page}`
    );
    return response.data;
  },

  /**
   * Logs a new daily weigh-in.
   *
   * @param data - The payload containing the weight and date.
   * @returns A promise resolving to the newly created WeightLogEntry.
   */
  createWeightLog: async (
    data: CreateWeightLogPayload
  ): Promise<WeightLogEntry> => {
    const response = await apiClient.post<WeightLogEntry>(
      "/weight/createWeightLog",
      data
    );
    return response.data;
  },

  /**
   * Edits an existing weight log.
   *
   * @param logId - The unique ID of the weight log to update.
   * @param updatedData - The fields to modify (e.g., weightKg, note, photoUrl).
   * @returns A promise resolving to the updated WeightLogEntry.
   */
  updateWeightLog: async (
    logId: string,
    updatedData: UpdateWeightLogPayload
  ): Promise<WeightLogEntry> => {
    const response = await apiClient.patch<WeightLogEntry>(
      `/weight/updateWeightLog/${logId}`,
      updatedData
    );
    return response.data;
  },
};