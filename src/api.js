import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// =====================
// Auth APIs
// =====================

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/api/login`, credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return await response.json();
};

// =====================
// Transaction APIs
// =====================

export const getTransactions = async () => {
  const token = localStorage.getItem("token");
  return await axios.get(`${API_URL}/api/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addTransaction = async (transaction) => {
  const token = localStorage.getItem("token");
  return await axios.post(`${API_URL}/api/transactions`, transaction, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteTransaction = async (id) => {
  const token = localStorage.getItem("token");
  return await axios.delete(`${API_URL}/api/transactions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
