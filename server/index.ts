import express from 'express';
import cors from 'cors';
import { Database } from 'sqlite';
import { initializeDatabase } from './database/init.js';
import rentalRoutes from './routes/rentals.js';
import propertyRoutes from './routes/properties.js';
import tenantRoutes from './routes/tenants.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and start server
async function startServer() {
  try {
    const db = await initializeDatabase();
    console.log('Database initialized successfully');
    
    // Make database available to routes
    app.set('db', db);
    
    // Routes
    app.use('/api/rentals', rentalRoutes);
    app.use('/api/properties', propertyRoutes);
    app.use('/api/tenants', tenantRoutes);
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
