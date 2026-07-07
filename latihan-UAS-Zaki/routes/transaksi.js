const express = require('express');
const router = express.Router();
const prisma = require('../db'); // Mengambil koneksi database Prisma

// ==========================================
// f) RINGKASAN KEUANGAN — GET /api/transaksi/ringkasan
// ==========================================
// PENTING: Wajib ditaruh PING PALING ATAS agar Express tidak salah mengira 
// kata "ringkasan" sebagai parameter ID transaksi (/:id)
router.get('/ringkasan', async (req, res) => {
  const { userId, role } = req.user;

  // Jika admin, filter dikosongkan {} (ambil semua). Jika user biasa, kunci berdasarkan userId mereka.
  const queryFilter = role === 'admin' ? {} : { userId: userId };

  try {
    const transaksi = await prisma.transaksi.findMany({ where: queryFilter });

    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    // Kalkulasi total
    transaksi.forEach(item => {
      if (item.jenis === 'pemasukan') totalPemasukan += item.jumlah;
      if (item.jenis === 'pengeluaran') totalPengeluaran += item.jumlah;
    });

    return res.status(200).json({
      totalPemasukan,
      totalPengeluaran,
      saldo: totalPemasukan - totalPengeluaran
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ==========================================
// a) TAMBAH TRANSAKSI — POST /api/transaksi
// ==========================================
router.post('/', async (req, res) => {
  const { judul, jumlah, jenis, kategori, tanggal } = req.body;
  const { userId } = req.user; // Diambil dari token hasil dekripsi authGuard

  // 1. Validasi field wajib
  if (!judul || jumlah === undefined || !jenis || !kategori) {
    return res.status(400).json({ message: 'Field wajib kosong, jenis tidak valid, atau jumlah bukan angka positif' });
  }

  // 2. Validasi nilai jenis (hanya boleh pemasukan atau pengeluaran)
  if (jenis !== 'pemasukan' && jenis !== 'pengeluaran') {
    return res.status(400).json({ message: 'Field wajib kosong, jenis tidak valid, atau jumlah bukan angka positif' });
  }

  // 3. Validasi jumlah harus berupa angka dan harus positif (> 0)
  if (typeof jumlah !== 'number' || jumlah <= 0) {
    return res.status(400).json({ message: 'Field wajib kosong, jenis tidak valid, atau jumlah bukan angka positif' });
  }

  try {
    const transaksiBaru = await prisma.transaksi.create({
      data: {
        judul,
        jumlah,
        jenis,
        kategori,
        // Jika tanggal tidak dikirim klien, gunakan waktu sekarang secara otomatis
        tanggal: tanggal ? new Date(tanggal) : new Date(),
        userId: userId
      }
    });

    return res.status(201).json({
      message: 'Transaksi berhasil ditambahkan',
      transaksi: transaksiBaru
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ==========================================
// b) LIHAT SEMUA TRANSAKSI — GET /api/transaksi
// ==========================================
router.get('/', async (req, res) => {
  const { userId, role } = req.user;
  const queryFilter = role === 'admin' ? {} : { userId: userId };

  try {
    const daftarTransaksi = await prisma.transaksi.findMany({
      where: queryFilter,
      orderBy: {
        tanggal: 'desc' // Diurutkan dari tanggal terbaru ke terlama sesuai soal
      },
      include: {
        user: {
          select: { id: true, nama: true, email: true } // Menyertakan relasi data user (JOIN)
        }
      }
    });

    return res.status(200).json(daftarTransaksi);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ==========================================
// c) LIHAT DETAIL TRANSAKSI — GET /api/transaksi/:id
// ==========================================
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { userId, role } = req.user;

  try {
    const transaksi = await prisma.transaksi.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, nama: true, email: true } }
      }
    });

    // Validasi 404 jika data tidak ditemukan di database
    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    // Validasi 403 (Proteksi Keamanan): Jika transaksi bukan milik dia DAN dia bukan admin, TOLAK!
    if (transaksi.userId !== userId && role !== 'admin') {
      return res.status(403).json({ message: 'Transaksi bukan milik user dan bukan admin' });
    }

    return res.status(200).json(transaksi);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ==========================================
// d) UPDATE TRANSAKSI — PUT /api/transaksi/:id
// ==========================================
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { userId, role } = req.user;
  const { judul, jumlah, jenis, kategori, tanggal } = req.body;

  try {
    const transaksi = await prisma.transaksi.findUnique({ where: { id } });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    if (transaksi.userId !== userId && role !== 'admin') {
      return res.status(403).json({ message: 'Transaksi bukan milik user dan bukan admin' });
    }

    // Validasi parsial jika field 'jenis' dikirimkan oleh klien
    if (jenis && jenis !== 'pemasukan' && jenis !== 'pengeluaran') {
      return res.status(400).json({ message: 'jenis tidak valid atau jumlah bukan angka positif' });
    }

    // Validasi parsial jika field 'jumlah' dikirimkan oleh klien
    if (jumlah !== undefined && (typeof jumlah !== 'number' || jumlah <= 0)) {
      return res.status(400).json({ message: 'jenis tidak valid atau jumlah bukan angka positif' });
    }

    // Eksekusi pembaruan data (menggunakan operator Nullish Coalescing `??` untuk partial update)
    const transaksiDiupdate = await prisma.transaksi.update({
      where: { id },
      data: {
        judul: judul ?? transaksi.judul,
        jumlah: jumlah ?? transaksi.jumlah,
        jenis: jenis ?? transaksi.jenis,
        kategori: kategori ?? transaksi.kategori,
        tanggal: tanggal ? new Date(tanggal) : transaksi.tanggal
      }
    });

    return res.status(200).json({
      message: 'Transaksi berhasil diupdate',
      transaksi: transaksiDiupdate
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ==========================================
// e) HAPUS TRANSAKSI — DELETE /api/transaksi/:id
// ==========================================
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { userId, role } = req.user;

  try {
    const transaksi = await prisma.transaksi.findUnique({ where: { id } });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    if (transaksi.userId !== userId && role !== 'admin') {
      return res.status(403).json({ message: 'Transaksi bukan milik user dan bukan admin' });
    }

    await prisma.transaksi.delete({ where: { id } });

    return res.status(200).json({ message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;