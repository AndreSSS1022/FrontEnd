const API_BASE = 'https://carsmoviesinventoryproject-production.up.railway.app/api/v1/carsmovies';

function fetchItems() {
    fetch(`${API_BASE}?page=0&size=10&sort=carMovieYear,desc`)
        .then(res => res.json())
        .then(data => {
            const items = data.content || data; // Ajusta según la respuesta real
            const list = document.getElementById('items-list');
            list.innerHTML = '';
            items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'item';
                div.innerHTML = `
                    <div class="item-title">${item.carMovieTitle} (${item.carMovieYear})</div>
                    <div>Director: ${item.carMovieDirector || ''}</div>
                    <div>Marca: ${item.carMovieBrand || ''}</div>
                    <div class="actions">
                        <button onclick="editItem('${item.id}')">Editar</button>
                        <button onclick="deleteItem('${item.id}')">Borrar</button>
                    </div>
                `;
                list.appendChild(div);
            });
        });
}

document.getElementById('addForm').onsubmit = function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const year = document.getElementById('year').value;
    const director = document.getElementById('director').value;
    const brand = document.getElementById('brand').value;
    const body = {
        carMovieTitle: title,
        carMovieYear: year,
        carMovieDirector: director,
        carMovieBrand: brand
    };
    fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }).then(() => {
        fetchItems();
        document.getElementById('addForm').reset();
    });
};

window.editItem = function(id) {
    const newTitle = prompt('Nuevo título:');
    const newYear = prompt('Nuevo año:');
    const newDirector = prompt('Nuevo director:');
    const newBrand = prompt('Nueva marca:');
    if (newTitle && newYear) {
        fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                carMovieTitle: newTitle,
                carMovieYear: newYear,
                carMovieDirector: newDirector,
                carMovieBrand: newBrand
            })
        }).then(() => fetchItems());
    }
};

window.deleteItem = function(id) {
    if (confirm('¿Seguro que deseas borrar este elemento?')) {
        fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
            .then(() => fetchItems());
    }
};

fetchItems();
