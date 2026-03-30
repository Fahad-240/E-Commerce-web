import db from "./db.mjs";

async function findAdmin() {
    try {
        const result = await db.query("SELECT email, first_name, last_name, user_role FROM users WHERE user_role = 1");
        console.log("Admin Users Found:");
        console.table(result.rows);
    } catch (error) {
        console.error("Error finding admin:", error);
    } finally {
        process.exit();
    }
}

findAdmin();
