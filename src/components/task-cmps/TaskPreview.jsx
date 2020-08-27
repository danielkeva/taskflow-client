import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import LabelList from './task-actions/LabelList'
import Moment from 'react-moment';

const TaskPreview = ({ task }) => {
let { url } = useRouteMatch();

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
            <NavLink to={`${url}/${task.id}`} className="task-link"  activeClassName="active" draggable="false">
                {task.labels && <LabelList labels={task.labels} />}
                <div>{task.title}</div>
                {task.dueDate && <Moment calendar={calendarStrings} date={task.dueDate} />}
            </NavLink>
        </div>
    )
}
export default TaskPreview
