const app = require('./app');
const connectDB = require('./utils/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Only connect to real DB if we are running the server (not testing)
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});