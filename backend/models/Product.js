import mongoose from "mongoose";

const consumptionRecordSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  usedAtLocation: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  date: { type: Date, default: Date.now },
  remarks: { type: String, default: "" },
});

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    make: String,
    model: String,
    serialNumber: String,
    quantity: { type: Number, default: 0 },
    instock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    minStock: { type: Number, default: 0 }, // ✅ Added minStock
    dateOfReceipt: Date,
    cost: Number,
    po: String,
    productUpdatingDate: Date,
    mirvDate: Date,
    consumptionRecords: [consumptionRecordSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
