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

function initApp() {
  const controls = createControls();
  const piano = createPiano();

  document.body.append(controls, piano);
}

document.addEventListener('DOMContentLoaded', initApp);
