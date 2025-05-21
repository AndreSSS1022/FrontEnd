// API URL
const API_URL = "https://carsmoviesinventoryproject-production.up.railway.app/api/v1/carsmovies";

// State variables
let currentPage = 0;
let pageSize = 5;
let editMode = false;

// DOM Elements
const movieForm = document.getElementById('movie-form');
const formTitle = document.getElementById('form-title');
const movieIdInput = document.getElementById('movie-id');
const movieNameInput = document.getElementById('movie-name');
const movieYearInput = document.getElementById('movie-year');
const movieDurationInput = document.getElementById('movie-duration');
const saveButton = document.getElementById('save-button');
const cancelButton = document.getElementById('cancel-button');
const moviesBody = document.getElementById('movies-body');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const statusElement = document.getElementById('status');

// Fetch movies from API
async function fetchMovies() {
    try {
        const response = await fetch(`${API_URL}?page=${currentPage}&size=${pageSize}&sort=carMovieYear,desc`);
        if (!response.ok) {
            throw new Error('Error al cargar datos');
        }
        
        const data = await response.json();
        renderMovies(data.Movies);
        
        // Update pagination buttons
        prevPageButton.disabled = currentPage === 0;
        nextPageButton.disabled = data.Movies.length < pageSize;
        pageInfo.textContent = `Página ${currentPage + 1}`;
        
    } catch (error) {
        showStatus(error.message, false);
    }
}

// Render movies in the table
function renderMovies(movies) {
    moviesBody.innerHTML = '';
    
    movies.forEach(movie => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movie.id}</td>
            <td>${movie.carMovieName}</td>
            <td>${movie.carMovieYear}</td>
            <td>${movie.duration}</td>
            <td class="actions">
                <button class="edit" data-id="${movie.id}">Editar</button>
                <button class="delete" data-id="${movie.id}">Eliminar</button>
            </td>
        `;
        moviesBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.edit').forEach(button => {
        button.addEventListener('click', () => editMovie(button.dataset.id));
    });
    
    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', () => deleteMovie(button.dataset.id));
    });
}

// Add a new movie
async function addMovie(movieData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movieData)
        });
        
        if (!response.ok) {
            throw new Error('Error al agregar la película');
        }
        
        showStatus('Película agregada correctamente', true);
        resetForm();
        fetchMovies();
        
    } catch (error) {
        showStatus(error.message, false);
    }
}

// Update an existing movie
async function updateMovie(id, movieData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movieData)
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar la película');
        }
        
        showStatus('Película actualizada correctamente', true);
        resetForm();
        fetchMovies();
        
    } catch (error) {
        showStatus(error.message, false);
    }
}

// Delete a movie
async function deleteMovie(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta película?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar la película');
        }
        
        showStatus('Película eliminada correctamente', true);
        fetchMovies();
        
    } catch (error) {
        showStatus(error.message, false);
    }
}

// Edit a movie (populate form with existing data)
async function editMovie(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar datos de la película');
        }
        
        const movie = await response.json();
        
        // Populate form
        movieIdInput.value = movie.id;
        movieNameInput.value = movie.carMovieName;
        movieYearInput.value = movie.carMovieYear;
        movieDurationInput.value = movie.duration;
        
        // Switch to edit mode
        editMode = true;
        formTitle.textContent = 'Editar Película';
        cancelButton.classList.remove('hidden');
        
    } catch (error) {
        showStatus(error.message, false);
    }
}

// Reset form to add mode
function resetForm() {
    movieForm.reset();
    movieIdInput.value = '';
    editMode = false;
    formTitle.textContent = 'Agregar Nueva Película';
    cancelButton.classList.add('hidden');
}

// Show status message
function showStatus(message, isSuccess) {
    statusElement.textContent = message;
    statusElement.classList.remove('hidden', 'success', 'error');
    statusElement.classList.add(isSuccess ? 'success' : 'error');
    
    // Hide after 3 seconds
    setTimeout(() => {
        statusElement.classList.add('hidden');
    }, 3000);
}

// Event Listeners

// Form submission
movieForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const movieData = {
        carMovieName: movieNameInput.value,
        carMovieYear: parseInt(movieYearInput.value),
        duration: parseInt(movieDurationInput.value)
    };
    
    if (editMode) {
        updateMovie(movieIdInput.value, movieData);
    } else {
        addMovie(movieData);
    }
});

// Cancel button
cancelButton.addEventListener('click', resetForm);

// Pagination
prevPageButton.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        fetchMovies();
    }
});

nextPageButton.addEventListener('click', () => {
    currentPage++;
    fetchMovies();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
});