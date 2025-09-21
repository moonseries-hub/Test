// src/context/CategoriesContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const API_URL = "http://localhost:5000/api/categories";

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, setCategories, fetchCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);
