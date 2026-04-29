import express, { Router } from 'express';
import { Database } from 'sqlite';

const router = Router();

// Get all properties
router.get('/', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
    const properties = await db.all('SELECT * FROM properties ORDER BY created_at DESC');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
    const property = await db.get('SELECT * FROM properties WHERE id = ?', [req.params.id]);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create new property
router.post('/', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
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

// Update property
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
    const { name, address, type, bedrooms, bathrooms, rent_amount, status } = req.body;
    
    await db.run(
      `UPDATE properties 
       SET name = ?, address = ?, type = ?, bedrooms = ?, bathrooms = ?, 
           rent_amount = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, address, type, bedrooms, bathrooms, rent_amount, status, req.params.id]
    );
    
    const updatedProperty = await db.get('SELECT * FROM properties WHERE id = ?', [req.params.id]);
    
    if (!updatedProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.get('db') as Database;
    const result = await db.run('DELETE FROM properties WHERE id = ?', [req.params.id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

export default router;
