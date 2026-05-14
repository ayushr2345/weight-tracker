import { Request, Response } from "express";
import { ProfileModel } from "../models/Profile.js";
import { HTTP_STATUS, APP_LIMITS } from "@weight-tracker/shared";
import { UpdateProfilePayload } from "@weight-tracker/shared";

/**
 * @route GET /api/profile
 * @desc Fetch the user's profile data
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    // Since this is a personal app MVP, we just fetch the first profile found.
    // If you add Auth later, this becomes: ProfileModel.findOne({ userId: req.user.id })
    const profile = await ProfileModel.findOne();

    if (!profile) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Profile not found. Please create one." });
    }

    return res.status(HTTP_STATUS.OK).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

/**
 * @route PUT /api/profile
 * @desc Create or Update the profile (Upsert)
 */
export const upsertProfile = async (req: Request<{}, {}, UpdateProfilePayload>, res: Response) => {
  try {
    const updateData = req.body;

    // Optional: Add manual validation here if needed, but Mongoose will catch standard violations
    if (updateData.heightCm && (updateData.heightCm < APP_LIMITS.MIN_HEIGHT_CM || updateData.heightCm > APP_LIMITS.MAX_HEIGHT_CM)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Invalid height range." });
    }

    // Upsert Logic: Find the first document and update it. 
    // If it doesn't exist (upsert: true), create it with setDefaultsOnInsert.
    const updatedProfile = await ProfileModel.findOneAndUpdate(
      {}, // Empty filter targets the first document
      { $set: updateData },
      { 
        new: true, // Return the modified document
        upsert: true, // Create if it doesn't exist
        runValidators: true, // Enforce the Mongoose schema limits
        setDefaultsOnInsert: true 
      }
    );

    return res.status(HTTP_STATUS.OK).json(updatedProfile);

  } catch (error: any) {
    console.error("Error upserting profile:", error);
    
    // Catch Mongoose Validation Errors beautifully
    if (error.name === "ValidationError") {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }

    return res.status(HTTP_STATUS.SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};