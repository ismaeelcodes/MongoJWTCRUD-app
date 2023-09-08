// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import TaskList from './TaskList';

function App() {
  const user_id = localStorage.getItem("id")
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ user_id, title: '', description: '', completed: false });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:5000/api/tasks/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        'http://localhost:5000/api/tasks/',
        newTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', completed: false });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (taskId, updatedData) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="Home">
      <h1 className='taskHeading'>Order of Agendas</h1>
      <div className='taskCreateDiv'>
        <h2>Create New Task</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={e =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <button onClick={createTask}>Create</button>
      </div>
      <div className='allTasks'>
        <h2 className='allTasksHeading'>Your Tasks</h2>
        <TaskList
          tasks={tasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}

export default App;
