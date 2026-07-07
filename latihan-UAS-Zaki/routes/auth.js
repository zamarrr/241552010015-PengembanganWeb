const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db'); // Mengambil koneksi Prisma dari db.js

// ==========================================
// a) ENDPOINT REGISTER — POST /api/auth/register
// ==========================================
router.post('/register', async (req, res) => {
  const { email, nama, password } = req.body;

  // 1. Validasi: Email, nama, dan password tidak boleh kosong
  if (!email || !nama || !password) {
    return res.status(400).json({ message: 'Field wajib kosong atau password < 8 karakter' });
  }

  // 2. Validasi: Password minimal wajib 8 karakter
  if (password.length < 8) {
    return res.status(400).json({ message: 'Field wajib kosong atau password < 8 karakter' });
  }

  try {
    // 3. Cek apakah email sudah terdaftar di database
    const emailTerdaftar = await prisma.user.findUnique({ where: { email } });
    if (emailTerdaftar) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    // 4. Amankan password: Acak password asli menggunakan bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Simpan user baru ke database dengan role default "user"
    const userBaru = await prisma.user.create({
      data: {
        email,
        nama,
        password: hashedPassword,
        role: 'user'
      }
    });

    // 6. Trik keamanan: Pisahkan data password agar tidak ikut terkirim ke klien
    const { password: _, ...userTanpaPassword } = userBaru;

    // 7. Kirim respon sukses (HTTP 201 Created)
    return res.status(201).json({
      message: 'Registrasi berhasil',
      user: userTanpaPassword
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ==========================================
// b) ENDPOINT LOGIN — POST /api/auth/login
// ==========================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. Validasi input kosong
  if (!email || !password) {
    return res.status(400).json({ message: 'Field wajib kosong' });
  }

  try {
    // 2. Cari user di database berdasarkan email-nya
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // 3. Bandingkan password inputan dengan password teracak di DB memakai bcrypt.compare()
    const passwordCocok = await bcrypt.compare(password, user.password);
    if (!passwordCocok) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // 4. Jika cocok, buat JWT Token rahasia yang berlaku selama 7 hari
    // Isi token menyertakan: userId, email, nama, dan role
    const token = jwt.sign(
      { userId: user.id, email: user.email, nama: user.nama, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Pisahkan field password sebelum dikembalikan
    const { password: _, ...userTanpaPassword } = user;

    // 6. Kirim respon sukses berisi token dan info user (HTTP 200 OK)
    return res.status(200).json({
      message: 'Login berhasil',
      token,
      user: userTanpaPassword
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Eksport router ini agar bisa dipakai di file utama index.js
module.exports = router;