import React, { useEffect, useState } from "react";
import { getTransactions } from "../api";
import AddTransaction from "../components/AddTransaction";
import "../styles/Dashboard.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
  Legend as BarLegend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    try {
      const { data } = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/transactions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        fetchData();
      } else {
        console.error("Error deleting transaction:", result.error);
      }
    } catch (err) {
      console.error("Failed to delete transaction", err);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.createdAt);
    if (startDate && txDate < new Date(startDate)) return false;
    if (endDate && txDate > new Date(endDate)) return false;
    return true;
  });

  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const exportToCSV = () => {
    const headers = ["Description", "Amount", "Type", "Date"];
    const rows = filteredTransactions.map((tx) => [
      tx.description || tx.category || "Transaction",
      tx.amount,
      tx.type,
      new Date(tx.createdAt).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions.csv");
    link.click();
  };

  // Prepare chart data
  const monthlyData = filteredTransactions.reduce((acc, tx) => {
    const month = new Date(tx.createdAt).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
    if (tx.type === "income") acc[month].income += tx.amount;
    if (tx.type === "expense") acc[month].expense += tx.amount;
    return acc;
  }, {});

  const chartData = Object.values(monthlyData);

  return (
    <div className="dashboard">
      <h2>Welcome to Your Dashboard</h2>

      <div className="summary">
        <div className="box income">Income: ₹{income}</div>
        <div className="box expense">Expenses: ₹{expense}</div>
        <div className="box balance">Balance: ₹{income - expense}</div>
      </div>

      <div className="date-picker">
        <label>From: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>To: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="export-btn" onClick={exportToCSV}>
          Export CSV
        </button>
      </div>

      {(income > 0 || expense > 0) && (
        <div className="chart-container">
          <PieChart width={300} height={300}>
            <Pie
              data={[
                { name: "Income", value: income },
                { name: "Expenses", value: expense },
              ]}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              <Cell fill="#82ca9d" />
              <Cell fill="#ff6666" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="income" fill="#82ca9d" />
              <Bar dataKey="expense" fill="#ff6666" />
              <BarTooltip />
              <BarLegend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <AddTransaction onAdd={fetchData} />

      <h3>Your Transactions</h3>
      <ul className="transaction-list">
        {filteredTransactions.map((tx) => (
          <li key={tx._id} className={tx.type}>
            <span>
              {tx.description || tx.category || "Transaction"} - ₹{tx.amount}
              <br />
              <small>{new Date(tx.createdAt).toLocaleString()}</small>
            </span>
            <button className="delete-btn" onClick={() => handleDelete(tx._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
