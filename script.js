const API_BASE = 'http://127.0.0.1:8080/api/v1/feid';

async function fetchItems() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Error al obtener datos');
    const items = await res.json();

    const list = document.getElementById('items-list');
    list.innerHTML = '';

    if (!items.length) {
      list.innerHTML = '<div class="alert">No hay registros.</div>';
      return;
    }

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'card item-card';

      div.innerHTML = `
        <div class="item-info">${item.name || 'Sin nombre'} - Año: ${item.year || '-'}</div>
        <div class="item-buttons">
          <button class="edit-btn" onclick="showEditForm('${item.id}', '${escapeHtml(item.name)}', '${item.year}')">Editar</button>
          <button class="delete-btn" onclick="deleteItem('${item.id}')">Borrar</button>
        </div>
        <div id="edit-form-${item.id}" class="edit-form" style="display:none;"></div>
      `;

      list.appendChild(div);
    });
  } catch (error) {
    alert('Error al cargar datos: ' + error.message);
  }
}

document.getElementById('addForm').onsubmit = async function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const year = document.getElementById('year').value.trim();

  if (!name || !year) return alert('Completa todos los campos');

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, year }),
    });
    if (!res.ok) throw new Error('Error al agregar registro');
    this.reset();
    fetchItems();
  } catch (error) {
    alert(error.message);
  }
};

function showEditForm(id, name, year) {
  const formDiv = document.getElementById(`edit-form-${id}`);
  formDiv.style.display = 'flex';
  formDiv.innerHTML = `
    <input type="text" id="edit-name-${id}" value="${name}" required />
    <input type="number" id="edit-year-${id}" value="${year}" required />
    <button class="save-btn" onclick="updateItem(event, '${id}')">Guardar</button>
    <button class="cancel-btn" onclick="hideEditForm('${id}')">Cancelar</button>
  `;
}

function hideEditForm(id) {
  const formDiv = document.getElementById(`edit-form-${id}`);
  formDiv.style.display = 'none';
  formDiv.innerHTML = '';
}

async function updateItem(e, id) {
  e.preventDefault();
  const name = document.getElementById(`edit-name-${id}`).value.trim();
  const year = document.getElementById(`edit-year-${id}`).value.trim();

  if (!name || !year) return alert('Completa todos los campos');

  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, year }),
    });
    if (!res.ok) throw new Error('Error al actualizar registro');
    hideEditForm(id);
    fetchItems();
  } catch (error) {
    alert(error.message);
  }
}

async function deleteItem(id) {
  if (!confirm('¿Seguro que deseas borrar este registro?')) return;
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al borrar registro');
    fetchItems();
  } catch (error) {
    alert(error.message);
  }
}

// Función para escapar caracteres especiales en HTML (para evitar inyección)
function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, function(m) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m];
  });
}

// Carga inicial
fetchItems();
