const { Pool } = require('pg');
require('dotenv').config();
const { parse } = require('pg-connection-string');

// Add: Parse DATABASE_URL if available (Vercel case)
let dbConfig = {};

if (process.env.DATABASE_URL_UNPOOLED) {
    const parsed = parse(process.env.DATABASE_URL_UNPOOLED);
    dbConfig = {
        host: parsed.host,
        user: parsed.user,
        password: parsed.password,
        database: parsed.database,
        port: parsed.port || 5432,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000
    };
} else {
    // Local config (your existing logic unchanged)
    dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000
    };
}

const pool = new Pool(dbConfig);

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
