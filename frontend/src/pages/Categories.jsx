import React, { useState } from "react";

export default function Categories() {
  const [categories, setCategories] = useState([
    { name: "Controllers", sub: ["Omron", "Delta Tau"] },
    { name: "Servo Drives", sub: ["E180", "E190"] },
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [newSub, setNewSub] = useState("");

  const addCategory = () => {
    if (newCategory) {
      setCategories([...categories, { name: newCategory, sub: [] }]);
      setNewCategory("");
    }
  };

  const addSub = (index) => {
    if (newSub) {
      const updated = [...categories];
      updated[index].sub.push(newSub);
      setCategories(updated);
      setNewSub("");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="p-2 border rounded border-gray-300"
        />
        <button onClick={addCategory} className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700">
          Add Category
        </button>
      </div>

      {categories.map((cat, i) => (
        <div key={i} className="bg-white p-4 rounded shadow mb-4">
          <h3 className="font-semibold">{cat.name}</h3>
          <ul className="ml-4 list-disc mb-2">
            {cat.sub.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New Subcategory"
              value={newSub}
              onChange={(e) => setNewSub(e.target.value)}
              className="p-2 border rounded border-gray-300"
            />
            <button
              onClick={() => addSub(i)}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Add Subcategory
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
