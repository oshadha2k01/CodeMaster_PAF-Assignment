import React, { useState } from "react";
import axios from "axios";

function AddFood() {
  const [formdata, setFormdata] = useState({
    name: "",
    ingrediants: "",
    category: "Food", // Default value set to "Food"
    price: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/foods", formdata)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">
          Add New Food Item
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Food Name"
            value={formdata.name}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <input
            type="text"
            name="ingrediants"
            placeholder="Ingredients"
            value={formdata.ingrediants}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
          />

          {/* Dropdown for Category */}
          <select
            name="category"
            value={formdata.category}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
          >
            <option value="Food">Foods</option>
            <option value="Drinks">Drinks</option>
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price ($)"
            value={formdata.price}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={formdata.imageUrl}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 font-semibold py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Add Food
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddFood;
