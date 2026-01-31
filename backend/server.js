import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import poroutes from "./routes/poroutes.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost/test")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/log", logRoutes);
app.use("/api/po", poroutes);

app.get("/api/logs", (req, res) => {
  res.redirect("/api/staff/logs/all");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
