require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const schoolRoutes = require("./routes/schoolRoutes"); // Ensure this path is correct

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
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
