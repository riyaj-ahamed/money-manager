const Transaction = require('../models/Transaction');

// Add a new transaction
const addTransaction = async (req, res) => {
  try {
    const { amount, type, category, description } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTransaction = new Transaction({
      amount,
      type,
      category,
      description,
      user: req.user.id,
    });

    await newTransaction.save();
    res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
  } catch (err) {
    console.error("Add transaction error:", err);
    res.status(500).json({ error: "Failed to add transaction" });
  }
};

// Get all transactions for the logged-in user
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error("Get transactions error:", err);
    res.status(500).json({ error: "Failed to get transactions" });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized action" });
    }

    // ✅ Correct delete method
    await Transaction.findByIdAndDelete(id);

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Delete transaction error:", err);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  deleteTransaction,
};
