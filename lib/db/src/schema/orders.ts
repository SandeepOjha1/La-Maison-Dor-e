import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
}

export interface IOrder extends Document {
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
  notes: string | null;
  status: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    category: { type: String, required: true, default: "" },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, default: null },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String, default: null },
    notes: { type: String, default: null },
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

export const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
