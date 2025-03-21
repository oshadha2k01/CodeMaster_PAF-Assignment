import React from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from 'react';

function FoodList() {

    const[foods,setFoods]=useState([]);
    const navigate = useNavigate();


    const fetchFood = async () => {
        try {
          const response = await axios.get("http://localhost:3000/api/foods");
          setFoods(response.data.data);
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        fetchFood();
      }, []);

      const handleDelete = async (id) => {
        try {
          await axios.delete(`http://localhost:3000/api/foods/${id}`);
          fetchFood();
        } catch (error) {
          console.log(error);
          alert("Failed to delete item.");
        }
      };
   
  return (
    <>
    
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex gap-6">
        
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Manage All Menu Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-gray-200">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-3">#</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Item Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Update</th>
                  <th className="p-3">Delete</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((item, index) => (
                  <tr key={item._id} className="border-b border-gray-600 hover:bg-gray-700">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    </td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{`Rs. ${item.price.toFixed(2)}`}</td>
                    <td className="p-3">
                      <button
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                        onClick={() => navigate(`/updateFoodItem/${item._id}`)}
                      >
                        ✏️
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                        onClick={() => handleDelete(item._id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default FoodList