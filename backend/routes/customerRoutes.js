import express from 'express';
import { createCustomer, getCustomer, updateCustomer,getCurrentCustomer } from '../controllers/customerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createCustomer);
router.get('/:id', authenticateToken, getCustomer);
router.put('/:id', authenticateToken, updateCustomer);
// router.get('/me', authenticateToken, getCurrentCustomer);
router.get('/me', authenticateToken, (req, res) => {
    console.log('GET /me route hit');
    res.send('Route is working!');
  });
  
export default router;