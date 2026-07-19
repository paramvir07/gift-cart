import mongoose, { model, models, Model, Schema } from "mongoose"

export interface ITicket {
  DrawId: mongoose.ObjectId
  CustomerId: mongoose.ObjectId
  amount: number
  createdAt?: Date
  updatedAt?: Date
}

const TicketSchema = new Schema<ITicket>(
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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
)

const Ticket: Model<ITicket> =
  models.Ticket || model<ITicket>("Ticket", TicketSchema)

export default Ticket
