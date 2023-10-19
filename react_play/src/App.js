import React from 'react';
import './App.css';
import TodoList from './TodoList'; // Import the TodoList component


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TodoList /> {/* Render the TodoList component here */}
      </header>
    </div>
  );
}

export default App;
