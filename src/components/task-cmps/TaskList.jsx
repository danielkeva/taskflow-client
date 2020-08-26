import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Container, Draggable } from 'react-smooth-dnd';
import { BsThreeDots } from "react-icons/bs";

import TaskPreview from './TaskPreview'
import TextEditor from '../TextEditor'
import ListMenu from './ListMenu';
import { boardService } from '../../services/board.service';
import { utilService } from '../../services/util.service';
import useOnClickOutside from '../../hooks/useOnClickOutSide';
import { useMemo } from 'react';

const TaskList = ({ board, taskList, onListUpdated, onRemoveList }) => {
    const [taskListCopy, setTaskListCopy] = useState({ ...taskList })
    const [newTask, setNewTask] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const wrapperRef = useRef(null)
    const initialRender = useRef(true)

    useEffect(() => {
        const setTask = () => {
            setTaskListCopy({ ...taskList })
        }
        setTask()
    }, [taskList])

    const getEmptyTask = () => {
        console.log('task list getEmptytask');
        setIsMenuOpen(false)
        const emptyTask = boardService.getEmptyTask()
        setNewTask(emptyTask)
        setIsEditing(true)
    }

    const handleListChange = (ev) => {
        setTaskListCopy({ ...taskListCopy, [ev.target.name]: ev.target.value })
    }

    const handleTaskChange = (ev) => {
        setNewTask({ ...newTask, [ev.target.name]: ev.target.value })

    }
    const handleListRemove = () => {
        onRemoveList(taskList.id)
    }
    const updateList = (updatedTaskList) => {
        if (updatedTaskList) {
            onListUpdated(updatedTaskList)
        } else {
            onListUpdated(taskListCopy)
        }
        setIsEditing(false)
        setNewTask(null)
    }
    const addTask = () => {
        if (newTask && newTask.title) {
            const updatedTaskList = JSON.parse(JSON.stringify(taskListCopy));
            updatedTaskList.tasks.push(newTask)
            updateList(updatedTaskList)
        }
        setIsEditing(false)
        setNewTask(null)
    }



    useOnClickOutside(wrapperRef, () => {
        if (isEditing) {
            console.log('outside');
            addTask()
        }
    });
    // useEffect(() => {
    //     if (!initialRender.current && !isEditing) {
    //         console.log('task list useEffect');
    //         updateList()
    //     } else {
    //         initialRender.current = false
    //     }
    // }, [taskListCopy.tasks.length])

    const handleDrop = (dropResult) => {
        const updatedTaskList = JSON.parse(JSON.stringify(taskListCopy));
        updatedTaskList.tasks = utilService.applyDrag(updatedTaskList.tasks, dropResult)
        if (
            (dropResult.removedIndex !== null && dropResult.removedIndex !== null) ||
            (dropResult.addedIndex >= 0 && dropResult.addedIndex !== null)
        ) {
            onListUpdated(updatedTaskList)
        }
    }
    const getTaskPayload = (index) => {
        return board.taskLists.filter(askList => askList.id === taskList.id)[0].tasks[index];
    }
    return (
        taskListCopy &&
        <div className="list-wrapper">
            <div className="list-header">
                {taskListCopy.title &&
                    <TextEditor
                        name="title"
                        type="h3"
                        text={taskListCopy.title}
                        onChange={handleListChange}
                        onInputBlur={updateList}
                    />}

                <button className="list-menu-btn clear-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>

                    <BsThreeDots />
                </button>
                {isMenuOpen && !isEditing &&
                    <ListMenu onRemoveList={handleListRemove} onAddTask={getEmptyTask} onCloseMenu={() => setIsMenuOpen(false)} />}
            </div>
            <div className="list-content">

                <Container
                    groupName="tasks"
                    onDrop={handleDrop}
                    getChildPayload={index => getTaskPayload(index)}
                >

                    {taskListCopy.tasks.map(task => (
                        <Draggable key={task.id}>
                            <TaskPreview task={task} />
                        </Draggable>
                    ))}

                </Container>

            </div>
            <div className="list-footer" ref={wrapperRef}>
                {(!isEditing && !newTask) ?
                    <button className="clear-btn" onClick={getEmptyTask}>add new task</button> :
                    (<div ref={wrapperRef}>
                        <TextEditor
                            name="title"
                            type="p"
                            text={newTask.title}
                            onChange={handleTaskChange}
                            isFocused={isEditing}
                            onSubmit={addTask}
                        />
                        <button onClick={addTask} className="submit-btn">Add task</button>
                    </div>)
                }
            </div>
        </div >

    )
}

export default TaskList
