const TOTAL = 25 * 60; // 25 menit
let remaining = TOTAL;
let interval = null;

function tick(){

  remaining--;

  if(remaining <= 0){
    clearInterval(interval);
    done();
    return;
  }

  updateDisplay();

}

function updateDisplay(){

  const m =
    String(Math.floor(remaining / 60))
    .padStart(2,'0');

  const s =
    String(remaining % 60)
    .padStart(2,'0');

  document.querySelector('#display').textContent =
    m + ':' + s;

  const pct =
    (remaining / TOTAL) * 100;

  document.querySelector('#bar').style.width =
    pct + '%';

}

function done(){

  document.querySelector('#status').textContent =
    'Waktu selesai!';

}

document.querySelector('#start')
.addEventListener('click', () => {

  if(!interval){

    interval = setInterval(tick,1000);

    document.querySelector('#status').textContent =
      'Berjalan...';

  }

});

document.querySelector('#pause')
.addEventListener('click', () => {

  clearInterval(interval);

  interval = null;

  document.querySelector('#status').textContent =
    'Dijeda';

});

document.querySelector('#reset')
.addEventListener('click', () => {

  clearInterval(interval);

  interval = null;

  remaining = TOTAL;

  updateDisplay();

  document.querySelector('#status').textContent =
    'Direset';

});

updateDisplay();