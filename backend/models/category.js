import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    makes: {
      type: [String], // array of strings
      default: [],
    },
    models: {
      type: [String], // array of strings
      default: [],
    },
    minStock: {
      type: Number,
      default: 0, // new field
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
