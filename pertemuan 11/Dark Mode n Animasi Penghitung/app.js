if (localStorage.getItem('tema') === 'gelap') {
  document.body.classList.add('gelap');
}

document.querySelector('#theme-btn').addEventListener('click', () => {
  document.body.classList.toggle('gelap');
  const isDark = document.body.classList.contains('gelap');
  localStorage.setItem('tema', isDark ? 'gelap' : 'terang');
});

document.querySelectorAll('.penghitung').forEach(el => {
  const target = +el.dataset.target;
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