
import express from "express";
import mongoose from "mongoose";
import Staff from "../models/Staff.js";

const router = express.Router();

// ✅ Ensure default admin exists
async function ensureAdminExists() {
  const admin = await Staff.findOne({ role: "admin" });
  if (!admin) {
    await Staff.create({
      username: "admin",
      password: "admin123",
      email: "admin@mail.com",
      role: "admin",
    });
    console.log("✅ Default admin created");
  }
}
ensureAdminExists();

// ✅ LOGIN (Admin or Staff)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Staff.findOne({ username, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    user.lastLogin = new Date();
    await user.save();

    res.json({ role: user.role, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error during login" });
  }
});

// ✅ ADD NEW STAFF (/add)
router.post("/add", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const exists = await Staff.findOne({ username });
    if (exists) return res.status(400).json({ message: "Username already exists" });

    const newStaff = await Staff.create({ username, password, email });
    res.status(201).json(newStaff);
  } catch (err) {
    console.error("Add staff error:", err);
    res.status(500).json({ message: "Error adding staff" });
  }
});

// ✅ GET ALL STAFF (/all)
router.get("/all", async (req, res) => {
  try {
    const staff = await Staff.find().sort({ username: 1 });
    res.json(staff);
  } catch (err) {
    console.error("Fetch all staff error:", err);
    res.status(500).json({ message: "Error fetching staff" });
  }
});

// ✅ GET PROFILE BY ID (/profile/:id)
router.get("/profile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ message: "User not found" });

    res.json(staff);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// ✅ UPDATE PROFILE (username, email, password)
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const updated = await Staff.findByIdAndUpdate(
      id,
      { username, email, password },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json(updated);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

export default router;
