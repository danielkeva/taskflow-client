import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import LabelList from './task-actions/LabelList'
import Moment from 'react-moment';
import { useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TaskPreview = ({ task, index }) => {
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

        <Draggable draggableId={task.id} index={index}>

            {provided => (
                <div
                    className="task-preview"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>
                    <div className="task-preview-content">
                        <NavLink to={`${url}/${task.id}`} className="task-link" activeClassName="active" draggable="false">
                            {task.labels && <LabelList labels={task.labels} />}
                            <div className="task-preview-title">{task.title}</div>
                            {task.dueDate && <Moment calendar={calendarStrings} date={task.dueDate} />}
                        </NavLink>
                    </div>

                </div>

            )}




        </Draggable>
    )
}
export default TaskPreview
