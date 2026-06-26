// routes/products.js
const express = require('express');
const prisma = require('../db');
const router = express.Router();
// GET /api/products — ambil semua produk
router.get('/', async (req, res, next) => {
try {
const data = await prisma.product.findMany({
orderBy: { createdAt: 'desc' }
});
res.json(data);
} catch (e) { next(e); }
});
// POST /api/products — tambah produk baru
router.post('/', async (req, res, next) => {
try {
const { nama, harga, stok } = req.body;
if (!nama || harga == null)
return res.status(400).json({ error: 'nama & harga wajib' });
const p = await prisma.product.create({
data: { nama, harga: +harga, stok: +(stok||0) }
});
res.status(201).json(p);
} catch (e) { next(e); }
});
// ... (lanjut di slide berikutnya)
module.exports = router;