import React from 'react'
import { NavLink } from 'react-router-dom'
import LabelList from './task-actions/LabelList'
import Moment from 'react-moment';

const TaskPreview = ({ task }) => {
    const calendarStrings = {
        lastDay: '[Yesterday ] ',
        sameDay: '[Today ] ',
        nextDay: '[Tomorrow ] ',
        lastWeek: 'DD/MM/YYYY',
        nextWeek: 'DD/MM/YYYY',
        sameElse: 'DD/MM/YYYY'
    };
    return (
        <div className="task-preview">
            <NavLink to={`/board/${task.id}`} className="task-link" exact activeClassName="active" draggable="false">
                {task.labels && <LabelList labels={task.labels} />}
                <div>{task.title}</div>
                {task.dueDate && <Moment calendar={calendarStrings} date={task.dueDate} />}
            </NavLink>
        </div>
    )
}
export default TaskPreview
