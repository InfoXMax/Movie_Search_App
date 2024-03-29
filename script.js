document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const movieContainer = document.getElementById('movieContainer');
    const movieDetails = document.getElementById('movieDetails');
    const backButton = document.getElementById('backButton');
    const pageSize = 10; // Number of results per page
    let currentPage = 1;

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value;
        if (searchTerm) {
            searchMovies(searchTerm);
        }
    });

    backButton.addEventListener('click', () => {
        clearMovieDetails();
    });

    function searchMovies(searchTerm) {
        const apiKey = '87b007b4';
        const apiUrl = `http://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}&page=${currentPage}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.Search) {
                    displayMovies(data.Search);
                    displayPagination(data.totalResults);
                } else {
                    movieContainer.innerHTML = '<p>No results found.</p>';
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function displayMovies(movies) {
        movieContainer.innerHTML = '';
        movies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            movieContainer.appendChild(movieCard);
        });
    }

    function createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}" class="movie-poster">
            <h3 class="movie-title">${movie.Title}</h3>
            <p class="movie-year">${movie.Year}</p>
            <p class="movie-type">${movie.Type}</p>
        `;

        movieCard.addEventListener('click', () => {
            displayMovieDetails(movie.imdbID);
        });

        return movieCard;
    }

    function displayMovieDetails(movieId) {
        const apiKey = '87b007b4';
        const apiUrl = `http://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const detailsHtml = `
                    <h2>${data.Title}</h2>
                    <p><strong>Year:</strong> ${data.Year}</p>
                    <p><strong>Genre:</strong> ${data.Genre}</p>
                    <p><strong>Director:</strong> ${data.Director}</p>
                    <p><strong>Plot:</strong> ${data.Plot}</p>
                `;
                movieDetails.innerHTML = detailsHtml;
                showBackButton();
            })
            .catch(error => console.error('Error:', error));
    }

    function displayPagination(totalResults) {
        const totalPages = Math.ceil(totalResults / pageSize);

        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination');

        for (let page = 1; page <= totalPages; page++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = page;
            pageButton.addEventListener('click', () => {
                currentPage = page;
                searchMovies(searchInput.value);
            });
            paginationContainer.appendChild(pageButton);
        }

        movieContainer.appendChild(paginationContainer);
    }

    function showBackButton() {
        backButton.style.display = 'block';
    }

    function clearMovieDetails() {
        movieDetails.innerHTML = '';
        backButton.style.display = 'none';
    }
});
