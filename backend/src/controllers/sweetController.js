const Sweet = require('../models/Sweet');

// @desc    Add a new sweet
// @route   POST /api/sweets
// @access  Private (Admin only)
const addSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    if (!name || !category || !price || !quantity) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity
    });

    res.status(201).json(sweet);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Private
const getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find({});
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Purchase a sweet (decrease quantity)
// @route   POST /api/sweets/:id/purchase
// @access  Private
const purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    if (sweet.quantity <= 0) {
      return res.status(400).json({ message: 'Sweet is out of stock' });
    }

    sweet.quantity -= 1;
    await sweet.save();

    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- MISSING FUNCTION ADDED BELOW ---

// @desc    Restock a sweet (increase quantity)
// @route   POST /api/sweets/:id/restock
// @access  Private (Admin Only)
const restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Please provide a valid positive quantity' });
    }

    // Convert to number to ensure math works correctly
    sweet.quantity += Number(quantity);
    await sweet.save();

    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Export ALL functions
module.exports = { addSweet, getSweets, purchaseSweet, restockSweet };