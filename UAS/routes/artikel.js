const express = require('express');
const router = express.Router();
const prisma = require('../db');
const authGuard = require('../middleware/authGuard');

// c) Lihat artikel publik [Tanpa Login] - Ditaruh paling atas agar tidak bentrok dengan /:id
router.get('/publik', async (req, res) => {
  try {
    const artikelPublik = await prisma.artikel.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, nama: true } }
      }
    });
    res.status(200).json(artikelPublik);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// f) Ringkasan artikel [Perlu Login] - Ditaruh sebelum /:id
router.get('/ringkasan', authGuard, async (req, res) => {
  const { userId, role } = req.user;
  const condition = role === 'admin' ? {} : { userId: userId };

  try {
    const draftCount = await prisma.artikel.count({ where: { ...condition, status: 'draft' } });
    const publishedCount = await prisma.artikel.count({ where: { ...condition, status: 'published' } });

    res.status(200).json({ draft: draftCount, published: publishedCount });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// a) Buat artikel [Perlu Login]
router.post('/', authGuard, async (req, res) => {
  const { judul, isi, kategori, status } = req.body;

  if (!judul || !isi) {
    return res.status(400).json({ message: "Field wajib kosong atau status tidak valid" });
  }

  if (status && status !== 'draft' && status !== 'published') {
    return res.status(400).json({ message: "Field wajib kosong atau status tidak valid" });
  }

  try {
    const baru = await prisma.artikel.create({
      data: {
        judul,
        isi,
        kategori,
        status: status || 'draft',
        userId: req.user.userId
      }
    });
    res.status(201).json({ message: "Artikel berhasil dibuat", artikel: baru });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// b) Lihat semua artikel privat [Perlu Login]
router.get('/', authGuard, async (req, res) => {
  const { userId, role } = req.user;
  const condition = role === 'admin' ? {} : { userId: userId };

  try {
    const daftarArtikel = await prisma.artikel.findMany({
      where: condition,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, nama: true, email: true } }
      }
    });
    res.status(200).json(daftarArtikel);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// d) Update artikel [Perlu Login]
router.put('/:id', authGuard, async (req, res) => {
  const { id } = req.params;
  const { judul, isi, kategori, status } = req.body;

  if (status && status !== 'draft' && status !== 'published') {
    return res.status(400).json({ message: "status tidak valid" });
  }

  try {
    const artikel = await prisma.artikel.findUnique({ where: { id: parseInt(id) } });
    if (!artikel) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    if (artikel.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Artikel bukan milik user dan bukan admin" });
    }

    const updated = await prisma.artikel.update({
      where: { id: parseInt(id) },
      data: { judul, isi, kategori, status }
    });

    res.status(200).json({ message: "Artikel berhasil diupdate", artikel: updated });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// e) Hapus artikel [Perlu Login]
router.delete('/:id', authGuard, async (req, res) => {
  const { id } = req.params;

  try {
    const artikel = await prisma.artikel.findUnique({ where: { id: parseInt(id) } });
    if (!artikel) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    if (artikel.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Artikel bukan milik user dan bukan admin" });
    }

    await prisma.artikel.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Artikel berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;