import { Request, Response } from "express";
// Assuming you have a Mongoose model setup
import { WeightLogModel } from "../models/WeightLog.js"; 
import { HTTP_STATUS, APP_LIMITS, MONGO_DB_ERRORS } from "@weight-tracker/shared";
import { CreateWeightLogPayload, UpdateWeightLogPayload } from "@weight-tracker/shared";

/**
 * @route POST /api/weight
 * @desc Log a new daily weigh-in
 */
export const createWeightLog = async (req: Request<{}, {}, CreateWeightLogPayload>, res: Response) => {
  try {
    const { weightKg, date, note, photoUrl } = req.body;

    // 1. Sanity Validation against shared APP_LIMITS
    if (weightKg < APP_LIMITS.MIN_WEIGHT_KG || weightKg > APP_LIMITS.MAX_WEIGHT_KG) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: `Weight must be between ${APP_LIMITS.MIN_WEIGHT_KG}kg and ${APP_LIMITS.MAX_WEIGHT_KG}kg.`
      });
    }

    // 2. Normalize the date (Strip out the time to ensure 1 log per day)
    const logDate = new Date(date);
    logDate.setUTCHours(0, 0, 0, 0);

    // 3. Create the log
    const newLog = new WeightLogModel({
      weightKg,
      date: logDate,
      note,
      photoUrl
    });

    const savedLog = await newLog.save();
    return res.status(HTTP_STATUS.CREATED).json(savedLog);

  } catch (error: any) {
    // 4. Handle multiple logs on the same day (assuming you put a unique index on 'date' in Mongoose)
    if (error.code === MONGO_DB_ERRORS.DUPLICATE_KEY) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        error: "A weight log already exists for this date. Please update the existing log instead."
      });
    }

    console.error("Error creating weight log:", error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

/**
 * @route GET /api/weight
 * @desc Fetch weight history (Pagination applied via shared constants)
 */
export const getWeightLogs = async (req: Request, res: Response) => {
  try {
    // Optional query param for pagination: /api/weight?page=1
    const page = parseInt(req.query.page as string) || 1;
    const limit = APP_LIMITS.WEIGHT_LOGS_PER_PAGE;
    const skip = (page - 1) * limit;

    // Fetch logs sorted newest to oldest
    const logs = await WeightLogModel.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for frontend pagination UI
    const totalLogs = await WeightLogModel.countDocuments();

    return res.status(HTTP_STATUS.OK).json({
      data: logs,
      pagination: {
        total: totalLogs,
        page,
        pages: Math.ceil(totalLogs / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching weight logs:", error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

/**
 * @route PUT /api/weight/:id
 * @desc Edit a specific weight entry (Fix typos, add a note/photo later)
 */
export const updateWeightLog = async (req: Request<{ id: string }, {}, UpdateWeightLogPayload>, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // 1. Re-validate weight if it is being updated
    if (updateData.weightKg !== undefined) {
      if (updateData.weightKg < APP_LIMITS.MIN_WEIGHT_KG || updateData.weightKg > APP_LIMITS.MAX_WEIGHT_KG) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: `Weight must be between ${APP_LIMITS.MIN_WEIGHT_KG}kg and ${APP_LIMITS.MAX_WEIGHT_KG}kg.`
        });
      }
    }

    // 2. Perform the update
    const updatedLog = await WeightLogModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedLog) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Weight log not found." });
    }

    return res.status(HTTP_STATUS.OK).json(updatedLog);

  } catch (error) {
    console.error("Error updating weight log:", error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};