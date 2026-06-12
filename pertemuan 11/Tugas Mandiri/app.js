// LOGIKA 1: DARK MODE TOGGLE (PERSISTEN)
if (localStorage.getItem('tema') === 'gelap') {
  document.body.classList.add('gelap');
}

document.querySelector('#theme-btn').addEventListener('click', () => {
  document.body.classList.toggle('gelap');
  
  const isDark = document.body.classList.contains('gelap');
  localStorage.setItem('tema', isDark ? 'gelap' : 'terang');
});

// LOGIKA 2: TAB NAVIGATION
function gantiTab(idPanel) {
  document.querySelectorAll('.panel, .tombol-tab').forEach(el => el.classList.remove('aktif'));
  
  document.querySelector('#' + idPanel).classList.add('aktif');
  document.querySelector(`[data-tab='${idPanel}']`).classList.add('aktif');
}

document.querySelectorAll('.tombol-tab').forEach(btn => {
  btn.addEventListener('click', () => gantiTab(btn.dataset.tab));
});

// LOGIKA 3: ACCORDION COMPONENT
document.querySelectorAll('.judul-akordion').forEach(tombol => {
  tombol.addEventListener('click', () => {
    tombol.closest('.item-akordion').classList.toggle('terbuka');
  });
});

// LOGIKA 4: FORM VALIDASI REAL-TIME & STRENGTH BAR
function validasiField(id, aturan, pesan) {
  const el = document.querySelector("#" + id);
  const err = el.parentElement.querySelector('.pesan-error');
  const lulus = aturan(el.value.trim());
  
  el.classList.toggle('valid', lulus);
  el.classList.toggle('invalid', !lulus && el.value !== '');
  
  if (err) {
    err.textContent = lulus ? '' : pesan;
  }
  return lulus;
}

document.querySelector('#nama').addEventListener('input', () => {
  validasiField('nama', v => v.length >= 3, 'Nama minimal harus 3 karakter!');
});

document.querySelector('#email').addEventListener('input', () => {
  validasiField('email', v => /^[^@]+@[^@]+\.[^@]+$/.test(v), 'Format email salah!');
});

document.querySelector('#password').addEventListener('input', e => {
  const txt = e.target.value;
  
  const lulusValidasi = validasiField('password', v => v.length >= 8, 'Password minimal 8 karakter!');
  
  const pct = Math.min((txt.length / 12) * 100, 100);
  const isian = document.querySelector('.isian');
  isian.style.width = pct + '%';
  
  if (pct < 40) {
    isian.style.background = '#e54b5a'; // Merah (Lemah)
  } else if (pct < 70) {
    isian.style.background = '#ff9933'; // Oranye (Sedang)
  } else {
    isian.style.background = '#27c467'; // Hijau (Kuat)
  }
});

document.querySelector('#formulir').addEventListener('submit', e => {
  e.preventDefault(); 
  
  const vNama = validasiField('nama', v => v.length >= 3, 'Nama minimal 3 karakter!');
  const vEmail = validasiField('email', v => /^[^@]+@[^@]+\.[^@]+$/.test(v), 'Format email salah!');
  const vPass = validasiField('password', v => v.length >= 8, 'Password minimal 8 karakter!');
  
  if (vNama && vEmail && vPass) {
    document.querySelector('#sukses').classList.remove('tersembunyi');
    
    setTimeout(() => {
      document.querySelector('#formulir').reset();
      document.querySelector('#sukses').classList.add('tersembunyi');
      document.querySelectorAll('input').forEach(i => i.classList.remove('valid'));
      document.querySelector('.isian').style.width = '0%';
      gantiTab('ikhtisar'); 
    }, 2500);
  }
});

// LOGIKA TAMBAHAN: ANIMASI COUNT-UP STATISTIK
function jalankanPenghitung() {
  document.querySelectorAll('.kartu-stat').forEach(kartu => {
    const el = kartu.querySelector('.penghitung');
    const target = +kartu.dataset.target;
    let n = 0;
    const langkah = target / 60; 
    
    const jalankan = () => {
      n = Math.min(n + langkah, target);
      el.textContent = Math.floor(n).toLocaleString();
      
      if (n < target) {
        requestAnimationFrame(jalankan); 
      }
    };
    requestAnimationFrame(jalankan);
  });
}

window.addEventListener('DOMContentLoaded', jalankanPenghitung);