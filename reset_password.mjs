import db from "./db.mjs";
import bcrypt from "bcryptjs";

async function resetPassword() {
    const email = "fahadahmed@gmail.com";
    const newPassword = "admin123";

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await db.query(
            "UPDATE users SET password = $1 WHERE email = $2",
            [hashedPassword, email]
        );

        if (result.rowCount > 0) {
            console.log(`Password for ${email} has been reset to: ${newPassword}`);
        } else {
            console.log(`User ${email} not found.`);
        }
    } catch (error) {
        console.error("Error resetting password:", error);
    } finally {
        process.exit();
    }
}

resetPassword();
