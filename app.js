const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// const search = 'Rachel McAdams';
const search = 'Lee DiFilippo';
let found = false;
const queue = [];
// const baconNode = {

// }

render();

function render(){
  fetch('https://www.imdb.com/name/nm0000102/?ref_=fn_al_nm_1')
  .then(data => data.text())
  .then(htmlText => {
    getMovies(htmlText) // fills up queue with movies
    baconFirstSearch( queue.shift() )
  });
}

function baconFirstSearch(node) {
  if (queue.length < 1 || found) {
    console.log(`found ${node.name} at ${node.parentNode.name}`);
    return;
  }
  
  // visit first url in line
  getChildrenFor(node.url)
  .then(data => data[0].text())
  .then( htmlText => {
    // add children to queue
        // movie? getCast
      if (node.type === 'movie') {
        // get cast urls, add to queue
        // check if search matches, make found = true
        console.log(`getting cast from ${node.name}`);
        
        node.children = getCast(htmlText, node)
      } else {
        // cast ? getMovies -----get movies urls, add to queue
        console.log(`getting movies from ${node.name}`);
        node.children = getMovies(htmlText, node)
      }
      // call baconFirstSearch
     baconFirstSearch(queue.shift())
    })
};

function getMovies(htmlText, parentNode) {
  const dom = new JSDOM(htmlText);
  const movieContainer = dom.window.document.querySelector(".filmo-category-section")
  const movies = movieContainer.querySelectorAll('b a')
  let i = 0
  const children = []
  for (const movie of movies) {
    if (i > 4) {
      return;
    }
    const _link = movie.getAttribute('href')
    const newNode = {
      url: `https://www.imdb.com${_link}`,
      name: movie.textContent,
      type: 'movie',
      parentNode
    }
    children.push(newNode);
    queue.push(newNode);
    i++
  }

  return children;
}

function getCast(htmlText, parentNode){
  const dom = new JSDOM(htmlText);
  const actorsContainer = dom.window.document.querySelector('.cast_list')
  const castLinks = actorsContainer.querySelectorAll('td.itemprop a')
  const children = []
  let i = 0;
  for (const cast of castLinks) {
    if (i > 4) {
      return;
    }
    const _link = cast.getAttribute('href')
    if (cast.textContent.includes(search)) {
      found = true;
    }
    const newNode = {
      url: `https://www.imdb.com${_link}`,
      name: cast.textContent,
      type: 'cast',
      parentNode
    }
    children.push(newNode);
    queue.push(newNode);
    i++;
  }
  console.log(children);
  
  return children;
}

function getAllActors(moviesList){
  const list = moviesList.slice(); // cloning the movie array
  getActorsForMovies(list)


}

function getChildrenFor(node){
  // this makes sure both promises are completed
  // first promise: fetch
  // second promise: delay function
  return Promise.all( [ fetch( node ), delay(10) ] )
}

function delay(ms){
  return new Promise( (resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms);
  })
}
