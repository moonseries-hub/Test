// backend/models/Staff.js
import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastLogin: { type: Date },
});

export default mongoose.model("Staff", staffSchema);
