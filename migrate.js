import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: 5432,
    database: process.env.PGDATABASE,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    try {
        console.log("Starting migration...");

        // Add is_sale column if it doesn't exist
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_sale') THEN
                    ALTER TABLE products ADD COLUMN is_sale BOOLEAN DEFAULT FALSE;
                END IF;
            END $$;
        `);
        console.log("is_sale column ensured.");

        // Add sale_percentage column if it doesn't exist
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='sale_percentage') THEN
                    ALTER TABLE products ADD COLUMN sale_percentage INT;
                END IF;
            END $$;
        `);
        console.log("sale_percentage column ensured.");

        // Add original_price column if it doesn't exist
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='original_price') THEN
                    ALTER TABLE products ADD COLUMN original_price DECIMAL(10,2);
                END IF;
            END $$;
        `);
        console.log("original_price column ensured.");

        console.log("Migration completed successfully!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await pool.end();
    }
}

migrate();
