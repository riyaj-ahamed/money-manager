const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const app = express(); // ✅ Initialize Express app

// Middleware
app.use(
  cors({
    origin: "https://money-manager-client-r4hj.onrender.com", // ✅ Allow frontend domain
    credentials: true,
  })
);
app.use(express.json()); // ✅ To parse JSON bodies

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transactions"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
