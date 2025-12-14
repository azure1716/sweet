const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Sweet = require('./models/Sweet');

// CRITICAL FIX: Explicitly point to the .env file in the root folder
// This ensures it finds your MONGO_URI even if you run the script from different folders
dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleSweets = [
  {
    name: "Chocolate Fudge",
    category: "Chocolate",
    price: 5.99,
    quantity: 20
  },
  {
    name: "Sour Gummy Bears",
    category: "Gummies",
    price: 3.50,
    quantity: 50
  },
  {
    name: "Vanilla Cupcake",
    category: "Baked Goods",
    price: 4.00,
    quantity: 10
  },
  {
    name: "Rainbow Lollipops",
    category: "Hard Candy",
    price: 1.50,
    quantity: 100
  },
  {
    name: "Dark Chocolate Truffle",
    category: "Chocolate",
    price: 12.00,
    quantity: 0 // Intentionally out of stock to test the button
  }
];

const seedDB = async () => {
  try {
    // 1. Check if URI is loaded
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is undefined. Check your .env file!");
    }

    // 2. Connect to Database
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // 3. Clear existing sweets
    await Sweet.deleteMany({});
    console.log("🗑️  Old inventory cleared");

    // 4. Add new sweets
    await Sweet.insertMany(sampleSweets);
    console.log("🍬 New sweets added successfully!");

    // 5. Exit
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();