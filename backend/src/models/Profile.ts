import mongoose, { Schema, Document } from "mongoose";
import { APP_LIMITS } from "@weight-tracker/shared";
import { Profile } from "@weight-tracker/shared";

export interface IProfileDocument
  extends Omit<Profile, "_id" | "createdAt" | "updatedAt">, Document {}

const ProfileSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [
        APP_LIMITS.MAX_NAME_LENGTH,
        `Name cannot exceed ${APP_LIMITS.MAX_NAME_LENGTH} characters`,
      ],
    },
    status: {
      type: String,
      trim: true,
      maxlength: [
        APP_LIMITS.MAX_STATUS_LENGTH,
        `Status cannot exceed ${APP_LIMITS.MAX_STATUS_LENGTH} characters`,
      ],
      default: "",
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [APP_LIMITS.MIN_AGE, `Age must be at least ${APP_LIMITS.MIN_AGE}`],
      max: [APP_LIMITS.MAX_AGE, `Age cannot exceed ${APP_LIMITS.MAX_AGE}`],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: APP_LIMITS.VALID_GENDERS,
        message: "{VALUE} is not a valid gender option",
      },
    },
    heightCm: {
      type: Number,
      required: [true, "Height is required"],
      min: [
        APP_LIMITS.MIN_HEIGHT_CM,
        `Height must be at least ${APP_LIMITS.MIN_HEIGHT_CM}cm`,
      ],
      max: [
        APP_LIMITS.MAX_HEIGHT_CM,
        `Height cannot exceed ${APP_LIMITS.MAX_HEIGHT_CM}cm`,
      ],
    },
    unitSystem: {
      type: String,
      required: [true, "Unit system preference is required"],
      enum: {
        values: APP_LIMITS.VALID_UNIT_SYSTEMS,
        message: "{VALUE} is not a supported unit system",
      },
      default: "metric",
    },
    photoUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const ProfileModel = mongoose.model<IProfileDocument>(
  "Profile",
  ProfileSchema,
);
