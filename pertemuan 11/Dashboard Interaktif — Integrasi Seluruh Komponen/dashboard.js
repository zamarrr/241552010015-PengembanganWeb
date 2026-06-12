function gantiTab(idPanel) {
  document.querySelectorAll('.panel, .tombol-tab').forEach(el => el.classList.remove('aktif'));
  
  document.querySelector('#' + idPanel).classList.add('aktif');
  document.querySelector(`[data-tab='${idPanel}']`).classList.add('aktif');
}

document.querySelectorAll('.tombol-tab').forEach(btn => {
  btn.addEventListener('click', () => gantiTab(btn.dataset.tab));
});

function jalankanPenghitung() {
  document.querySelectorAll('.kartu-stat').forEach(kartu => {
    const el = kartu.querySelector('.penghitung');
    const target = +kartu.dataset.target;
    let n = 0; 
    const langkah = target / 60;
    
    const jalankan = () => {
      n = Math.min(n + langkah, target);
      el.textContent = Math.floor(n).toLocaleString();
      if (n < target) requestAnimationFrame(jalankan);
    };
    requestAnimationFrame(jalankan);
  });
}
jalankanPenghitung();

document.querySelectorAll('.judul-akordion').forEach(tombol => {
  tombol.addEventListener('click', () => {
    tombol.closest('.item-akordion').classList.toggle('terbuka');
  });
});

if (localStorage.getItem('tema') === 'gelap') document.body.classList.add('gelap');
document.querySelector('#theme-btn').addEventListener('click', () => {
  document.body.classList.toggle('gelap');
  const d = document.body.classList.contains('gelap');
  localStorage.setItem('tema', d ? 'gelap' : 'terang');
});