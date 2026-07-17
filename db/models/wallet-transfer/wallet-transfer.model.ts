import { model, models, Model, Schema } from "mongoose";

export type TransferDirection = "CC_TO_GC" | "GC_TO_CC";

export type TransferStatus =
  | "pending"
  | "source_debited"
  | "completed"
  | "failed"
  | "reversed";

export interface IWalletTransfer {
  transferId: string;
  ccUserId: string;

  amount: number;
  direction: TransferDirection;

  sourceApp: "CC" | "GC";
  destinationApp: "CC" | "GC";

  localType: "transfer_in" | "transfer_out";
  status: TransferStatus;

  balanceBefore?: number;
  balanceAfter?: number;

  errorMessage?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const walletTransferSchema = new Schema<IWalletTransfer>(
  {
    transferId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    ccUserId: {
      type: String,
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    direction: {
      type: String,
      required: true,
      enum: ["CC_TO_GC", "GC_TO_CC"],
    },

    sourceApp: {
      type: String,
      required: true,
      enum: ["CC", "GC"],
    },

    destinationApp: {
      type: String,
      required: true,
      enum: ["CC", "GC"],
    },

    localType: {
      type: String,
      required: true,
      enum: ["transfer_in", "transfer_out"],
    },

    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "source_debited",
        "completed",
        "failed",
        "reversed",
      ],
      default: "pending",
      index: true,
    },

    balanceBefore: Number,
    balanceAfter: Number,

    errorMessage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const WalletTransfer: Model<IWalletTransfer> =
  models.WalletTransfer ||
  model<IWalletTransfer>("WalletTransfer", walletTransferSchema);

export default WalletTransfer;