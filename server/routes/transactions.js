const express = require('express');
const router = express.Router();
const {
  addTransaction,
  getTransactions,
  deleteTransaction,
} = require('../controllers/transactionController');
const protect = require('../middleware/authMiddleware'); // <-- Import

// Apply `protect` middleware to all transaction routes
router.post('/', protect, addTransaction);
router.get('/', protect, getTransactions);
router.delete('/:id', protect, deleteTransaction);

module.exports = router;
