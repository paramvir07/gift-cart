import mongoose, { model, models, Model, Schema } from "mongoose";

export interface IPayout {
  DrawId: mongoose.ObjectId;
  CustomerId: mongoose.ObjectId;
  PriceAmount: number;
  dividedWeeks: number;
  dividedAmount: number;
  amountLeft: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const PayoutSchema = new Schema<IPayout>(
  {
    DrawId: {
      type: Schema.Types.ObjectId,
      ref: "Draw",
      required: true,
      index: true,
    },
    CustomerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    PriceAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    dividedWeeks: {
      type: Number,
      required: true,
      min: 1,
    },
    dividedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    amountLeft: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Payout: Model<IPayout> = models.Payout || model<IPayout>("Payout", PayoutSchema);

export default Payout;