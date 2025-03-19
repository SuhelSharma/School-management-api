const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    max: 10,
    idleTimeoutMillis: 30000,
    ssl: { rejectUnauthorized: false }
});

// Test Database Connection
async function testDBConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ Connected to SQL Database!');
        client.release();
    } catch (error) {
        console.error('❌ Database Connection Failed:', error.message);
    }
}

testDBConnection();

module.exports = pool;
