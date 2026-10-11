'use strict';
const messages = {
  builder: 'Side project in your backpack? Find a seat. Let’s see what you’re making.',
  reader: 'Bring that book you’ve been meaning to finish. Good company, great reading breaks.',
  wanderer: 'No laptop, no book, no problem. Pull up a chair. You’re already bringing enough.'
};
const cards = [...document.querySelectorAll('[data-character]')];
const message = document.querySelector('.quest-message');
cards.forEach(card => card.addEventListener('click', () => {
  cards.forEach(option => {
    const selected = option === card;
    option.classList.toggle('selected', selected);
    option.setAttribute('aria-pressed', String(selected));
    option.querySelector('.select-label').textContent = selected ? '✓ QUEST SELECTED' : '+ SELECT QUEST';
  });
  message.textContent = '↳ ' + messages[card.dataset.character];
}));
