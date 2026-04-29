import express, { Router } from 'express';
import { Database } from 'sqlite';

const router = Router();

// Get all tenants
router.get('/', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
    const tenants = await db.all('SELECT * FROM tenants ORDER BY created_at DESC');
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// Get tenant by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
    const tenant = await db.get('SELECT * FROM tenants WHERE id = ?', [req.params.id]);
    
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
});

// Create new tenant
router.post('/', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
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

// Update tenant
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
    const { name, email, phone, id_number } = req.body;
    
    await db.run(
      `UPDATE tenants 
       SET name = ?, email = ?, phone = ?, id_number = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, email, phone, id_number, req.params.id]
    );
    
    const updatedTenant = await db.get('SELECT * FROM tenants WHERE id = ?', [req.params.id]);
    
    if (!updatedTenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    res.json(updatedTenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tenant' });
  }
});

// Delete tenant
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
    const result = await db.run('DELETE FROM tenants WHERE id = ?', [req.params.id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tenant' });
  }
});

export default router;
