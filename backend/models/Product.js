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
    quantity: Number,
    instock: Number,
    sold: Number,
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
