let busyIndicator = document.querySelector('.busy-indicator');
let jokesList = document.querySelector('.jokes');
let totalJokes = document.querySelector('#total-jokes');
let jokes;

document.querySelector('.get-jokes').addEventListener('click', getJokes);
window.addEventListener('DOMContentLoaded', fetchJokes);

// IMPLEMENT LOCAL STORAGE
function fetchJokes() {
  if (localStorage.getItem('jokes') === null) {
    jokes = [];
  } else {
    jokes = JSON.parse(localStorage.getItem('jokes'));

    jokes.forEach(function (joke) {
      jokesList.innerHTML += `
        <li>
          <span>${joke}</span>
          <a href='#' class='delete-button'>X</a>
        </li> `;
    });
    totalJokes.innerHTML = `Total Number of Jokes: ${jokes.length}`;
  }
}

function getJokes(e) {
  let number = Number(document.querySelector('#number').value);  

  const request = new XMLHttpRequest();
  request.open('GET', `http://api.icndb.com/jokes/random/${number}`, true);
  request.onload = function () {
    if (this.status === 200) {
      
      let jokesHeading = document.querySelector('#jokes-heading');
      let jokeObjects = ((JSON.parse(request.responseText)).value);

      if (number > 1) {
        jokesHeading.innerHTML = `Fetched ${number} jokes`;
      }
      else {
        jokesHeading.innerHTML = `Input a valid number`;
      }
      if (number === 1) {
        jokesHeading.innerHTML = `Fetched ${number} joke`;
      } 

      jokeObjects.forEach(function (joke) {
        const output = ` 
        <li>
          <span>${joke.joke}</span>
          <a href='#' class='delete-button'>X</a>
        </li> `;

        jokes.push(joke.joke);
        
        jokesList.innerHTML += output;
        const lis = document.querySelectorAll('li');
        totalJokes.innerHTML = `Total Number of Jokes: ${lis.length}`;

        localStorage.setItem('jokes', JSON.stringify(jokes));
      });
    }
  }

  request.send();
  e.preventDefault();
}

jokesList.addEventListener('click', function (e) {

  if (e.target.classList.contains('delete-button')) {
    if (confirm('Are you sure? This action cannot be undone!')) {
      e.target.parentElement.remove();
      deleteJokeFromLS(e.target.previousElementSibling);
    }
  }
  e.preventDefault()
})

function deleteJokeFromLS(jokeList) {
  jokes = JSON.parse(localStorage.getItem('jokes'));

  jokes.forEach(function (joke, index) {
    if (joke === jokeList.textContent) {
      jokes.splice(index, 1);
    }
  });
  totalJokes.innerHTML = `Total Number of Jokes: ${jokes.length}`;
  localStorage.setItem('jokes', JSON.stringify(jokes));
}