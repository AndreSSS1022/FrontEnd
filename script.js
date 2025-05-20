const API_BASE = 'http://127.0.0.1:8080/api/v1/feid';

async function fetchItems() {
    const res = await fetch(`${API_BASE}?page=0&size=10&sort=carMovieYear,desc`);
    const data = await res.json();
    const items = data.Movies || [];
    const list = document.getElementById('items-list');
    list.innerHTML = '';
    if (items.length === 0) {
        list.innerHTML = '<div class="alert alert-info">No hay registros.</div>';
        return;
    }
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${item.carMovieName} <span class="badge bg-secondary">${item.carMovieYear}</span></h5>
                <p class="card-text mb-1"><strong>Duración:</strong> ${item.duration || '-'} min</p>
                <button class="btn btn-primary btn-sm me-2" onclick="showEditForm('${item.id}', '${item.carMovieName}', '${item.carMovieYear}', '${item.duration || ''}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteItem('${item.id}')">Borrar</button>
                <div id="edit-form-${item.id}" style="display:none; margin-top:1rem;"></div>
            </div>
        `;
        list.appendChild(div);
    });
}

document.getElementById('addForm').onsubmit = async function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const year = document.getElementById('year').value;
    const director = document.getElementById('director').value; // Si tu API lo usa
    const brand = document.getElementById('brand').value; // Si tu API lo usa
    const duration = 120; // Puedes poner un valor por defecto o agregar un campo en el formulario

    await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            carMovieName: title,
            carMovieYear: year,
            duration: duration
        })
    });
    document.getElementById('addForm').reset();
    fetchItems();
};

window.showEditForm = function(id, title, year, duration) {
    const formDiv = document.getElementById(`edit-form-${id}`);
    formDiv.style.display = 'block';
    formDiv.innerHTML = `
        <form onsubmit="updateItem(event, '${id}')">
            <div class="row g-2">
                <div class="col-md-4">
                    <input type="text" class="form-control" id="edit-title-${id}" value="${title}" required>
                </div>
                <div class="col-md-3">
                    <input type="number" class="form-control" id="edit-year-${id}" value="${year}" required>
                </div>
                <div class="col-md-3">
                    <input type="number" class="form-control" id="edit-duration-${id}" value="${duration}">
                </div>
                <div class="col-md-1">
                    <button type="submit" class="btn btn-success btn-sm w-100">Guardar</button>
                </div>
                <div class="col-md-1">
                    <button type="button" class="btn btn-secondary btn-sm w-100" onclick="hideEditForm('${id}')">Cancelar</button>
                </div>
            </div>
        </form>
    `;
};

window.hideEditForm = function(id) {
    document.getElementById(`edit-form-${id}`).style.display = 'none';
};

window.updateItem = async function(e, id) {
    e.preventDefault();
    const title = document.getElementById(`edit-title-${id}`).value;
    const year = document.getElementById(`edit-year-${id}`).value;
    const duration = document.getElementById(`edit-duration-${id}`).value;
    await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            carMovieName: title,
            carMovieYear: year,
            duration: duration
        })
    });
    hideEditForm(id);
    fetchItems();
};

window.deleteItem = async function(id) {
    if (confirm('¿Seguro que deseas borrar este elemento?')) {
        await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        fetchItems();
    }
};

fetchItems();
