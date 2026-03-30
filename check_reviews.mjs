import db from './db.mjs';

const result = await db.query("SELECT table_name FROM information_schema.tables WHERE table_name = 'reviews'");
if (result.rows.length > 0) {
    console.log("✅ reviews table EXISTS");
    // Check columns
    const cols = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'reviews'");
    console.log("Columns:", cols.rows.map(c => c.column_name).join(", "));
} else {
    console.log("❌ reviews table does NOT exist — creating it now...");
    await db.query(`
        CREATE TABLE reviews (
            review_id SERIAL PRIMARY KEY,
            product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
            user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
            rating INT CHECK (rating >= 1 AND rating <= 5),
            comment TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);
    console.log("✅ reviews table created successfully!");
}
process.exit();
