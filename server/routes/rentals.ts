import express, { Router } from 'express';
import { Database } from 'sqlite';

const router = Router();

// Get all rentals with property and tenant details
router.get('/', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
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

// Get rental by ID with details
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
    const rental = await db.get(`
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
    `, [req.params.id]);
    
    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }
    
    res.json(rental);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rental' });
  }
});

// Create new rental
router.post('/', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
    const { property_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status } = req.body;
    
    // Start transaction
    await db.run('BEGIN TRANSACTION');
    
    try {
      // Create rental
      const result = await db.run(
        `INSERT INTO rentals (property_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [property_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status || 'active']
      );
      
      // Update property status to rented
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

// Update rental
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
    const { property_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status } = req.body;
    
    await db.run(
      `UPDATE rentals 
       SET property_id = ?, tenant_id = ?, start_date = ?, end_date = ?, 
           monthly_rent = ?, security_deposit = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [property_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status, req.params.id]
    );
    
    const updatedRental = await db.get(`
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
    `, [req.params.id]);
    
    if (!updatedRental) {
      return res.status(404).json({ error: 'Rental not found' });
    }
    
    res.json(updatedRental);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rental' });
  }
});

// Delete rental
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
    
    // Get rental details before deletion
    const rental = await db.get('SELECT property_id FROM rentals WHERE id = ?', [req.params.id]);
    
    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }
    
    // Start transaction
    await db.run('BEGIN TRANSACTION');
    
    try {
      // Delete rental
      const result = await db.run('DELETE FROM rentals WHERE id = ?', [req.params.id]);
      
      // Update property status back to available
      await db.run(
        'UPDATE properties SET status = ? WHERE id = ?',
        ['available', rental.property_id]
      );
      
      await db.run('COMMIT');
      
      res.json({ message: 'Rental deleted successfully' });
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete rental' });
  }
});

// Get rental payments
router.get('/:id/payments', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
    const payments = await db.all(
      'SELECT * FROM payments WHERE rental_id = ? ORDER BY due_date DESC',
      [req.params.id]
    );
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

export default router;
