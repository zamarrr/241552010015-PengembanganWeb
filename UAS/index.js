require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global agar bisa membaca JSON body
app.use(express.json());

// Load Routes
const authRoutes = require('./routes/auth');
const artikelRoutes = require('./routes/artikel');

// Pemasangan Endpoint Utama
app.use('/api/auth', authRoutes);
app.use('/api/artikel', artikelRoutes);

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berhasil berjalan lancar di http://localhost:${PORT}`);
});