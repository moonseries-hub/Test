import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  username: { type: String, required: true },
  role: { type: String, enum: ["admin", "staff"], default: "staff" },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Log", logSchema);
