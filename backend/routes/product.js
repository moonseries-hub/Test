// routes/products.js
import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// 🟩 Add new product
router.post("/", async (req, res) => {
  try {
    const {
      productName,
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

    // Validate required fields
    if (!productName || !category || !subCategory || !make || !model || !quantity || !dateOfReceipt || !cost) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = new Product({
      productName,
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

    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: "✅ Product added successfully",
      product: savedProduct,
    });
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ message: err.message });
  }
});

// 🟦 Get all products with populated category & subcategory
router.get("/", async (req, res) => {
  try {
    console.log("📦 Fetching products...");

    const products = await Product.find()
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "subCategory",
        select: "name",
        strictPopulate: false, // avoids errors if no SubCategory model exists
      });

    console.log(`✅ ${products.length} products fetched`);

    // 🧹 Format clean JSON
    const formattedProducts = products.map((prod) => ({
      _id: prod._id,
      productName: prod.productName,
      category: prod.category?.name || "N/A",
      subCategory: prod.subCategory?.name || "N/A",
      make: prod.make,
      model: prod.model,
      specifications: prod.specifications,
      serialNumber: prod.serialNumber,
      quantity: prod.quantity,
      dateOfReceipt: prod.dateOfReceipt,
      cost: prod.cost,
      po: prod.po,
      mirvDate: prod.mirvDate,
      createdAt: prod.createdAt,
      updatedAt: prod.updatedAt,
    }));

    res.status(200).json(formattedProducts);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
