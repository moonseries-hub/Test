import Staff from "../models/Staff.js";
import mongoose from "mongoose";

// ✅ Login
export const loginStaff = async (req, res) => {
  const { username, password } = req.body;

  // Admin credentials
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
    console.error("Login error:", err);
    res.status(500).json({ message: "Error during login" });
  }
};

// ✅ Get all staff
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ username: 1 });
    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching staff" });
  }
};

// ✅ Get single staff
export const getStaffById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid ID" });

  try {
    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching staff" });
  }
};

// ✅ Create staff
export const createStaff = async (req, res) => {
  const { username, password, email, role } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username & password required" });

  try {
    const exists = await Staff.findOne({ username });
    if (exists) return res.status(400).json({ message: "Username already exists" });

    const newStaff = await Staff.create({
      username,
      password,
      email: email || "",
      role: role || "staff",
    });

    res.status(201).json(newStaff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating staff" });
  }
};

// ✅ Update staff
export const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { username, password, email, role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid ID" });

  const updateData = {};
  if (username) updateData.username = username;
  if (password) updateData.password = password;
  if (email) updateData.email = email;
  if (role) updateData.role = role;

  if (Object.keys(updateData).length === 0)
    return res.status(400).json({ message: "No valid fields to update" });

  try {
    const updated = await Staff.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Staff not found" });

    res.json({ message: "Staff updated successfully", staff: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating staff" });
  }
};

// ✅ Delete staff
export const deleteStaff = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid ID" });

  try {
    const deleted = await Staff.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Staff not found" });

    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting staff" });
  }
};
