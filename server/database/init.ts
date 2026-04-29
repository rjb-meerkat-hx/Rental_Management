import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export async function initializeDatabase(): Promise<Database> {
  const db = await open({
    filename: './rentflow.db',
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

  // Create indexes for better performance
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
    CREATE INDEX IF NOT EXISTS idx_tenants_email ON tenants(email);
    CREATE INDEX IF NOT EXISTS idx_rentals_property_id ON rentals(property_id);
    CREATE INDEX IF NOT EXISTS idx_rentals_tenant_id ON rentals(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status);
    CREATE INDEX IF NOT EXISTS idx_payments_rental_id ON payments(rental_id);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    CREATE INDEX IF NOT EXISTS idx_maintenance_property_id ON maintenance_requests(property_id);
    CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status);
  `);

  return db;
}
