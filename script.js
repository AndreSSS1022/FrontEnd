const API_BASE = 'https://carsmoviesinventoryproject-production.up.railway.app/api/v1/carsmovies';

// Leer y mostrar todos los registros
async function fetchItems() {
    const res = await fetch(`${API_BASE}?page=0&size=10&sort=carMovieYear,desc`);
    const data = await res.json();
    const items = data.content || [];
    const list = document.getElementById('items-list');
    list.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <strong>${item.carMovieTitle} (${item.carMovieYear})</strong><br>
            Director: ${item.carMovieDirector || ''} <br>
            Marca: ${item.carMovieBrand || ''} <br>
            <div class="actions">
                <button onclick="showEditForm('${item.id}', '${item.carMovieTitle}', '${item.carMovieYear}', '${item.carMovieDirector || ''}', '${item.carMovieBrand || ''}')">Editar</button>
                <button onclick="deleteItem('${item.id}')">Borrar</button>
            </div>
            <div id="edit-form-${item.id}" style="display:none; margin-top:1rem;"></div>
        `;
        list.appendChild(div);
    });
}

// Crear nuevo registro
document.getElementById('addForm').onsubmit = async function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const year = document.getElementById('year').value;
    const director = document.getElementById('director').value;
    const brand = document.getElementById('brand').value;
    await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            carMovieTitle: title,
            carMovieYear: year,
            carMovieDirector: director,
            carMovieBrand: brand
        })
    });
    document.getElementById('addForm').reset();
    fetchItems();
};

// Mostrar formulario de edición
window.showEditForm = function(id, title, year, director, brand) {
    const formDiv = document.getElementById(`edit-form-${id}`);
    formDiv.style.display = 'block';
    formDiv.innerHTML = `
        <form onsubmit="updateItem(event, '${id}')">
            <label>Título: <input type="text" id="edit-title-${id}" value="${title}" required></label>
            <label>Año: <input type="number" id="edit-year-${id}" value="${year}" required></label>
            <label>Director: <input type="text" id="edit-director-${id}" value="${director}"></label>
            <label>Marca: <input type="text" id="edit-brand-${id}" value="${brand}"></label>
            <button type="submit">Guardar</button>
            <button type="button" onclick="hideEditForm('${id}')">Cancelar</button>
        </form>
    `;
};

window.hideEditForm = function(id) {
    document.getElementById(`edit-form-${id}`).style.display = 'none';
};

// Actualizar registro
window.updateItem = async function(e, id) {
    e.preventDefault();
    const title = document.getElementById(`edit-title-${id}`).value;
    const year = document.getElementById(`edit-year-${id}`).value;
    const director = document.getElementById(`edit-director-${id}`).value;
    const brand = document.getElementById(`edit-brand-${id}`).value;
    await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            carMovieTitle: title,
            carMovieYear: year,
            carMovieDirector: director,
            carMovieBrand: brand
        })
    });
    hideEditForm(id);
    fetchItems();
};

// Borrar registro
window.deleteItem = async function(id) {
    if (confirm('¿Seguro que deseas borrar este elemento?')) {
        await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        fetchItems();
    }
};

fetchItems();
