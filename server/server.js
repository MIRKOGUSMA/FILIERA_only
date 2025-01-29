import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, { production: [] });

const app = express();
app.use(cors());
app.use(express.json());

// GET tutti i dati
app.get('/api/production', async (req, res) => {
  await db.read();
  res.json(db.data.production);
});

// POST nuova riga
app.post('/api/production', async (req, res) => {
  await db.read();
  const newEntry = {
    id: Date.now().toString(),
    ...req.body
  };
  db.data.production.push(newEntry);
  await db.write();
  res.json(newEntry);
});

// PUT aggiorna riga
app.put('/api/production/:id', async (req, res) => {
  await db.read();
  const { id } = req.params;
  const index = db.data.production.findIndex(entry => entry.id === id);
  
  if (index !== -1) {
    db.data.production[index] = { ...db.data.production[index], ...req.body };
    await db.write();
    res.json(db.data.production[index]);
  } else {
    res.status(404).json({ error: 'Entry not found' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});