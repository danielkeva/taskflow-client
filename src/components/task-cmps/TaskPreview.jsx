import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import LabelList from './task-actions/LabelList'
import Moment from 'react-moment';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components'


const Container = styled.div`
    ${props => props.cover.isFull ?
        (props.cover.type === 'color' ?
            { backgroundColor: props.cover.isFull ? props.cover.background : '' } :
            { backgroundImage: 'url(' + props.cover.background + ')', minHeight: 235, backgroundSize: 'cover' }) : ''}
            font-size:${props => props.cover.isFull ? '16px' : ''};
            font-family:${props => props.cover.isFull ? 'LatoBold' : ''};

            ${props => props.cover.isFull ?
        {
            display: 'flex',
            fontSize: '16px',
            fontFamily: 'LatoBold'
        } :
        ''}
    `;


const calendarStrings = {
    lastDay: '[Yesterday ] ',
    sameDay: '[Today ] ',
    nextDay: '[Tomorrow ] ',
    lastWeek: 'DD/MM/YYYY',
    nextWeek: 'DD/MM/YYYY',
    sameElse: 'DD/MM/YYYY'
};


const TaskPreview = ({ task, index }) => {
    let { url } = useRouteMatch();

  

    return (

        <Draggable draggableId={task.id} index={index}>

            {provided => (
                <div
                    className='task-preview'
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>



                    <NavLink to={`${url}/${task.id}`} className='task-link' activeClassName='active' draggable='false'>
                        <Container cover={task.cover}>
                            {(task.cover.background && !task.cover.isFull) &&
                                <div>
                                    {task.cover.type === 'color' ?
                                        <div
                                            className={task.cover.background ? 'task-cover' : ''}
                                            style={{ backgroundColor: task.cover.background }}
                                        ></div> :
                                        <img src={task.cover.background} className='task-img-cover ratio-square ' />}
                                </div>}
                            <div className={`task-preview-content 
                                    ${(task.cover.type === 'img' && task.cover.isFull) ?
                                    (task.cover.theme === 'dark' ? 'content-wrapper dark' : 'content-wrapper light') : ''}`}>

                                {task.labels && <LabelList  labels={task.labels} />}
                                <div className='task-preview-title' dir='auto'>{task.title}</div>
                                {task.dueDate && <Moment calendar={calendarStrings} date={task.dueDate} />}
                            </div>
                        </Container>
                    </NavLink>

                </div>

            )}




        </Draggable>
    )
}
export default TaskPreview
