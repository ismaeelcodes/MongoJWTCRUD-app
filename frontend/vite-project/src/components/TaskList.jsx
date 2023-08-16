// components/TaskList.js
import React from 'react';
import Task from './Task';

const TaskList = ({ tasks }) => {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <Task key={task._id} task={task}  />
      ))}
    </div>
  );
};

export default TaskList;
