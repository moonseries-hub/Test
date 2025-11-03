// backend/routes/logRoutes.js
import express from "express";
import Log from "../models/Log.js";

const router = express.Router();

// ✅ Fetch logs of a specific user
router.get("/:userId", async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.params.userId }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error("❌ Log fetch error:", err);
    res.status(500).json({ message: "Error fetching logs" });
  }
});

// ✅ Fetch all logs (for Admin view)
router.get("/", async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error("❌ Fetch all logs error:", err);
    res.status(500).json({ message: "Error fetching all logs" });
  }
});

export default router;
