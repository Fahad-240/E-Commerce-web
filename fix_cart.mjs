import db from './db.mjs';

async function fixSchema() {
    try {
        console.log("Adding unique constraint to cart...");
        await db.query(`
      ALTER TABLE cart 
      ADD CONSTRAINT unique_user_product 
      UNIQUE (user_id, product_id);
    `);
        console.log("Constraint added successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Failed to add constraint:", err);
        process.exit(1);
    }
}

fixSchema();
