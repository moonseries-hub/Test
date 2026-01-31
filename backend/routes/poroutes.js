
import express from "express";
import {
  getAllPOs,
  createPO,
  updatePO,
  deletePO,
  consumePO, // new controller
} from "../controllers/poController.js";

const router = express.Router();

// GET all POs
router.get("/", getAllPOs);

// POST a new PO
router.post("/", createPO);

// PUT update PO
router.put("/:id", updatePO);

// PATCH consume PO
router.patch("/:id/consume", consumePO);

// DELETE PO
router.delete("/:id", deletePO);

export default router;

