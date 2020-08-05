import React, { useEffect, useState } from 'react'

import { BsThreeDots } from "react-icons/bs";

import TaskPreview from './TaskPreview'
import TextEditor from '../TextEditor'
import ListMenu from './ListMenu';
import { boardService } from '../../services/board.service';

const TaskList = ({ taskList, onListUpdated }) => {
    const [taskListCopy, setTaskListCopy] = useState(null)
    const [newTask, setNewTask] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        setTaskListCopy(JSON.parse(JSON.stringify(taskList)))
    }, [taskList])

    const updateList = (text) => {
        if (newTask && text) {
            // setNewTask(prevState => ({ ...prevState }, prevState.title = text))
            setNewTask({ ...newTask }, newTask.title = text)
            console.log('dasd', newTask);
            setTaskListCopy({ ...taskListCopy, tasks: [...taskListCopy.tasks, newTask] })
        }
        else if (text) {
            setTaskListCopy({ ...taskListCopy }, taskListCopy.title = text)
        }
        setIsEditing(false)
        console.log('dhither');
        setNewTask(null)
        onListUpdated(taskListCopy)
    }

    const getEmptyTask = () => {
        setIsMenuOpen(false)
        const emptyTask = boardService.getEmptyTask()
        setNewTask(emptyTask)
        setIsEditing(true)
    }

    return (
        taskListCopy &&
        <div className="list-wrapper">
            <div className="list-header">
                {taskListCopy.title && <TextEditor type="h3" text={taskListCopy.title} onInputBlur={updateList} />}
                <button className="list-menu-btn clear-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <BsThreeDots />
                </button>
                {isMenuOpen && !isEditing && <ListMenu onCloseMenu={() => setIsMenuOpen(false)} />}
            </div>
            <div className="list-content">
                <div>
                    {taskListCopy.tasks.map(task => (
                        <TaskPreview key={task.id} task={task} />
                    ))}
                </div>
            </div>
            <div className="list-footer">
                {!isEditing && <button onClick={getEmptyTask}>add new task</button>}
                {isEditing && newTask && <TextEditor type="p" text={newTask.title} onInputBlur={updateList} isFocused={isEditing} />}
            </div>
        </div >

    )
}

export default TaskList
