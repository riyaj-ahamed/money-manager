import React from "react";
import { deleteTransaction } from "../api";
import "../styles/TransactionForm.css";

const TransactionList = ({ transactions }) => {
  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      window.location.reload(); // Refresh the page to reflect changes
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <div key={transaction._id} className="transaction-item">
          <div className="transaction-info">
            <span className={`transaction-type ${transaction.type}`}>
              {transaction.type}
            </span>
            <span>{transaction.category}</span>
            <span>${transaction.amount}</span>
          </div>
          <button
            onClick={() => handleDelete(transaction._id)}
            className="delete-btn"
          >
            Delete
          </button>
          <ul className="transaction-list">
            {transactions.map((tx) => (
              <li key={tx._id} className={tx.type}>
                <span>
                  {tx.description || tx.category || "Transaction"} - ₹
                  {tx.amount}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(tx._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
