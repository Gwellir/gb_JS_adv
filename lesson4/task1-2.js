const text = document.querySelector('.text').textContent;
const elemToFill = document.querySelector('.task-1');
const elemToFill2 = document.querySelector('.task-2');

const re1 = /'/g;
elemToFill.insertAdjacentHTML('beforebegin', `<p>task1 using: ${re1}</p>`);
elemToFill.textContent = text.replace(re1, '"');

const re2 = /\B'|'\B/g;
elemToFill2.insertAdjacentHTML('beforebegin', `<p>task2 using: ${re2}</p>`);
elemToFill2.textContent = text.replace(re2, '"');