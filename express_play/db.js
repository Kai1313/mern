const { Pool } = require('pg');

// PostgreSQL database connection configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost:8888',
    database: 'playground',
    password: 'secret',
    port: 5432, // PostgreSQL default port
});

module.exports = pool;