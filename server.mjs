/* ============================================
   SERVER - Polished Backend with Auth
   ============================================ */
import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./db.mjs";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 5004;
const SECRET_KEY = process.env.SECRET_KEY || "your_jwt_secret_key";

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
}));

app.get("/", (req, res) => {
    res.send("Backend working 🚀");
});

// Authentication Routes
app.post("/api/v1/sign-up", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).send({ message: "Required parameter is missing" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (first_name, last_name, email, password, user_role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id, email, first_name, last_name
        `;
        const values = [firstName, lastName, email, hashedPassword, 2]; // 2 for customer, 1 for admin
        await db.query(query, values);
        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        if (error.code === '23505') { // Unique violation
            return res.status(400).send({ message: "Email already exists" });
        }
        res.status(500).send({ message: "Internal server error" });
    }
});

app.post("/api/v1/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "Required parameter is missing" });
    }

    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(401).send({ message: "Invalid email or password" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, user_role: user.user_role },
            SECRET_KEY,
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true, 
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.cookie("user_id", user.user_id, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).send({
            message: "Login successful",
            user: {
                user_id: user.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                user_role: user.user_role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

app.get("/api/v1/profile", async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const result = await db.query("SELECT user_id, email, first_name, last_name, user_role FROM users WHERE user_id = $1", [decoded.user_id]);
        if (result.rows.length === 0) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ message: "success", user: result.rows[0] });
    } catch (error) {
        console.error("Profile error:", error);
        res.status(401).send({ message: "Unauthorized" });
    }
});

app.post("/api/v1/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.clearCookie("user_id", {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.status(200).send({ message: "Logout successful" });
});

// Category APIs
app.get("/api/v1/categories", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM categories ORDER BY category_name"
        );

        res.status(200).send({
            message: "success",
            data: result.rows,
        });

    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).send({
            message: "Internal server error",
        });
    }
});

app.post("/api/v1/category", async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).send({ message: "Required parameter is missing" });
        }
        await db.query("INSERT INTO categories (category_name, description) VALUES ($1, $2)", [name, description]);
        res.status(200).send({ message: "Category created successfully" });
    } catch (error) {
        console.log("error", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

app.delete("/api/v1/category/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const productsCount = await db.query("SELECT COUNT(*) FROM products WHERE category_id = $1", [id]);
        if (parseInt(productsCount.rows[0].count) > 0) {
            return res.status(400).send({ message: "Category is not empty. Delete products first." });
        }
        await db.query("DELETE FROM categories WHERE category_id = $1", [id]);
        res.status(200).send({ message: "Category deleted" });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});

app.put("/api/v1/category/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).send({ message: "Required parameter is missing" });
        }
        await db.query(
            "UPDATE categories SET category_name = $1, description = $2 WHERE category_id = $3",
            [name, description, id]
        );
        res.status(200).send({ message: "Category updated successfully" });
    } catch (error) {
        console.error("error", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

// Product APIs
app.get("/api/v1/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let result = await db.query(`
            SELECT 
                p.product_id, 
                p.product_name, 
                c.category_name, 
                p.price, 
                p.product_image, 
                p.description, 
                p.created_at, 
                p.is_sale, 
                p.sale_percentage,
                p.original_price,
                COALESCE(ROUND(AVG(r.rating), 1), 0) AS avg_rating
            FROM products AS p 
            INNER JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN reviews r ON p.product_id = r.product_id
            WHERE p.product_id = $1
            GROUP BY p.product_id, c.category_name
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).send({ message: "Product not found" });
        }
        res.status(200).send({ message: "success", product: result.rows[0] });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});

app.get("/api/v1/products", async (req, res) => {
    try {
        let result = await db.query(`
      SELECT 
          p.product_id, 
          p.product_name, 
          c.category_name, 
          p.price, 
          p.product_image, 
          p.description, 
          p.created_at,
          p.is_sale,
          p.sale_percentage,
          p.original_price,
          COALESCE(ROUND(AVG(r.rating), 1), 0) AS avg_rating
      FROM products AS p
      INNER JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN reviews r ON p.product_id = r.product_id
      GROUP BY p.product_id, c.category_name
      ORDER BY p.created_at DESC
    `);

        res.status(200).send({
            message: "success",
            products: result.rows,
        });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});

app.post("/api/v1/product", async (req, res) => {
    const { name, description, price, category_id, image, is_sale, sale_percentage, original_price } = req.body;
    if (!name || !description || !price || !category_id || !image) {
        return res.status(400).json({ message: "Required parameter is missing" });
    }
    try {
        const query = `
      INSERT INTO products (product_name, description, price, category_id, product_image, is_sale, sale_percentage, original_price)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
        const values = [
            name, 
            description, 
            Number(price), 
            Number(category_id), 
            image, 
            is_sale || false, 
            sale_percentage ? Number(sale_percentage) : null, 
            original_price ? Number(original_price) : null
        ];
        await db.query(query, values);
        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        console.error("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete("/api/v1/product/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM products WHERE product_id = $1", [id]);
        res.status(200).send({ message: "Product deleted" });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});

// Review APIs
app.get("/api/v1/reviews/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const result = await db.query(`
            SELECT r.review_id, r.rating, r.comment, r.created_at,
                   u.first_name, u.last_name
            FROM reviews r
            INNER JOIN users u ON r.user_id = u.user_id
            WHERE r.product_id = $1
            ORDER BY r.created_at DESC
        `, [productId]);
        res.status(200).send({ message: "success", reviews: result.rows });
    } catch (error) {
        console.error("Review fetch error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

app.post("/api/v1/review", async (req, res) => {
    const user_id = req.cookies.user_id;
    if (!user_id) {
        return res.status(401).send({ message: "Please login to submit a review" });
    }
    const { product_id, rating, comment } = req.body;
    if (!product_id || !rating || !comment) {
        return res.status(400).send({ message: "Required parameter is missing" });
    }
    try {
        await db.query(
            "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4)",
            [product_id, user_id, rating, comment]
        );
        res.status(201).send({ message: "Review submitted successfully" });
    } catch (error) {
        console.error("Review submit error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

// Cart APIs
app.post("/api/v1/cart", async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.cookies.user_id || 1;
    try {
        await db.query(
            "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + $3",
            [user_id, product_id, quantity]
        );
        res.status(200).send({ message: "Added to cart" });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});

app.put("/api/v1/cart/:cartId", async (req, res) => {
    const { cartId } = req.params;
    const { quantity } = req.body;
    const user_id = req.cookies.user_id || 1;
    try {
        await db.query(
            "UPDATE cart SET quantity = $1 WHERE cart_id = $2 AND user_id = $3",
            [quantity, cartId, user_id]
        );
        res.status(200).send({ message: "Cart updated" });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});

app.delete("/api/v1/cart/:cartId", async (req, res) => {
    const { cartId } = req.params;
    const user_id = req.cookies.user_id || 1;
    try {
        await db.query(
            "DELETE FROM cart WHERE cart_id = $1 AND user_id = $2",
            [cartId, user_id]
        );
        res.status(200).send({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});

app.get("/api/v1/cart", async (req, res) => {
    const user_id = req.cookies.user_id || 1;
    try {
        const result = await db.query(`
      SELECT c.cart_id, c.quantity, p.product_name, p.price, p.product_image, p.product_id
      FROM cart c
      INNER JOIN products p ON c.product_id = p.product_id
      WHERE c.user_id = $1
    `, [user_id]);
        res.status(200).send({ message: "success", cart: result.rows });
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});