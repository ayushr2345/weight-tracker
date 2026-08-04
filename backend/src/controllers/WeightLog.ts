import { Request, Response } from "express";
import path from "path";
import { WeightLogModel } from "../models/WeightLog.js";
import {
  HTTP_STATUS,
  APP_LIMITS,
  MONGO_DB_ERRORS,
} from "@weight-tracker/shared";
import {
  CreateWeightLogPayload,
  UpdateWeightLogPayload,
} from "@weight-tracker/shared";

/**
 * @route POST /api/weight
 * @desc Log a new daily weigh-in
 */
export const createWeightLog = async (
  req: Request<{}, {}, CreateWeightLogPayload>,
  res: Response,
) => {
  try {
    // TODO(Auth): In Phase 2, extract this from req.user.id instead of req.body
    const { userId, weightKg, date, note, photoUrl } = req.body;

    if (!userId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "userId is required in the payload." });
    }

    if (
      weightKg < APP_LIMITS.MIN_WEIGHT_KG ||
      weightKg > APP_LIMITS.MAX_WEIGHT_KG
    ) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: `Weight must be between ${APP_LIMITS.MIN_WEIGHT_KG}kg and ${APP_LIMITS.MAX_WEIGHT_KG}kg.`,
      });
    }

    console.log("date from req:", date);
    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);
    console.log("new date: ", logDate);
    const newLog = new WeightLogModel({
      userId,
      weightKg,
      date: logDate,
      note,
      photoUrl,
    });

    const savedLog = await newLog.save();
    return res.status(HTTP_STATUS.CREATED).json(savedLog);
  } catch (error: any) {
    if (error.code === MONGO_DB_ERRORS.DUPLICATE_KEY) {
      return res
        .status(HTTP_STATUS.CONFLICT)
        .json({ error: "A weight log already exists for this date." });
    }
    console.error("Error creating weight log:", error);
    return res
      .status(HTTP_STATUS.SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

/**
 * @route POST /api/weight/uploadPhoto
 * @desc Uploads a progress photo for a weight log entry.
 */
export const uploadWeightLogPhoto = async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    if (!file) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "No file uploaded" });
    }

    const host = req.get("host");
    const protocol = req.protocol;
    const filename = path.basename(
      file.path || file.filename || file.originalname,
    );
    const url = `${protocol}://${host}/uploads/${filename}`;

    return res.status(HTTP_STATUS.OK).json({ url });
  } catch (error) {
    console.error("Error uploading weight log photo:", error);
    return res
      .status(HTTP_STATUS.SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

/**
 * @route GET /api/weight
 * @desc Fetch weight history
 * @query userId (required)
 * @query page (optional)
 */
export const getWeightLogs = async (req: Request, res: Response) => {
  try {
    // TODO(Auth): In Phase 2, extract this from req.user.id instead of req.query
    const userId = req.query.userId as string;
    const month = (req.query.month as string | undefined)?.trim();
    const photoOnly = req.query.photoOnly === "true";

    if (!userId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "userId is required as a query parameter." });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = APP_LIMITS.WEIGHT_LOGS_PER_PAGE;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { userId };

    if (month) {
      const monthMatch = month.match(/^(\d{4})-(\d{2})$/);
      if (!monthMatch) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ error: "month must be in YYYY-MM format." });
      }

      const year = Number(monthMatch[1]);
      const monthIndex = Number(monthMatch[2]) - 1;
      const monthStart = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));
      const monthEnd = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0, 0));
      monthEnd.setMilliseconds(monthEnd.getMilliseconds() - 1);

      query.date = { $gte: monthStart, $lte: monthEnd };
    }

    if (photoOnly) {
      query.photoUrl = { $exists: true, $ne: "" };
    }

    const logs = await WeightLogModel.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalLogs = await WeightLogModel.countDocuments(query);

    return res.status(HTTP_STATUS.OK).json({
      data: logs,
      pagination: {
        total: totalLogs,
        page,
        pages: Math.ceil(totalLogs / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching weight logs:", error);
    return res
      .status(HTTP_STATUS.SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

/**
 * @route PUT /api/weight/:id
 * @desc Edit a specific weight entry
 */
export const updateWeightLog = async (
  req: Request<{ id: string }, {}, UpdateWeightLogPayload>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    // TODO(Auth): In Phase 2, extract userId from req.user.id
    const { userId, ...updateData } = req.body;

    if (!userId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "userId is required to authorize this update." });
    }

    if (updateData.weightKg !== undefined) {
      if (
        updateData.weightKg < APP_LIMITS.MIN_WEIGHT_KG ||
        updateData.weightKg > APP_LIMITS.MAX_WEIGHT_KG
      ) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: `Weight must be between ${APP_LIMITS.MIN_WEIGHT_KG}kg and ${APP_LIMITS.MAX_WEIGHT_KG}kg.`,
        });
      }
    }

    const updatedLog = await WeightLogModel.findOneAndUpdate(
      { _id: id, userId: userId },
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedLog) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: "Weight log not found or unauthorized." });
    }

    return res.status(HTTP_STATUS.OK).json(updatedLog);
  } catch (error: any) {
    console.error("Error updating weight log:", error);
    return res
      .status(HTTP_STATUS.SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

/**
 * @route DELETE /deleteWeightLog/:id
 * @desc Remove a specific weight log entry
 */
export const deleteWeightLog = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId as string;

    if (!userId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "userId is required to authorize this deletion." });
    }

    const deletedLog = await WeightLogModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedLog) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: "Weight log not found or unauthorized." });
    }

    return res
      .status(HTTP_STATUS.OK)
      .json({ message: "Weight log deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting weight log:", error);
    return res
      .status(HTTP_STATUS.SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
