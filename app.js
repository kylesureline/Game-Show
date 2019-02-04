document.addEventListener('DOMContentLoaded', (e) => {
  const overlay = document.querySelector('#overlay');
  const startGame = document.querySelector('.btn__reset');
  const qwerty = document.querySelector('#qwerty');
  const qwertyButtons = qwerty.querySelectorAll('button');
  const phrase = document.querySelector('#phrase');
  const scoreboard = document.querySelector('#scoreboard');
  const heartsOl = scoreboard.querySelector('ol');
  const phrases = [ // U2 Song Titles
    'beautiful day',
    'sunday bloody sunday',
    'with or without you',
    'where the streets have no name',
    'the unforgettable fire',
    'when love comes to town',
    'angel of harlem',
    'all i want is you',
    'the three sunrises',
    'spanish eyes',
    'sweetest thing',
    'even better than the real thing',
    'until the end of the world',
    'hands that built america',
    'love and peace or else',
    'city of blinding lights',
    'staring at the sun',
    'original of the species',
    'crumbs from your table',
    'all because of you'
  ];
  let missed = 5;
  let phraseObj = {
    array: [],
    toStr: () => {
      return phraseObj.array.join(' ');
    },
    letters: () => {
      return phraseObj.array.join('').length;
    }
  }

  function getRandomPhraseAsArray(arr) {
    let randomPhraseIndex = Math.floor(Math.random() * phrases.length);
    return phrases[randomPhraseIndex].split(' ');
  }

  function addMultipleListeners(element,events,handler) {
	  if (!(events instanceof Array)){
	    throw 'addMultipleListeners: '+
	          'please supply an array of eventstrings '+
	          '(like ["click","mouseover"])';
	  }
	  for (let i = 0;i < events.length; i += 1){
	    element.addEventListener(events[i],handler);
	  }
	}

  function preloadGame() {

    function resetHearts() {
      for(let i = 0; i < heartsOl.children.length; i++) {
        let li = heartsOl.children[i];
        let img = li.firstElementChild;
        img.src = 'images/liveHeart.png';
      }
    }

    function showQwerty() {
      for(let i = 0; i < qwertyButtons.length; i++) {
        let button = qwertyButtons[i];
        button.className = '';
        button.disabled = false;
      }
    }

    function addPhraseToDisplay() {

      function removeLetters() {
        while(phrase.firstChild) {
          phrase.removeChild(phrase.firstChild);
        }
      }

      function createWordUl(word) {

        function createElement(tagName, attribute, value) {
          let element = document.createElement(tagName);
          element[attribute] = value;
          return element;
        }

        let ul = createElement('UL', 'className', 'word');
        for(let i = 0; i < word.length; i++) {
          let letter = word[i];
          let letterLi = createElement('LI', 'className', 'letter');
          letterLi.textContent = letter;
          ul.appendChild(letterLi);
        }
        let spaceLi = createElement('LI', 'className', 'space');
        ul.appendChild(spaceLi);

        return ul;
      }

      removeLetters();

      for(let i = 0; i < phraseObj.array.length; i++) {
        let word = phraseObj.array[i];
        let wordUl = createWordUl(word);
        phrase.appendChild(wordUl);
      }
    }

    missed = 5;
    resetHearts();
    showQwerty();
    phraseObj.array = getRandomPhraseAsArray();
    addPhraseToDisplay();

  }

  preloadGame();

  startGame.addEventListener('click', (e) => {
    overlay.style.display = 'none';
    addMultipleListeners(document, ['click', 'keydown'], inputHandler);
  });

  function endGame(won) {

    document.removeEventListener('click', inputHandler);
    document.removeEventListener('keydown', inputHandler);

    let h2 = overlay.querySelector('h2');
    let a = overlay.querySelector('a');
    a.textContent = 'Play again?';

    if(won) {
      overlay.className = 'win';
      h2.textContent = 'You won! 😀';
    } else {
      overlay.className = 'lose';
      h2.textContent = 'You lost! 😢';
    }
    // alert(`Game over! You ${won}!`);
    overlay.style.display = '';
    preloadGame();

  }

  function inputHandler(event) {

    function guess(letter) {

      let shownLetters = 0;

      function allAreShown() {
        return shownLetters === phraseObj.letters();
      }

      function checkPhrase(letter) {

        function checkWord(letter, wordUl, word) {
          let incorrectLettersFound = 0;

          for(let i = 0; i < word.length; i++) {
            let answerLetter = word[i];

            let letterLi = wordUl.children[i];

            if(letter === answerLetter) { // correct letter found!
              letterLi.className += ' show';
            } else {
              incorrectLettersFound += 1;
            }

            if(letterLi.className.includes('show')) {
              shownLetters += 1;
            }

          }
          return incorrectLettersFound !== word.length;
        }

        let lettersFound = 0;
        shownLetters = 0;

        for(let i = 0; i < phraseObj.array.length; i++) {
          let wordUl = phrase.querySelectorAll('ul')[i];
          let word = phraseObj.array[i];
          lettersFound += Number(checkWord(letter, wordUl, word));
        }

        return lettersFound === 0;
      } // end checkPhrase()

      if(checkPhrase(letter)) {
        missed -= 1;
        let li = heartsOl.children[missed];
        let img = li.firstElementChild;
        img.src = 'images/lostHeart.png';
      }

      // end game
      if(missed === 0) {
        endGame(false);
      }
      if(allAreShown()) {
        endGame(true);
      }
    } // end guess()

    function hideLetter(letter) {

      function hideLetterInKeyRow(letter, keyRow) {
        for(let i = 0; i < keyRow.children.length; i++) {
          let button = keyRow.children[i];
          if(letter === button.textContent && !button.disabled) {
            button.className = 'chosen';
            button.disabled = true;
            guess(letter);
          }
        }
      }

      for(let i = 0; i < qwerty.children.length; i++) {
        let keyRow = qwerty.children[i];
        hideLetterInKeyRow(letter, keyRow);
      }
    } // end hideLetter

    const pattern = /^[a-z]/;
    let letter = '';

    if(event.key === undefined) {
      if(event.target.tagName === 'BUTTON') {
        letter = event.target.textContent;
      }
    } else if(event.key.match(pattern)) {
      letter = event.key;
    }

    if(letter !== '') {
      hideLetter(letter);
    }

  } // end inputHandler()

});
