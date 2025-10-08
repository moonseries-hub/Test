const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/Category");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name subCategories")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// POST add new product
router.post("/", async (req, res) => {
  try {
    const {
      category,
      subCategory,
      make,
      model,
      specifications,
      serialNumber,
      quantity,
      dateOfReceipt,
      cost,
      po,
      mirvDate,
    } = req.body;

    // Validate subcategory exists
    const cat = await Category.findById(category);
    if (!cat) return res.status(400).json({ error: "Category not found" });

    if (!cat.subCategories.some((sub) => sub._id.toString() === subCategory)) {
      return res.status(400).json({ error: "Subcategory not found in selected category" });
    }

    const product = await Product.create({
      category,
      subCategory,
      make,
      model,
      specifications,
      serialNumber,
      quantity,
      dateOfReceipt,
      cost,
      po,
      mirvDate,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding product" });
  }
});

module.exports = router;
