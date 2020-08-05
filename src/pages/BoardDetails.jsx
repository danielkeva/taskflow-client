import React, { useState, useEffect, useContext } from 'react'
import { BoardContext } from '../store/contexts/BoardContext'
import TaskList from '../components/task-cmps/TaskList'

const BoardDetails = () => {
    const { loadBoard, updateTaskList, board } = useContext(BoardContext)

    useEffect(() => {
        const getBoard = async () => {
            loadBoard()
        }
        getBoard()
    }, [])

    const updateList = (taskList) => {
        updateTaskList(taskList)
    }
    return (
        <section className="board-details">
            {board ? (
                <div className="list-container">
                    <div>
                        {board.taskLists.map(taskList => (
                            <TaskList key={taskList.id} taskList={taskList} onListUpdated={updateList} />
                        ))}
                    </div>
                </div>) : (<p>asd</p>)}
        </section >
    )
}

export default BoardDetails
