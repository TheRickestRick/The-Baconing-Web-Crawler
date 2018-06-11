const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;



  fetch('https://www.imdb.com/name/nm0000102/#actor')
    .then(res => res.text())
    .then(render);

function render(htmlText){
  const dom = new JSDOM(htmlText)
  const movieContainer = dom.window.document.querySelector('.filmo-category-section')
  const movies = movieContainer.querySelectorAll('b a')

  for (const movie of movies) {
    console.log(movie.textContent)
  }
}
