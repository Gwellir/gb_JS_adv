const text = document.querySelector('.text').textContent
const elemToFill = document.querySelector('.edited-text')
const elemToFill2 = document.querySelector('.edited-text-2')

const re = /(\A|\s|)(\w+: )'(.*?)'(\s)/g
elemToFill.insertAdjacentHTML('beforebegin', `<p>using: ${re}</p>`)
elemToFill.textContent = text.replace(re, '$2"$3"$4')

const re2 = /\B'|'\B/g
elemToFill2.insertAdjacentHTML('beforebegin', `<p>using: ${re2}</p>`)
elemToFill2.textContent = text.replace(re2, '"')