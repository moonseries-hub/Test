import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newLocationName, setNewLocationName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [categoryMinStock, setCategoryMinStock] = useState(0);

  const [newMake, setNewMake] = useState("");
  const [newModel, setNewModel] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const [errors, setErrors] = useState({
    quantity: "",
    cost: "",
    mirvDate: "",
  });

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    location: "",
    make: "",
    model: "",
    serialNumber: "",
    quantity: "",
    dateOfReceipt: "",
    cost: "",
    po: "",
    mirvDate: "",
    productUpdatingDate: today,
  });

  // Fetch categories & locations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, locRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/locations`),
        ]);
        setCategories(catRes.data);
        setLocations(locRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Handle all field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // QUANTITY VALIDATION
    if (name === "quantity") {
      if (value <= 0) {
        setErrors((prev) => ({ ...prev, quantity: "❌ Quantity must be > 0" }));
      } else if (value < categoryMinStock) {
        setErrors((prev) => ({
          ...prev,
          quantity: `⚠️ Quantity below category minimum stock (${categoryMinStock})`,
        }));
      } else {
        setErrors((prev) => ({ ...prev, quantity: "" }));
      }
    }

    // COST VALIDATION
    if (name === "cost") {
      if (value <= 0) {
        setErrors((prev) => ({ ...prev, cost: "❌ Cost must be > 0" }));
      } else setErrors((prev) => ({ ...prev, cost: "" }));
    }

    // DATE VALIDATIONS
    const receipt = name === "dateOfReceipt" ? value : formData.dateOfReceipt;
    const mirv = name === "mirvDate" ? value : formData.mirvDate;

    // Receipt Date cannot be in future
    if (name === "dateOfReceipt" && value > today) {
      setErrors((prev) => ({
        ...prev,
        mirvDate: "",
        receiptDate: "❌ Date of Receipt cannot be in the future",
      }));
    } else {
      setErrors((prev) => ({ ...prev, receiptDate: "" }));
    }

    // MIRV validation: must be after receipt + not in future
    if (receipt && mirv) {
      if (new Date(mirv) < new Date(receipt)) {
        setErrors((prev) => ({
          ...prev,
          mirvDate: "❌ MIRV Date must be AFTER Date of Receipt",
        }));
      } else if (mirv > today) {
        setErrors((prev) => ({
          ...prev,
          mirvDate: "❌ MIRV Date cannot be in the future",
        }));
      } else {
        setErrors((prev) => ({ ...prev, mirvDate: "" }));
      }
    }

    // On category change update makes/models
    if (name === "category") {
      const selected = categories.find((c) => c._id === value);
      if (selected) {
        setMakes(selected.makes || []);
        setModels(selected.models || []);
        setCategoryMinStock(selected.minStock || 0);
        setFormData((prev) => ({ ...prev, make: "", model: "" }));
      }
    }
  };

  // Add new location
  const handleAddLocation = async () => {
    if (!newLocationName.trim()) return alert("Enter location name");
    try {
      const res = await axios.post(`${API_URL}/locations`, {
        name: newLocationName.trim(),
      });
      setLocations([...locations, res.data]);
      setFormData((prev) => ({ ...prev, location: res.data._id }));
      setNewLocationName("");
      alert("✅ Location added");
    } catch (err) {
      alert("❌ Failed to add location");
    }
  };

  // Add Make / Model
  const handleAddMakeOrModel = async (type) => {
    if (!formData.category) return alert("Select category first!");

    const value = type === "make" ? newMake.trim() : newModel.trim();
    if (!value) return alert(`Enter new ${type}`);

    try {
      await axios.patch(`${API_URL}/categories/${formData.category}/add-${type}`, {
        [type]: value,
      });

      if (type === "make") {
        setMakes((prev) => [...prev, value]);
        setNewMake("");
      } else {
        setModels((prev) => [...prev, value]);
        setNewModel("");
      }

      alert(`✅ ${type} added`);
    } catch (err) {
      alert(`❌ Failed to add ${type}`);
    }
  };

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.quantity || errors.cost || errors.mirvDate || errors.receiptDate) {
      alert("❌ Fix all errors before submitting.");
      return;
    }

    if (!formData.productName || !formData.category || !formData.make || !formData.location) {
      alert("❌ Fill all required fields.");
      return;
    }

    try {
      await axios.post(`${API_URL}/products`, formData);

      alert("✅ Product added successfully!");

      // Reset form
      setFormData({
        productName: "",
        category: "",
        location: "",
        make: "",
        model: "",
        serialNumber: "",
        quantity: "",
        dateOfReceipt: "",
        cost: "",
        po: "",
        mirvDate: "",
        productUpdatingDate: today,
      });
      setMakes([]);
      setModels([]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-8">
      <h2 className="text-3xl font-bold mb-6 text-blue-900 text-center border-b pb-3">
        Add New Product
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        
        {/* Product Name */}
        <div>
          <label>Product Name</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {formData.category && (
            <p className="text-sm mt-1">
              Min Stock: <strong>{categoryMinStock}</strong>
            </p>
          )}
        </div>

        {/* Make */}
        <div>
          <label>Make</label>
          <div className="flex gap-2">
            <select
              name="make"
              value={formData.make}
              onChange={handleChange}
              className="flex-1 border rounded px-3 py-2"
            >
              <option value="">Select Make</option>
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="New Make"
              value={newMake}
              onChange={(e) => setNewMake(e.target.value)}
              className="border rounded px-3 py-2 w-32"
            />

            <button
              type="button"
              onClick={() => handleAddMakeOrModel("make")}
              className="bg-green-500 text-white px-3 rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* Model */}
        <div>
          <label>Model (optional)</label>
          <div className="flex gap-2">
            <select
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="flex-1 border rounded px-3 py-2"
            >
              <option value="">Select Model</option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="New Model"
              value={newModel}
              onChange={(e) => setNewModel(e.target.value)}
              className="border rounded px-3 py-2 w-32"
            />

            <button
              type="button"
              onClick={() => handleAddMakeOrModel("model")}
              className="bg-green-500 text-white px-3 rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label>Quantity Received</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.quantity ? "border-red-500" : ""
            }`}
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>

        {/* Cost */}
        <div>
          <label>Cost</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.cost ? "border-red-500" : ""
            }`}
          />
          {errors.cost && <p className="text-red-500 text-sm">{errors.cost}</p>}
        </div>

        {/* Date of Receipt */}
        <div>
          <label>Date of Receipt</label>
          <input
            type="date"
            name="dateOfReceipt"
            value={formData.dateOfReceipt}
            onChange={handleChange}
            max={today}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.receiptDate && <p className="text-red-500 text-sm">{errors.receiptDate}</p>}
        </div>

        {/* MIRV Date */}
        <div>
          <label>MIRV Date</label>
          <input
            type="date"
            name="mirvDate"
            value={formData.mirvDate}
            onChange={handleChange}
            max={today}
            className={`w-full border rounded px-3 py-2 ${
              errors.mirvDate ? "border-red-500" : ""
            }`}
          />
          {errors.mirvDate && <p className="text-red-500 text-sm">{errors.mirvDate}</p>}
        </div>

        {/* Update Date */}
        <div>
          <label>Product Updating Date</label>
          <input
            type="date"
            name="productUpdatingDate"
            value={formData.productUpdatingDate}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

       
      
        {/* Location */}
        <div>
          <label>Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add new location */}
        <div>
          <label>Add New Location</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New Location"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={handleAddLocation}
              className="bg-green-500 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
        </div>

        {/* Submit button */}
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            ➕ Add Product
          </button>
        </div>
      </form>
    </div>
  );
}


