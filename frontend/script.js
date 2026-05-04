const API_URL = 'http://localhost:3001/api/contacts';

let contacts = [];
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    document.getElementById('saveBtn').addEventListener('click', saveContact);
    document.getElementById('cancelBtn').addEventListener('click', cancelEdit);
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderContacts();
    });
    document.getElementById('clearSearchBtn').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        searchQuery = '';
        renderContacts();
    });
});

async function loadContacts() {
    try {
        const response = await fetch(API_URL);
        contacts = await response.json();
        renderContacts();
        updateStats();
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

async function saveContact() {
    const id = document.getElementById('editId').value;
    const name = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const email = document.getElementById('contactEmail').value.trim();

    if (!name || !phone) {
        alert('Nombre y teléfono son obligatorios');
        return;
    }

    const contact = { name, phone, email: email || null };

    try {
        let response;
        if (id) {
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact)
            });
        }

        if (response.ok) {
            clearForm();
            loadContacts();
        }
    } catch (error) {
        console.error('Error saving contact:', error);
    }
}

async function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    document.getElementById('editId').value = contact.id;
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactPhone').value = contact.phone;
    document.getElementById('contactEmail').value = contact.email || '';
    document.getElementById('saveBtn').textContent = '✏️ Actualizar Contacto';
    document.getElementById('cancelBtn').style.display = 'block';
}

async function deleteContact(id) {
    if (!confirm('¿Eliminar este contacto?')) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadContacts();
    } catch (error) {
        console.error('Error deleting contact:', error);
    }
}

function cancelEdit() {
    clearForm();
}

function clearForm() {
    document.getElementById('editId').value = '';
    document.getElementById('contactName').value = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('saveBtn').textContent = '💾 Guardar Contacto';
    document.getElementById('cancelBtn').style.display = 'none';
}

function renderContacts() {
    const contactsList = document.getElementById('contactsList');
    let filteredContacts = contacts;

    if (searchQuery) {
        filteredContacts = contacts.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery) ||
            (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }

    if (filteredContacts.length === 0) {
        contactsList.innerHTML = '<div style="text-align:center; padding:20px; color:#999;">No hay contactos</div>';
        return;
    }

    contactsList.innerHTML = filteredContacts.map(contact => `
        <li class="contact-item">
            <div class="contact-info">
                <div class="contact-name">${escapeHtml(contact.name)}</div>
                <div class="contact-phone">📞 ${escapeHtml(contact.phone)}</div>
                ${contact.email ? `<div class="contact-email">✉️ ${escapeHtml(contact.email)}</div>` : ''}
            </div>
            <div class="contact-actions">
                <button class="edit-btn" onclick="editContact(${contact.id})">✏️ Editar</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">🗑️ Eliminar</button>
            </div>
        </li>
    `).join('');
}

function updateStats() {
    document.getElementById('totalContacts').textContent = contacts.length;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.editContact = editContact;
window.deleteContact = deleteContact;
