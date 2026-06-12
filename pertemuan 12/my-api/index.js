// index.js — Hello World Server
const express = require('express');
const app = express();

// Middleware bawaan Express: parse JSON otomatis
app.use(express.json());
app.use(require('cors')());

// Route pertama kita
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Jalankan server di port 3000
app.listen(3000, () => {
  console.log('Server berjalan di port 3000');
});

// 1. ROUTE BIASA — tidak ada parameter
app.get('/products', (req, res) => {
  res.json({ message: 'daftar semua produk' });
});

// 2. ROUTE PARAMS — :id dari URL
// URL: GET /products/42 → req.params.id = "42"
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID harus angka' });
  res.json({ id, pesan: 'data produk' });
});

// 3. QUERY STRING — GET /products?page=1&limit=5&search=apel
app.get('/products', (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  res.json({ page: Number(page), limit: Number(limit), search });
});

// 4. POST BODY — data dikirim di body request
// Butuh app.use(express.json()) agar req.body terisi!
app.post('/products', (req, res) => {
  const { nama, harga, stok } = req.body;
  if (!nama || !harga) return res.status(400).json({ error: 'nama & harga wajib' });
  res.status(201).json({ id: 1, nama, harga, stok });
});

