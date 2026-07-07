const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
  // 1. Ambil header bernama 'authorization' yang dikirim oleh Client (Postman/Frontend)
  const authHeader = req.headers['authorization'];
  
  // 2. Cek apakah headernya ada dan formatnya benar ("Bearer <token>")
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ada atau tidak valid' });
  }

  // 3. Potong teks "Bearer " untuk mengambil string token rahasianya saja
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verifikasi token menggunakan kunci rahasia dari .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 5. Jika token sah, simpan data isi token (id, nama, role) ke dalam objek `req.user`
    req.user = decoded;
    
    // 6. Izinkan request untuk lanjut ke fungsi/route berikutnya
    next();
  } catch (error) {
    // Jika token palsu, salah kunci, atau sudah kedaluwarsa
    return res.status(401).json({ message: 'Token tidak ada atau tidak valid' });
  }
};

module.exports = authGuard;