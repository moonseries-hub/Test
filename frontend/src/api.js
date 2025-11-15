// src/api.js
import axios from "axios";

// Get token from localStorage
const token = localStorage.getItem("token");

// Create Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export default API;
