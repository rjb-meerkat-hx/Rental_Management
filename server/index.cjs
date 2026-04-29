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

  return db;
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
