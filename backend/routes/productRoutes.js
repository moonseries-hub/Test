import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Location from "../models/Location.js";

const router = express.Router();

/* -------------------- GET ALL PRODUCTS -------------------- */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("location", "name")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

/* -------------------- ADD PRODUCT -------------------- */
router.post("/", async (req, res) => {
  try {
    const {
      productName,
      category,
      location,
      make,
      model,
      serialNumber,
      quantity,
      minStock, // ✅ include minStock
      dateOfReceipt,
      cost,
      po,
      productUpdatingDate,
      mirvDate,
    } = req.body;

    const cat = await Category.findById(category);
    const loc = await Location.findById(location);

    if (!cat) return res.status(404).json({ error: "Category not found" });
    if (!loc) return res.status(404).json({ error: "Location not found" });

    const product = await Product.create({
      productName,
      category,
      categoryName: cat.name,
      location,
      locationName: loc.name,
      make,
      model,
      serialNumber,
      quantity: initialQty,
      instock: initialQty,
      sold: 0,
      minstock: cat.minStock,
      dateOfReceipt,
      cost,
      po,
      productUpdatingDate,
      mirvDate,
      consumptionRecords: [],
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Error adding product" });
  }
});

/* -------------------- UPDATE PRODUCT -------------------- */
router.put("/:id", async (req, res) => {
  try {
    const {
      productName,
      category,
      location,
      make,
      model,
      serialNumber,
      quantity,
      instock,
      sold,
      minstock,
      dateOfReceipt,
      cost,
      po,
      productUpdatingDate,
      mirvDate,
    } = req.body;

    const cat = await Category.findById(category);
    const loc = await Location.findById(location);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        productName,
        category,
        categoryName: cat ? cat.name : undefined,
        location,
        locationName: loc ? loc.name : undefined,
        make,
        model,
        serialNumber,
        quantity,
        instock,
        sold,
        minstock,
        dateOfReceipt,
        cost,
        po,
        productUpdatingDate,
        mirvDate,
      },
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ error: "Product not found" });

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Error updating product" });
  }
});

/* -------------------- DELETE PRODUCT -------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Error deleting product" });
  }
});

export default router;
