// components/TaskList.js
import React from 'react';
import Task from './Task';

const TaskList = ({ tasks, onUpdate, onDelete }) => {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <Task key={task._id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TaskList;
