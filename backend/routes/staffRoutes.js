import express from "express";
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  loginStaff
} from "../controllers/staffController.js";

const router = express.Router();

// Login route
router.post("/login", loginStaff);

// CRUD routes
router.get("/all", getAllStaff);
router.get("/:id", getStaffById);
router.post("/add", createStaff);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;
