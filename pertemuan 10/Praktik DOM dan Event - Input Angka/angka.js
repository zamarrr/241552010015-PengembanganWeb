const input = document.querySelector('#angka');
const button = document.querySelector('#btn');
const hasil = document.querySelector('#hasil');

function tampilkanAngka(){

  const nilai = input.value;

  if(nilai === ''){
    hasil.textContent =
      'Silakan masukkan angka!';
  }else{
    hasil.textContent =
      'Kamu memasukkan angka: ' + nilai;
  }

  hasil.classList.remove('hidden');

  input.value = '';

}

button.addEventListener('click', tampilkanAngka);

input.addEventListener('keydown', e => {

  if(e.key === 'Enter'){
    tampilkanAngka();
  }

});