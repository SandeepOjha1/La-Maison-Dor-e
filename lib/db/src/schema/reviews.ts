import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IReview extends Document {
  customerName: string;
  customerEmail: string | null;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: null },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    approved: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const ReviewModel: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
