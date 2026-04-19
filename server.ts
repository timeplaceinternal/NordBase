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
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          name_en TEXT NOT NULL,
          name_pt TEXT NOT NULL,
          category TEXT NOT NULL,
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

  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const { rows } = await sql`SELECT * FROM products ORDER BY created_at DESC`;
      
      const products = rows.map(row => ({
        id: row.id.toString(),
        slug: row.slug,
        name: { en: row.name_en, pt: row.name_pt },
        category: row.category,
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
          slug, name_en, name_pt, category, rental_price, 
          description_en, description_pt, short_description_en, short_description_pt, 
          images, in_stock, status, specifications
        ) VALUES (
          ${p.slug}, ${p.name.en}, ${p.name.pt}, ${p.category}, ${p.rentalPrice},
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
