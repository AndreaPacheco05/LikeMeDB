const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',          
  host: 'localhost',
  database: 'likeme',
  password: '0407AE',  
  port: 5432,
});

app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ error: 'Error al obtener posts' });
  }
});

app.get('/', (req, res) => {
  res.send('Bienvenido a Like Me');
});

app.post('/posts', async (req, res) => {
  const { titulo, img, descripcion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *',
      [titulo, img, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar post:', error);
    res.status(500).json({ error: 'Error al agregar post' });
  }
});

app.listen(3000, () => {
  console.log('Corrinedo en http://localhost:3000');
});