function validasi(id, aturan, pesan) {
  const el = document.querySelector("#" + id);
  const err = el.parentElement.querySelector('.pesan-error');
  const lulus = aturan(el.value.trim());
  
  el.classList.toggle('valid', lulus);
  el.classList.toggle('invalid', !lulus && el.value !== "");
  
  if (err) err.textContent = lulus ? "" : pesan;
  return lulus;
}

document.querySelector('#nama').addEventListener('input', () => {
  validasi('nama', v => v.length >= 3, 'Minimal 3 karakter');
});

document.querySelector('#email').addEventListener('input', () => {
  validasi('email', v => /^[^@]+@[^@]+\.[^@]+$/.test(v), 'Format email tidak valid');
});

// LOGIKA PEMBARUAN: Mengubah warna bar sekaligus teks keterangan (Lemah, Sedang, Kuat) secara real-time
document.querySelector('#password').addEventListener('input', e => {
  const pct = Math.min((e.target.value.length / 12) * 100, 100);
  const isian = document.querySelector('.isian');
  const txtStatus = document.querySelector('#status-password');
  
  // Update lebar bilah warna
  isian.style.width = pct + '%';
  
  if (e.target.value.length === 0) {
    isian.style.background = 'transparent';
    txtStatus.textContent = 'Belum diisi';
    txtStatus.style.color = '#94a3b8'; // Abu-abu
  } else if (pct < 40) {
    isian.style.background = '#e54b5a';
    txtStatus.textContent = 'Lemah ❌';
    txtStatus.style.color = '#e54b5a'; // Merah
  } else if (pct < 70) {
    isian.style.background = '#ff9933';
    txtStatus.textContent = 'Sedang ⚠️';
    txtStatus.style.color = '#ff9933'; // Oranye
  } else {
    isian.style.background = '#27c467';
    txtStatus.textContent = 'Kuat ✓';
    txtStatus.style.color = '#27c467'; // Hijau
  }
});

document.querySelector('#formulir').addEventListener('submit', e => {
  e.preventDefault();
  
  const semuaValid = [
    validasi('nama', v => v.length >= 3, 'Min. 3 karakter'),
    validasi('email', v => /^[^@]+@[^@]+\.[^@]+$/.test(v), 'Email tidak valid'),
    validasi('password', v => v.length >= 8, 'Min. 8 karakter')
  ].every(Boolean);
  
  if (!semuaValid) return;
  
  document.querySelector('#sukses').classList.remove('tersembunyi');
  document.querySelector('#formulir').classList.add('tersembunyi');
  
  setTimeout(() => {
    alert('Simulasi Redirect ke Halaman Utama!');
  }, 2000);
});