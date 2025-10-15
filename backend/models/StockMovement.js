import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    type: { type: String, enum: ["received", "consumed"], required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    user: { type: String }, // optional: admin/staff
    usedAtLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    remarks: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("StockMovement", stockMovementSchema);
