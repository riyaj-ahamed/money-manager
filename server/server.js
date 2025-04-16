const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const app = express();
app.use(cors());
app.use(express.json()); // For parsing JSON bodies

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transactions"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
