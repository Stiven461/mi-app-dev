const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API de Agenda de Contactos funcionando' });
});

// Obtener todos los contactos
app.get('/api/contacts', (req, res) => {
  db.all('SELECT * FROM contacts ORDER BY name ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Buscar contacto
app.get('/api/contacts/search', (req, res) => {
  const { q } = req.query;
  db.all(
    'SELECT * FROM contacts WHERE name LIKE ? OR phone LIKE ? OR email LIKE ? ORDER BY name ASC',
    [`%${q}%`, `%${q}%`, `%${q}%`],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Crear contacto
app.post('/api/contacts', (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  db.run(
    'INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)',
    [name, phone, email || null],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, phone, email });
    }
  );
});

// Actualizar contacto
app.put('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, email } = req.body;

  db.run(
    'UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?',
    [name, phone, email, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Contact updated' });
    }
  );
});

// Eliminar contacto
app.delete('/api/contacts/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM contacts WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Contact deleted' });
  });
});

app.listen(PORT, () => {
  console.log(`📒 Agenda API running on http://localhost:${PORT}`);
});
