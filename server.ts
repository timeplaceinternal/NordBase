import express from "express";
import { createServer as createViteServer } from "vite";
import { sql } from "@vercel/postgres";
import { put } from "@vercel/blob";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Initialize Database
  app.get("/api/init-db", async (req, res) => {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          name_en TEXT NOT NULL,
          name_pt TEXT NOT NULL,
          type TEXT NOT NULL, -- 'product' or 'service'
          parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS site_content (
          page_id TEXT PRIMARY KEY,
          content JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          name_en TEXT NOT NULL,
          name_pt TEXT NOT NULL,
          category TEXT NOT NULL,
          sub_category TEXT,
          rental_price DECIMAL NOT NULL,
          description_en TEXT,
          description_pt TEXT,
          short_description_en TEXT,
          short_description_pt TEXT,
          images TEXT[],
          in_stock BOOLEAN DEFAULT TRUE,
          status TEXT DEFAULT 'available',
          specifications JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      await sql`
        CREATE TABLE IF NOT EXISTS bookings (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          items JSONB NOT NULL,
          total_price DECIMAL NOT NULL,
          status TEXT DEFAULT 'pending',
          start_date TIMESTAMP,
          end_date TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      res.json({ message: "Database initialized successfully" });
    } catch (error) {
      console.error("DB Init Error:", error);
      res.status(500).json({ error: "Failed to initialize database" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const { rows } = await sql`SELECT * FROM products ORDER BY created_at DESC`;
      
      const products = rows.map(row => ({
        id: row.id.toString(),
        slug: row.slug,
        name: { en: row.name_en, pt: row.name_pt },
        category: row.category,
        subCategory: row.sub_category,
        rentalPrice: parseFloat(row.rental_price),
        description: { en: row.description_en, pt: row.description_pt },
        shortDescription: { en: row.short_description_en, pt: row.short_description_pt },
        images: row.images || [],
        inStock: row.in_stock,
        status: row.status,
        specifications: row.specifications || [],
        createdAt: new Date(row.created_at).getTime()
      }));

      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    const { slug } = req.params;
    try {
      const { rows } = await sql`SELECT * FROM products WHERE slug = ${slug} LIMIT 1`;
      if (rows.length === 0) return res.status(404).json({ error: "Product not found" });
      
      const row = rows[0];
      const product = {
        id: row.id.toString(),
        slug: row.slug,
        name: { en: row.name_en, pt: row.name_pt },
        category: row.category,
        subCategory: row.sub_category,
        rentalPrice: parseFloat(row.rental_price),
        description: { en: row.description_en, pt: row.description_pt },
        shortDescription: { en: row.short_description_en, pt: row.short_description_pt },
        images: row.images || [],
        inStock: row.in_stock,
        status: row.status,
        specifications: row.specifications || [],
        createdAt: new Date(row.created_at).getTime()
      };

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    const p = req.body;
    try {
      const result = await sql`
        INSERT INTO products (
          slug, name_en, name_pt, category, sub_category, rental_price, 
          description_en, description_pt, short_description_en, short_description_pt, 
          images, in_stock, status, specifications
        ) VALUES (
          ${p.slug}, ${p.name.en}, ${p.name.pt}, ${p.category}, ${p.subCategory || null}, ${p.rentalPrice},
          ${p.description.en}, ${p.description.pt}, ${p.shortDescription.en}, ${p.shortDescription.pt},
          ${p.images}, ${p.inStock}, ${p.status}, ${JSON.stringify(p.specifications)}
        ) RETURNING id;
      `;
      res.json({ id: result.rows[0].id });
    } catch (error) {
      console.error("Insert Error:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const p = req.body;
    try {
      await sql`
        UPDATE products SET
          name_en = ${p.name.en},
          name_pt = ${p.name.pt},
          category = ${p.category},
          sub_category = ${p.subCategory || null},
          rental_price = ${p.rentalPrice},
          description_en = ${p.description.en},
          description_pt = ${p.description.pt},
          short_description_en = ${p.shortDescription.en},
          short_description_pt = ${p.shortDescription.pt},
          images = ${p.images},
          in_stock = ${p.inStock},
          status = ${p.status},
          specifications = ${JSON.stringify(p.specifications)}
        WHERE id = ${id}
      `;
      res.json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await sql`DELETE FROM products WHERE id = ${id}`;
      res.json({ message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Categories API
  app.get("/api/categories", async (req, res) => {
    try {
      const { rows } = await sql`SELECT * FROM categories ORDER BY id ASC`;
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    const { slug, name_en, name_pt, type, parent_id } = req.body;
    try {
      const result = await sql`
        INSERT INTO categories (slug, name_en, name_pt, type, parent_id)
        VALUES (${slug}, ${name_en}, ${name_pt}, ${type}, ${parent_id || null})
        RETURNING *;
      `;
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await sql`DELETE FROM categories WHERE id = ${id}`;
      res.json({ message: "Category deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Site Content API
  app.get("/api/content/:pageId", async (req, res) => {
    const { pageId } = req.params;
    try {
      const { rows } = await sql`SELECT * FROM site_content WHERE page_id = ${pageId}`;
      if (rows.length === 0) return res.json({ page_id: pageId, content: {} });
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/content/:pageId", async (req, res) => {
    const { pageId } = req.params;
    const { content } = req.body;
    try {
      await sql`
        INSERT INTO site_content (page_id, content)
        VALUES (${pageId}, ${JSON.stringify(content)})
        ON CONFLICT (page_id) DO UPDATE SET
          content = ${JSON.stringify(content)},
          updated_at = CURRENT_TIMESTAMP;
      `;
      res.json({ message: "Content updated successfully" });
    } catch (error) {
      console.error("Content Save Error:", error);
      res.status(500).json({ error: "Failed to save content" });
    }
  });

  // Blob Upload API
  app.post("/api/upload", async (req, res) => {
    const { filename, contentType } = req.query;
    try {
      // In a real app, you'd use a multipart parser like busboy or multer
      // For this demo, we'll assume the body is the file buffer
      const blob = await put(filename as string, req, {
        access: 'public',
        contentType: contentType as string,
      });
      res.json(blob);
    } catch (error) {
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // --- VITE MIDDLEWARE ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
