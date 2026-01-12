const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'alumni_supnum'
};

async function migrate() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL server');

        // Check if column exists
        const [columns] = await connection.query("SHOW COLUMNS FROM evenement LIKE 'image'");

        if (columns.length === 0) {
            console.log('Adding image column...');
            await connection.query("ALTER TABLE evenement ADD COLUMN image VARCHAR(255) AFTER description");
            console.log('✅ Column image added successfully');
        } else {
            console.log('ℹ️ Column image already exists');
        }

        await connection.end();
    } catch (error) {
        console.error('❌ Migration failed:', error);
    }
}

migrate();
