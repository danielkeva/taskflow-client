import React from 'react'

const TaskPreview = ({ task }) => {
    return (
        <div className="task-preview">
            {task.title}
        </div>
    )
}

export default TaskPreview
