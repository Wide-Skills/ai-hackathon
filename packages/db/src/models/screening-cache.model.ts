import mongoose from "mongoose";

const { Schema } = mongoose;

const screeningCacheSchema = new Schema(
  {
    promptHash: { type: String, required: true, index: true },
    output: { type: Schema.Types.Mixed, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true },
);

export interface ScreeningCacheDocument extends mongoose.Document {
  promptHash: string;
  output: any;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const ScreeningCache = mongoose.models.ScreeningCache
  ? mongoose.model<ScreeningCacheDocument>("ScreeningCache")
  : mongoose.model<ScreeningCacheDocument>(
      "ScreeningCache",
      screeningCacheSchema,
    );
