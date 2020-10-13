import React, { useMemo } from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import LabelList from './task-actions/LabelList'
import Moment from 'react-moment';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components'
import { createSelector } from 'reselect'
import { IoMdCheckboxOutline } from "react-icons/io";
import { GrTextAlignFull } from "react-icons/gr";
import { RiTimeLine } from "react-icons/ri";


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
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    sameElse: 'MMMM D'
};

const TaskPreview = ({ task, index }) => {
    let { url } = useRouteMatch();

    const doneCount = useMemo(
        () =>
            task.checklists.reduce((totalCount, checklist) => {
                if (checklist.listItems.length > 0) {
                    let checklistSum = checklist.listItems.reduce((acc, item) => {
                        if (item.isDone) acc++
                        return acc
                    }, 0)
                    totalCount += checklistSum
                }
                return totalCount
            }, 0),
        [task.checklists]
    );
    const checklistItemsAmount = useMemo(
        () =>
            task.checklists.reduce((acc, checklist) => {
                if (checklist.listItems.length > 0) {
                    acc += checklist.listItems.length
                }
                return acc
            }, 0),
        [task.checklists]
    );

    const isDue = useMemo(() => {
        if (!task.dueDate) return;
        // console.log('is due')
        let date = new Date()
        date.setHours(0, 0, 0, 0)
        date.setDate(date.getDate() + 1)
        if (date.getTime() === task.dueDate) {
            return 'due-soon'
        } else if (task.dueDate <= Date.now()) {
            return 'over-due'
        } else return ''
        // }
    }, [task.dueDate]);

    return (

        <Draggable draggableId={task.id} index={index} type="task">

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

                                {task.labels && <LabelList labels={task.labels} />}
                                <div className='task-preview-title' dir='auto'>{task.title}</div>
                                <div className='badges'>
                                    {task.dueDate &&
                                        <div className={'badge ' + isDue}>
                                            <RiTimeLine className="icon-sm" />
                                            <Moment className='badge-text' calendar={calendarStrings} date={task.dueDate} />
                                        </div>
                                    }
                                    {task.description &&
                                        <div className="badge">
                                            <GrTextAlignFull className="icon-md" />
                                        </div>
                                    }
                                    {task.checklists.length > 0 && checklistItemsAmount > 0 &&
                                        <div className={'badge checklist-items-badge ' + (doneCount === checklistItemsAmount ? 'task-complete' : '')}>

                                            <IoMdCheckboxOutline className="icon-sm" />
                                            <span className='badge-text'>{doneCount}/{checklistItemsAmount}</span>
                                        </div>}

                                </div>

                            </div>
                        </Container>
                    </NavLink>

                </div>

            )}

        </Draggable>
    )
}
export default TaskPreview
