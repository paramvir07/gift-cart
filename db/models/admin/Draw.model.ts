import mongoose, { model, models, Model, Schema } from "mongoose";

export interface IDraw {
  name: string;
  description?: string;
  BannerImage?:string;
  entryAmount: number;
  priceMoney: number;
  startsAt: Date;
  endsAt: Date;
  status: "upcoming" | "active" | "completed";
  winnerTicketId?: mongoose.Types.ObjectId;
  winnerCustomerId?: mongoose.Types.ObjectId;
  drawnAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const DrawSchema = new Schema<IDraw>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    BannerImage:{
      type:String
    },
    entryAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    priceMoney: {
      type: Number,
      required: true,
      min: 0,
    },
    startsAt: {
      type: Date,
      required: true,
    },
    endsAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed"],
      default: "upcoming",
    },
    winnerTicketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
    },
    winnerCustomerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
  },
  {
    timestamps: true,
  }
);

const Draw: Model<IDraw> = models.Draw || model<IDraw>("Draw", DrawSchema);

export default Draw;