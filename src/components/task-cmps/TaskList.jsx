import React, { useEffect, useState, useRef, memo } from 'react'
import { BsThreeDots } from "react-icons/bs";
import { Droppable } from "react-beautiful-dnd";

import TaskPreview from './TaskPreview'
import TextEditor from '../TextEditor'
import ListMenu from './ListMenu';
import { boardService } from '../../services/board.service';
import useOnClickOutside from '../../hooks/useOnClickOutSide';
import { RiCloseLine, RiAddLine } from 'react-icons/ri';
import { useRouteMatch } from 'react-router-dom';




const TaskList = ({ provided, innerRef, taskList, taskListIdx, onListUpdated, onRemoveList }) => {

    const [taskListCopy, setTaskListCopy] = useState({ ...taskList })
    const [newTask, setNewTask] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    let { url } = useRouteMatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const wrapperRef = useRef(null)

    useEffect(() => {
        setTaskListCopy({ ...taskList })
    }, [taskList])

    const getEmptyTask = () => {
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
    const updateList = (updatedTaskList, newActivity) => {
        if (updatedTaskList) {
            onListUpdated(updatedTaskList, newActivity)
        } else { // when task list title is edited
            if (taskListCopy.title === taskList.title) return;
            onListUpdated(taskListCopy) 
        }
        setIsEditing(false)
        setNewTask(null)
    }

    const addTask = async (clickSource = null) => {
        if (newTask && newTask.title) {
            const updatedTaskList = JSON.parse(JSON.stringify(taskListCopy));
            updatedTaskList.tasks.push(newTask)
            const newActivity = boardService.newActivity(
                `Added this card to ${updatedTaskList.title}`,
                `Added  [${newTask.title}](${url}/${newTask.id}) to ${updatedTaskList.title}`,
                newTask.id
            )
            await updateList(updatedTaskList, newActivity)
            if (clickSource === 'clickedOutside') return; // if click is outside the ref wrapper end editing
            setNewTask(null)
            getEmptyTask()
        }
    }

    useOnClickOutside(wrapperRef, () => {
        if (isEditing && newTask && newTask.title) {
            addTask('clickedOutside') // passing this string to add the current task and end the editing
        } else {
            stopEditing()
        }
    });
    const stopEditing = () => {
        setNewTask(null)
        setIsEditing(false)
    }



    return (
        taskListCopy &&
        <div className="list-wrapper"
            ref={innerRef}
            {...provided.draggableProps}
        >
            <div className="list">
                <div className="list-header" {...provided.dragHandleProps}>
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
                    {isMenuOpen && !isEditing && <ListMenu onRemoveList={handleListRemove} onAddTask={getEmptyTask} onCloseMenu={() => setIsMenuOpen(false)} />}
                </div>
                <div className="overs">
                    <Droppable type="task" droppableId={`${taskListIdx}`}>
                        {provided => (


                            <div className="list-content custom-scrollbar" ref={provided.innerRef} >
                                {taskList.tasks.map((task, index) => (
                                    <TaskPreview key={task.id} task={task} index={index} />
                                ))}
                                {(isEditing && newTask) && <div className="add-task-wrapper " ref={wrapperRef}>
                                    <TextEditor
                                        name="title"
                                        type="p"
                                        text={newTask.title}
                                        onChange={handleTaskChange}
                                        isFocused={isEditing}
                                        onSubmit={addTask}
                                        onEscape={stopEditing}
                                    />

                                    <div className="add-task-controls">
                                        <button onClick={addTask} className="submit-btn">Add task</button>
                                        <button onClick={stopEditing} className="clear-btn icon-lg">
                                            <RiCloseLine />
                                        </button>
                                    </div>

                                </div>}
                                {/* </div> */}
                                {provided.placeholder}

                            </div>
                        )}
                    </Droppable>
                </div>

                <div className="list-footer">
                    {(!isEditing && !newTask) &&
                        <a className="clear-btn list-footer-btn" onClick={getEmptyTask}  >
                            <span className="icon-lg add-icon"><RiAddLine /></span> <span>Add new task</span>
                        </a >
                    }
                </div>
            </div>
        </div >

    )
}

export default TaskList;
