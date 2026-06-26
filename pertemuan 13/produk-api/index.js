require('dotenv').config(); // ← HARUS PALING PERTAMA

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Import middleware
const authGuard = require('./middleware/authGuard');

// Import routes
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');

// Middleware global
app.use(express.json());

// Auth route → public
app.use('/api/auth', authRouter);

// Products → WAJIB login
app.use('/api/products', authGuard, productsRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: err.message || 'Server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
}); 