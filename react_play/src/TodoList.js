import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });

  useEffect(() => {
    // Fetch todos from the API
    axios.get('http://localhost:3000/todos')
      .then((response) => {
        setTodos(response.data.todos);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
        setLoading(false);
      });
  }, []);

   // Define the fetchTodos function to fetch and update the list of todos
   const fetchTodos = () => {
    axios.get('http://localhost:3000/todos')
      .then((response) => {
        setTodos(response.data.todos);
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
      });
  };

  const handleInsertTodo = () => {
    // Create a new todo object from the state
    const newTodoData = {
      title: newTodo.title,
      description: newTodo.description,
    };
  
    // Send a POST request to your server
    axios
      .post('http://localhost:3000/todos', newTodoData)
      .then((response) => {
        // Handle success, e.g., close the modal and update the todos
        setIsModalOpen(false);
        setNewTodo({ title: '', description: '' });
        // Optionally, you can reload the updated list of todos
        fetchTodos(); // Define this function to fetch todos and update state
      })
      .catch((error) => {
        console.error('Error inserting todo:', error);
        // Handle the error, e.g., show an error message to the user
      });
  };
  

  return (
    <div>
      <h2>Todos</h2>
      <Button variant="contained" onClick={() => setIsModalOpen(true)}>Add Todo</Button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todos.map((todo) => (
                <TableRow key={todo.id}>
                  <TableCell>{todo.id}</TableCell>
                  <TableCell>{todo.title}</TableCell>
                  <TableCell>{todo.description}</TableCell>
                  <TableCell>{new Date(todo.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(todo.updated_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Add Todo</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            fullWidth
          />
          <TextField
            label="Description"
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleInsertTodo}>Insert</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TodoList;
