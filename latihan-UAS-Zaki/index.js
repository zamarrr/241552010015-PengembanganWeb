const express = require('express');
const app = express();
const authGuard = require('./middleware/authGuard');

// Membaca input body JSON dari request klien
app.use(express.json());

// 1. Jalur Bebas Hambatan (Tanpa AuthGuard): Register & Login
app.use('/api/auth', require('./routes/auth'));

// 2. Jalur Terproteksi (Wajib Melewati AuthGuard Terlebih Dahulu)
app.use('/api/transaksi', authGuard, require('./routes/transaksi'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berhasil berjalan lancar di http://localhost:${PORT}`);
});