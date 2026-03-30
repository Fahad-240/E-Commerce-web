import db from './db.mjs';

async function checkSchema() {
    try {
        console.log("Checking tables...");
        const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log("Tables:", tables.rows.map(r => r.table_name));

        if (tables.rows.some(r => r.table_name === 'cart')) {
            console.log("\nChecking 'cart' table details...");
            const columns = await db.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'cart'
      `);
            console.log("Columns:", columns.rows);

            console.log("\nChecking unique constraints on 'cart'...");
            const constraints = await db.query(`
        SELECT
            conname AS constraint_name,
            pg_get_constraintdef(c.oid) AS constraint_definition
        FROM
            pg_constraint c
        JOIN
            pg_namespace n ON n.oid = c.connamespace
        WHERE
            contype IN ('u', 'p') AND
            conrelid = 'cart'::regclass;
      `);
            console.log("Constraints:", constraints.rows);
        } else {
            console.log("\n'cart' table is MISSING!");
        }

        process.exit(0);
    } catch (err) {
        console.error("Schema check failed:", err);
        process.exit(1);
    }
}

checkSchema();
