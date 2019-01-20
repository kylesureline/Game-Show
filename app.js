const overlay = document.querySelector('#overlay');
const startGame = document.querySelector('.btn__reset');

startGame.addEventListener('click', (e) => {
  overlay.style.display = 'none';
});
