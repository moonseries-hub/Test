import express from "express";
import Location from "../models/Location.js";

const router = express.Router();

// GET all locations
router.get("/", async (req, res) => {
  try {
    // Fetch all locations, sorted by creation date
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (err) {
    console.error("Error fetching locations:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST add new location
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    // Validate input
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Location name required" });
    }

    // Check if location already exists
    const existing = await Location.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ error: "Location already exists" });
    }

    // Create and save new location
    const newLocation = new Location({ name: name.trim() });
    await newLocation.save();

    res.status(201).json(newLocation);
  } catch (err) {
    console.error("Error adding location:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
