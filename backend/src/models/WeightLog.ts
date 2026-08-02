import mongoose, { Schema, Document } from "mongoose";
import { APP_LIMITS } from "@weight-tracker/shared";
import { WeightLogEntry } from "@weight-tracker/shared";

// Omit Mongoose-managed fields from our TS interface for the Schema definition
export interface IWeightLogDocument
  extends Omit<WeightLogEntry, "_id" | "createdAt" | "updatedAt">, Document {}

const WeightLogSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile", // Links to Profile model
      required: [true, "User ID is required"],
    },
    weightKg: {
      type: Number,
      required: [true, "Weight is required"],
      min: [
        APP_LIMITS.MIN_WEIGHT_KG,
        `Weight cannot be less than ${APP_LIMITS.MIN_WEIGHT_KG}kg`,
      ],
      max: [
        APP_LIMITS.MAX_WEIGHT_KG,
        `Weight cannot exceed ${APP_LIMITS.MAX_WEIGHT_KG}kg`,
      ],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, "Note cannot exceed 500 characters"],
      default: "",
    },
    photoUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
);

// Create indexes: compound unique index per user per date, and sort index by date
WeightLogSchema.index({ userId: 1, date: 1 }, { unique: true });
WeightLogSchema.index({ date: -1 });

export const WeightLogModel = mongoose.model<IWeightLogDocument>(
  "WeightLog",
  WeightLogSchema,
);
