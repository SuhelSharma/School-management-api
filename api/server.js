require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const schoolRoutes = require("./routes/schoolRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Register API Routes
app.use("/api", schoolRoutes);

// Default Route
app.get("/", (req, res) => {
    res.send("Welcome to the School Management API");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
