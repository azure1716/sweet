const express = require('express');
const router = express.Router();

// 1. Import ALL controllers in one line (including restockSweet)
const { 
  addSweet, 
  getSweets, 
  purchaseSweet, 
  restockSweet 
} = require('../controllers/sweetController');

const { protect, admin } = require('../middleware/authMiddleware');

// --- Routes ---

// GET /api/sweets - List all sweets (Authenticated Users)
router.get('/', protect, getSweets);

// POST /api/sweets - Add new sweet (Admin Only)
router.post('/', protect, admin, addSweet);

// POST /api/sweets/:id/purchase - Buy a sweet (Any User)
router.post('/:id/purchase', protect, purchaseSweet);

// POST /api/sweets/:id/restock - Add inventory (Admin Only)
router.post('/:id/restock', protect, admin, restockSweet);

module.exports = router;