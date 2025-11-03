import express from "express";
import Staff from "../models/Staff.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Register new staff (admin only)
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await Staff.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });

    const staff = new Staff({ username, password });
    await staff.save();

    res.status(201).json({ message: "Staff added successfully", staff });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Staff login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const staff = await Staff.findOne({ username });

    if (!staff)
      return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await staff.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid username or password" });

    // 🔹 Update last login timestamp
    staff.lastLogin = new Date();
    await staff.save();

    // 🔹 Create JWT token
    const token = jwt.sign(
      { id: staff._id, username: staff.username, role: "staff" },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      staff: {
        id: staff._id,
        username: staff.username,
        email: staff.email || "",
        lastLogin: staff.lastLogin,
      },
      emailMissing: !staff.email, // used for notifications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get all staff (for admin dashboard)
router.get("/", async (req, res) => {
  try {
    const staffList = await Staff.find().select("-password");
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch staff", error });
  }
});

// ✅ Update staff password
router.patch("/:id/password", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password)
      return res.status(400).json({ message: "Password required" });

    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    staff.password = password;
    await staff.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update staff", error });
  }
});

// ✅ Update staff email (used from profile)
router.patch("/:id/email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    staff.email = email;
    await staff.save();

    res.json({ message: "Email updated successfully", email: staff.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update email", error });
  }
});

// ✅ Get profile (for frontend)
router.get("/profile/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select("-password");
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
