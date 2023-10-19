const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./db')

app.use(express.json());

// Configure CORS to allow requests from your React app (adjust the origin as needed)
app.use(cors({
    origin: 'http://localhost:3001', // Replace with the URL of your React app
    methods: 'GET,POST,PUT,DELETE',
    credentials: false, // Enable credentials (if needed)
}));

app.post('/todos', async (req, res) => {
    const { title, description } = req.body;

    try {
        const newTodo = await pool.query('INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *', [title, description]);

        res.json({
            result: true,
            todo: newTodo.rows[0],
            message: 'Successfully insert new todo'
        });
    } catch (err) {
        console.error('Error creating new todo : ', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.get('/todos', async (req, res) => {
    try {
        const todos = await pool.query('SELECT * FROM todos');
        res.json({
            result: true,
            todos: todos.rows,
            message: "Successfully fetching todos"
        });
    } catch (err) {
        console.error('Error fetching todos : ', err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.get('/todos/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
        const todo = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    
        if (todo.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Todo not found' 
            });
        }
  
        res.json(todo.rows[0]);
        res.json({
            result: true,
            todo: todo.rows[0],
            message: "Successfully fetching todos"
        });
    } catch (err) {
        console.error('Error fetching todo:', err);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

app.put('/todos/:id', async (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;

    try {
        const updatedTodo = await pool.query(
            'UPDATE todos SET title = $1, description = $2 WHERE id = $3 RETURNING *', [title, description, id]
        );

        if (updatedTodo.rows.length === 0) {
            return res.status(404).json({
                error: 'Todo not found'
            })
        }

        res.json({
            result: true,
            todo: updatedTodo.rows[0],
            message: "Successfully update todos"
        });
    } catch (err) {
        console.error('Error updating todo:', err);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Define a route to test the database connection
app.get('/testdb', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT $1::text as message', ['Hello, PostgreSQL!']);
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
