import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IReservation extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guestCount: number;
  specialRequests: string | null;
  status: string;
  createdAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guestCount: { type: Number, required: true },
    specialRequests: { type: String, default: null },
    status: { type: String, required: true, default: "pending" },
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

export const ReservationModel: Model<IReservation> =
  mongoose.models.Reservation ||
  mongoose.model<IReservation>("Reservation", ReservationSchema);
