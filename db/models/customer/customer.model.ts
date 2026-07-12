import { model, models, Model, Schema } from "mongoose";

export interface IGCCustomer {
  ccUserId: string;
  name: string;
  email: string;
  phone?: string;
  walletBalance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const customerSchema = new Schema<IGCCustomer>(
  {
    ccUserId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      index: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    walletBalance: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Wallet balance cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

const GCCustomer: Model<IGCCustomer> =
  models.GCCustomer ||
  model<IGCCustomer>("GCCustomer", customerSchema);

export default GCCustomer;