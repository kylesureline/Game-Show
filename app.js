const overlay = document.querySelector('#overlay');
const startGame = document.querySelector('.btn__reset');
const qwerty = document.querySelector('#qwerty');

startGame.addEventListener('click', (e) => {
  overlay.style.display = 'none';
});

qwerty.addEventListener('click', (e) => {
  if(e.target.tagName === 'BUTTON') {
    // alert(e.target.textContent);
    e.target.style.display = 'none';
  }
});
