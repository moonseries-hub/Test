// backend/routes/staffRoutes.js
import express from "express";
import Staff from "../models/Staff.js";

const router = express.Router();

// ✅ Login route (admin or staff)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    return res.json({ role: "admin", username: "admin" });
  }

  try {
    const staff = await Staff.findOne({ username, password });
    if (!staff) return res.status(401).json({ message: "Login failed" });

    staff.lastLogin = new Date();
    await staff.save();

    res.json({ role: "staff", staff });
  } catch (err) {
    res.status(500).json({ message: "Error during login" });
  }
});

// ✅ Add new staff
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await Staff.findOne({ username });
    if (exists) return res.status(400).json({ message: "Username already exists" });

    const newStaff = await Staff.create({ username, password });
    res.status(201).json(newStaff);
  } catch (err) {
    res.status(500).json({ message: "Error adding staff" });
  }
});

export default router;
