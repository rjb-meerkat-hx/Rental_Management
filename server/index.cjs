const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
async function initializeDatabase() {
  const db = await open({
    filename: path.join(__dirname, '..', 'rentflow.db'),
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON');

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      type TEXT NOT NULL,
      bedrooms INTEGER,
      bathrooms INTEGER,
      rent_amount REAL NOT NULL,
      status TEXT DEFAULT 'available',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tenants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      id_number TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS rentals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      tenant_id INTEGER NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE,
      monthly_rent REAL NOT NULL,
      security_deposit REAL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rental_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_date DATE NOT NULL,
      due_date DATE NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS maintenance_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      rental_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
      FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE SET NULL
    );
  `);

  // Products table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      image TEXT,
      price_per_day REAL,
      price_per_hour REAL,
      stock INTEGER DEFAULT 0,
      available INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}

// Seed database with India-specific dummy data if empty
async function seedDatabase(db) {
  const propCount = await db.get('SELECT COUNT(1) as cnt FROM properties');
  const tenantCount = await db.get('SELECT COUNT(1) as cnt FROM tenants');

  if (propCount.cnt === 0) {
    await db.run(`INSERT INTO properties (name, address, type, bedrooms, bathrooms, rent_amount, status) VALUES
      ('2BHK Apartment - Andheri East', 'Andheri East, Mumbai, Maharashtra, India', 'Apartment', 2, 2, 35000, 'available'),
      ('Commercial Office Space - BKC', 'Bandra Kurla Complex, Mumbai, Maharashtra, India', 'Commercial', 0, 2, 150000, 'available'),
      ('Studio - Koramangala', 'Koramangala, Bengaluru, Karnataka, India', 'Studio', 0,1, 18000, 'available')
    `);
    console.log('Seeded properties');
  }

  if (tenantCount.cnt === 0) {
    await db.run(`INSERT INTO tenants (name, email, phone, id_number) VALUES
      ('Rohit Sharma', 'rohit.sharma@example.in', '+91-9876543210', 'A1234567'),
      ('Priya Patel', 'priya.patel@example.in', '+91-9123456780', 'B9876543')
    `);
    console.log('Seeded tenants');
  }

  // Seed products table from constants if empty
  const prodCount = await db.get('SELECT COUNT(1) as cnt FROM products');
  if (prodCount.cnt === 0) {
    await db.run(`INSERT INTO products (id, name, description, category, image, price_per_day, price_per_hour, stock, available) VALUES
      ('p1', 'Industrial Generator X500', 'High-power diesel generator for large construction sites.', 'Machinery', '', 20000, 3600, 5, 3),
      ('p2', 'Executive Office Set', 'Premium desk and chair set.', 'Furniture', '', 6400, 1200, 12, 8),
      ('p3', 'Event Sound System Pro', 'Complete PA system.', 'Electronics', '', 28000, 4800, 4, 2)
    `);
    console.log('Seeded products');
  }

  // Create a sample rental if none exists
  const rentalCount = await db.get('SELECT COUNT(1) as cnt FROM rentals');
  if (rentalCount.cnt === 0) {
    const property = await db.get('SELECT id FROM properties LIMIT 1');
    const tenant = await db.get('SELECT id FROM tenants LIMIT 1');
    if (property && tenant) {
      await db.run(`INSERT INTO rentals (property_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status) VALUES
        (?, ?, date('now'), date('now', '+30 days'), ?, ?, 'active')`,
        [property.id, tenant.id, 35000, 35000]
      );
      console.log('Seeded rentals');
    }
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Properties routes
app.get('/api/properties', async (req, res) => {
  try {
    const db = req.app.get('db');
    const properties = await db.all('SELECT * FROM properties ORDER BY created_at DESC');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const db = req.app.get('db');
    const products = await db.all('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { id, name, description, category, image, price_per_day, price_per_hour, stock, available } = req.body;
    const pid = id || `p${Date.now()}`;
    await db.run(`INSERT INTO products (id, name, description, category, image, price_per_day, price_per_hour, stock, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [pid, name, description, category, image, price_per_day, price_per_hour, stock || 0, available || 0]
    );
    const product = await db.get('SELECT * FROM products WHERE id = ?', [pid]);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { name, description, category, image, price_per_day, price_per_hour, stock, available } = req.body;
    await db.run(`UPDATE products SET name = ?, description = ?, category = ?, image = ?, price_per_day = ?, price_per_hour = ?, stock = ?, available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, description, category, image, price_per_day, price_per_hour, stock, available, req.params.id]
    );
    const product = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const result = await db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { name, address, type, bedrooms, bathrooms, rent_amount, status } = req.body;
    
    const result = await db.run(
      `INSERT INTO properties (name, address, type, bedrooms, bathrooms, rent_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, address, type, bedrooms, bathrooms, rent_amount, status || 'available']
    );
    
    const newProperty = await db.get('SELECT * FROM properties WHERE id = ?', [result.lastID]);
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Tenants routes
app.get('/api/tenants', async (req, res) => {
  try {
    const db = req.app.get('db');
    const tenants = await db.all('SELECT * FROM tenants ORDER BY created_at DESC');
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

app.get('/api/tenants/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const tenant = await db.get('SELECT * FROM tenants WHERE id = ?', [req.params.id]);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
});

app.post('/api/tenants', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { name, email, phone, id_number } = req.body;
    
    const result = await db.run(
      `INSERT INTO tenants (name, email, phone, id_number)
       VALUES (?, ?, ?, ?)`,
      [name, email, phone, id_number]
    );
    
    const newTenant = await db.get('SELECT * FROM tenants WHERE id = ?', [result.lastID]);
    res.status(201).json(newTenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tenant' });
  }
});

// Rentals routes
app.get('/api/rentals', async (req, res) => {
  try {
    const db = req.app.get('db');
    const rentals = await db.all(`
      SELECT 
        r.*,
        p.name as property_name,
        p.address as property_address,
        t.name as tenant_name,
        t.email as tenant_email
      FROM rentals r
      JOIN properties p ON r.property_id = p.id
      JOIN tenants t ON r.tenant_id = t.id
      ORDER BY r.created_at DESC
    `);
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rentals' });
  }
});

app.post('/api/rentals', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { property_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status } = req.body;
    
    await db.run('BEGIN TRANSACTION');
    
    try {
      const result = await db.run(
        `INSERT INTO rentals (property_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [property_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status || 'active']
      );
      
      await db.run(
        'UPDATE properties SET status = ? WHERE id = ?',
        ['rented', property_id]
      );
      
      await db.run('COMMIT');
      
      const newRental = await db.get(`
        SELECT 
          r.*,
          p.name as property_name,
          p.address as property_address,
          t.name as tenant_name,
          t.email as tenant_email
        FROM rentals r
        JOIN properties p ON r.property_id = p.id
        JOIN tenants t ON r.tenant_id = t.id
        WHERE r.id = ?
      `, [result.lastID]);
      
      res.status(201).json(newRental);
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create rental' });
  }
});

// Start server
async function startServer() {
  try {
    const db = await initializeDatabase();
    console.log('Database initialized successfully');
    
    await seedDatabase(db);

    app.set('db', db);
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
