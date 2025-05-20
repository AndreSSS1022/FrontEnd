// Cambia las URLs según la API real que exponga tu backend Python
const API_BASE = "https://carsmoviesinventoryproject-production.up.railway.app/api/v1/carsmovies?page=0&size=5&sort=carMovieYear,desc"; // Ajusta el puerto si es necesario

// Obtener y mostrar autos
fetch(`${API_BASE}/cars`)
    .then(response => response.json())
    .then(cars => {
        const carsList = document.getElementById('cars-list');
        cars.forEach(car => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <div class="item-title">${car.name}</div>
                <div>Marca: ${car.brand}</div>
                <div>Año: ${car.year}</div>
            `;
            carsList.appendChild(div);
        });
    })
    .catch(error => {
        document.getElementById('cars-list').textContent = 'Error cargando autos.';
    });

// Obtener y mostrar películas
fetch(`${API_BASE}/movies`)
    .then(response => response.json())
    .then(movies => {
        const moviesList = document.getElementById('movies-list');
        movies.forEach(movie => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <div class="item-title">${movie.title}</div>
                <div>Director: ${movie.director}</div>
                <div>Año: ${movie.year}</div>
            `;
            moviesList.appendChild(div);
        });
    })
    .catch(error => {
        document.getElementById('movies-list').textContent = 'Error cargando películas.';
    });
