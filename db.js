const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,  // Default PostgreSQL port
    max: 10,  // Equivalent to connectionLimit in MySQL
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    ssl: { rejectUnauthorized: false }  // Required for NeonDB
});

// Test Database Connection
async function testDBConnection() {
    try {
        const client = await pool.connect();
        console.log("✅ Connected to PostgreSQL Database!");
        client.release();
    } catch (error) {
        console.error("❌ Database Connection Failed:", error.message);
    }
}

testDBConnection();

module.exports = pool;
