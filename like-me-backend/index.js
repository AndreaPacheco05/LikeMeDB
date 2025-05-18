const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool=new Pool({
  user:'postgres',          
  host:'localhost',
  database:'likeme',
  password:'0407AE',  
  port:5432,
});

app.get('/posts', async (req, res) => {
  try{
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  }catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ error: 'Error al obtener posts' });
  }
});

app.get('/', (req, res) => {
  res.send('Bienvenido a Like Me');
});

app.post('/posts', async (req, res) => {
  const{ titulo, img, descripcion } = req.body;
  try{
    const result = await pool.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *',
      [titulo, img, descripcion]
    );
    res.status(201).json(result.rows[0]);
  }catch(error) {
    console.error('Error al agregar post:', error);
    res.status(500).json({ error: 'Error al agregar post' });
  }
});

app.put('/posts/like/:id', async (req, res) => {
  const{id}=req.params;
  try{
    const result=await pool.query(
      'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch(error){
    console.error('Erorr al dar like:', error);
    res.status(500).json({ error: 'Error al dar like' });
  }
});

app.delete('/posts/:id', async (req, res) => {
  const{id}=req.params;
  try{
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.status(204).send(); // 204 = No Content
  }catch(error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ error: 'Error al eliminar post' });
  }
});

app.listen(3000, () => {
  console.log('Corrinedo en http://localhost:3000');
});