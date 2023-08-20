// components/Task.js
import React from 'react';

const Task = ({ task, onUpdate, onDelete }) => {
  return (
    <div className="task">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Completed: {task.completed.toString()}</p>
      <button onClick={() => onUpdate(task._id, { title: task.title, description: task.description, completed: !task.completed })}>
        {task.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
      </button>
      <button onClick={() => onDelete(task._id)}>Delete</button>
    </div>
  );
};

export default Task;
