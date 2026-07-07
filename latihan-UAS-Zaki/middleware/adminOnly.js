const adminOnly = (req, res, next) => {
  // Karena dipasang setelah authGuard, req.user dipastikan sudah terisi.
  // Kita tinggal cek apakah rolenya adalah 'admin'
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak: Hanya untuk Admin' });
  }
  
  // Jika dia terbukti admin, izinkan melenggang ke route selanjutnya
  next();
};

module.exports = adminOnly;