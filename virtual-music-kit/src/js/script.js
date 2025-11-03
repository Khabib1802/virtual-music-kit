document.addEventListener('DOMContentLoaded', initApp);

function createElement(mainOptions, otherAttributes = {}, children = []) {
  const { tag = 'div', text = '', classes = [] } = mainOptions;

  const element = document.createElement(tag);
  element.textContent = text;
  if (classes.length > 0) {
    element.classList.add(...classes);
  }

  Object.entries(otherAttributes).forEach(([key, value]) => {
    if (key in element) {
      element[key] = value;
    } else {
      element.setAttribute(key, value);
    }
  });

  children.forEach((child) => {
    element.append(child);
  });

  return element;
}

function createPianoKey(dataKey) {
  const pianoKey = createElement(
    {
      classes: ['piano__key'],
    },
    {
      'data-key': dataKey,
    },
    [
      createElement({ classes: ['piano__edit-area'] }, {}, [
        createElement({ tag: 'label', classes: ['piano__label'], text: dataKey }),
        createElement(
          { tag: 'input', classes: ['piano__input'] },
          { type: 'text', value: dataKey, maxLength: 1 }
        ),
        createElement({ tag: 'button', classes: ['piano__edit'] }, { title: 'edit' }),
      ]),
    ]
  );

  return pianoKey;
}

function createPiano(dataKeys = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K']) {
  const piano = createElement({
    classes: ['piano'],
  });

  dataKeys.forEach((dataKey) => {
    piano.append(createPianoKey(dataKey));
  });

  return piano;
}

function createControls() {
  const controls = createElement(
    {
      classes: ['controls'],
    },
    {},
    [
      createElement(
        { tag: 'input', classes: ['controls__input'] },
        { type: 'text', maxLength: 16 }
      ),
      createElement({ tag: 'button', classes: ['controls__play'], text: 'Play' }),
    ]
  );

  return controls;
}

const getDataKeys = () => {
  const pianoKeys = document.querySelectorAll('.piano__key');
  const dataKeys = [...pianoKeys].map((pianoKey) => pianoKey.dataset.key);

  return dataKeys;
};

function addPianoKeysEventListener() {
  let isPianoKeyActive = false;

  document.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT') {
      return;
    }
    if (isPianoKeyActive) {
      return;
    }

    isPianoKeyActive = true;

    const pianoKey = document.querySelector(`[data-key="${event.code[event.code.length - 1]}"]`);
    if (pianoKey) {
      pianoKey.classList.add('active');
      playAudio(event.code[event.code.length - 1]);
    }
  });

  document.addEventListener('keyup', (event) => {
    isPianoKeyActive = false;
    const pianoKey = document.querySelector(`[data-key="${event.code[event.code.length - 1]}"]`);
    if (pianoKey) {
      pianoKey.classList.remove('active');
    }
  });
}

function addPianoClickEventListener() {
  document.addEventListener('mousedown', (event) => {
    if (
      event.target.classList.contains('piano__key') ||
      event.target.classList.contains('piano__edit-area')
    ) {
      if (event.target.tagName === 'INPUT') {
        return;
      }

      playAudio(event.target.dataset.key || event.target.closest('.piano__key').dataset.key);
    }
  });
}

function changeKeyData() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.classList.contains('piano__input')) {
      const pianoInput = event.target;
      const pianoInputValue = pianoInput.value.toUpperCase();
      const pianoEditArea = pianoInput.closest('.piano__edit-area');
      const pianoKey = pianoInput.closest('.piano__key');
      const pianoLabel = pianoEditArea.querySelector('.piano__label');

      const dataKeys = getDataKeys();

      if (
        (dataKeys.includes(pianoInputValue) && pianoInputValue !== pianoKey.dataset.key) ||
        !/[A-Z]/.test(pianoInputValue)
      ) {
        pianoEditArea.classList.add('error');
        pianoInput.value = pianoKey.dataset.key;
        pianoInput.focus();
        pianoInput.select();
      } else {
        pianoKey.dataset.key = pianoInputValue;
        pianoLabel.textContent = pianoInputValue;

        if (event.target.matches('.piano__input')) {
          event.target.closest('.piano__edit-area').classList.remove('edit-mode');
          event.target.closest('.piano__edit-area').classList.remove('error');
        }
      }
    }
  });
}

function addPianoEditEventListener() {
  document.addEventListener('click', (event) => {
    if (event.target.matches('.piano__edit')) {
      event.target.closest('.piano__edit-area').classList.toggle('edit-mode');
      event.target.closest('.piano__edit-area').classList.remove('error');

      const pianoInput = event.target.previousElementSibling;
      pianoInput.focus();
      pianoInput.select();
    }
  });
}

function initApp() {
  const controls = createControls();
  const piano = createPiano();

  document.body.append(controls, piano);

  addPianoClickEventListener();
  addPianoKeysEventListener();
  addPianoEditEventListener();
  changeKeyData();
}

const audioContext = new AudioContext();

function playAudio(objKey) {
  const pianoKey = document.querySelectorAll('.piano__key');

  const obj = {
    [pianoKey[0].dataset.key]: 200,
    [pianoKey[1].dataset.key]: 300,
    [pianoKey[2].dataset.key]: 400,
    [pianoKey[3].dataset.key]: 500,
    [pianoKey[4].dataset.key]: 600,
    [pianoKey[5].dataset.key]: 700,
    [pianoKey[6].dataset.key]: 800,
    [pianoKey[7].dataset.key]: 900,
  };
  const frequency = obj[objKey];

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.value = frequency;

  gain.gain.value = 0.2;

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();

  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

  setTimeout(() => {
    oscillator.stop();
  }, 500);
}
