const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// Routes
app.use("/api/categories", require("./routes/category"));
app.use("/api/products", require("./routes/product")); // <-- add this

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
