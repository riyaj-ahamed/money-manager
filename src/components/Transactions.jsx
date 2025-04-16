import React, { useEffect, useState } from "react";
import { getTransactions, addTransaction, deleteTransaction } from "../api";
import "./Transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
  });

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addTransaction(formData);
      fetchTransactions(); // refresh
      setFormData({
        amount: "",
        type: "expense",
        category: "",
        description: "",
      });
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="transactions">
      <h2>Transactions</h2>
      <form onSubmit={handleAdd}>
        <input
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          type="number"
          placeholder="Amount"
          required
        />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {transactions.map((txn) => (
          <li key={txn._id}>
            ₹{txn.amount} — {txn.type} ({txn.category})
            <button onClick={() => handleDelete(txn._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
