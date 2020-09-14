import React, { useEffect, useState, useRef } from 'react'
import { BsThreeDots } from "react-icons/bs";
import { Droppable } from "react-beautiful-dnd";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// import 'simplebar/dist/simplebar.min.css';
import TaskPreview from './TaskPreview'
import TextEditor from '../TextEditor'
import ListMenu from './ListMenu';
import { boardService } from '../../services/board.service';
import useOnClickOutside from '../../hooks/useOnClickOutSide';
import { RiCloseLine, RiAddLine } from 'react-icons/ri';





const TaskList = ({ provided, innerRef, taskList, taskListIdx, onListUpdated, onRemoveList }) => {

    const [taskListCopy, setTaskListCopy] = useState({ ...taskList })
    const [newTask, setNewTask] = useState(null)
    const [isEditing, setIsEditing] = useState(false)




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
            <div
                className="list"
            >
                <div className="list-header"     {...provided.dragHandleProps}>
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



                <Droppable type="task" droppableId={`${taskListIdx}`}>
                    {provided => (
                        <div className="list-content u-fancy-scrollbar" {...provided.droppableProps} ref={provided.innerRef}>
                            {taskList.tasks.map((task, index) => (
                                <TaskPreview key={task.id} task={task} index={index} />
                            ))}
                            {provided.placeholder}
                            {(isEditing && newTask) && <div className="add-task-wrapper "  ref={wrapperRef}>
                                <TextEditor
                                    name="title"
                                    type="p"
                                    text={newTask.title}
                                    onChange={handleTaskChange}
                                    isFocused={isEditing}
                                    onSubmit={addTask}
                                />
                                <div className="add-task-controls">
                                    <button onClick={addTask} className="submit-btn">Add task</button>
                                    <button onClick={stopEditing} className="clear-btn icon-lg">
                                        <RiCloseLine />
                                    </button>
                                </div>
                            </div>}
                        </div>
                    )}
                </Droppable>
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

export default TaskList

{/* <div className="list-footer" ref={wrapperRef}>
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
                        <button onClick={stopEditing} className="clear-btn icon-lg">
                            <RiCloseLine />
                        </button>
                    </div>)
                }
            </div> */}


        //     (<div className="add-task-wrapper" title={taskList.id} ref={wrapperRef}>
        //     <TextEditor
        //         name="title"
        //         type="p"
        //         text={newTask.title}
        //         onChange={handleTaskChange}
        //         isFocused={isEditing}
        //         onSubmit={addTask}
        //     />
        //     <div className="add-task-controls">
        //         <button onClick={addTask} className="submit-btn">Add task</button>
        //         <button onClick={stopEditing} className="clear-btn icon-lg">
        //             <RiCloseLine />
        //         </button>
        //     </div>
        // </div>)