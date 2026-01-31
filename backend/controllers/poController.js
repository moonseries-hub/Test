import PO from "../models/Po.js"; // Correct file name case

// GET all POs
export const getAllPOs = async (req, res) => {
  try {
    const pos = await PO.find();
    res.json(pos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create new PO
export const createPO = async (req, res) => {
  try {
    const newPO = new PO(req.body);
    await newPO.save();
    res.status(201).json(newPO);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH consume PO
export const consumePO = async (req, res) => {
  try {
    const { id } = req.params;
    const po = await PO.findById(id);

    if (!po) return res.status(404).json({ message: "PO not found" });

    po.isConsumed = true;
    await po.save();

    res.json(po);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update PO
export const updatePO = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPO = await PO.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedPO) {
      return res.status(404).json({ message: "PO not found" });
    }

    res.json(updatedPO);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE PO
export const deletePO = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPO = await PO.findByIdAndDelete(id);

    if (!deletedPO) {
      return res.status(404).json({ message: "PO not found" });
    }

    res.json({ message: "PO deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
