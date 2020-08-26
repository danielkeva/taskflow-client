import React, { useEffect, useContext } from 'react'
import { BoardContext } from '../store/contexts/BoardContext'
import { Route, useRouteMatch } from 'react-router-dom'

import TaskList from '../components/task-cmps/TaskList'
import TaskDetails from './TaskDetails'
import AddTaskList from '../components/task-cmps/AddTaskList'

import { Container, Draggable } from 'react-smooth-dnd';
import { utilService } from '../services/util.service'

const BoardDetails = () => {
    const { loadBoard, updateTaskList, removeTaskList, board, saveBoard } = useContext(BoardContext)
    let { path } = useRouteMatch();

    useEffect(() => {
        const getBoard = async () => {
            loadBoard()
        }
        getBoard()
    }, [])

    const updateList = (taskList) => {
        updateTaskList(taskList)
    }
    const removeList = (taskListId) => {
        removeTaskList(taskListId)
    }
    const handleDrop = (dropResult) => {
        console.log(
'why like this'
        );
        const boardCopy = JSON.parse(JSON.stringify(board));
        boardCopy.taskLists = utilService.applyDrag(boardCopy.taskLists, dropResult)
        saveBoard(boardCopy)
    }
    return (
        <section className="board-details">
            <h1>board details</h1>
            {board ?
                <Container
                    orientation="horizontal"
                    dragHandleSelector=".list-header"
                    onDrop={handleDrop}
                    render={(ref) => {
                        return (
                            <div className="list-container" ref={ref}>
                                {board.taskLists.map(taskList => (
                                    <Draggable key={taskList.id}>
                                        <TaskList key={taskList.id} board={board} taskList={taskList} onRemoveList={removeList} onListUpdated={updateList} />
                                    </Draggable>
                                ))}
                                <AddTaskList onBoardUpdated={saveBoard} board={board} />
                            </div>
                        )
                    }}
                />
                : (<p>asd</p>)}
            <Route path={`${path}/:taskId`} component={TaskDetails} />
        </section >
    )
}

export default BoardDetails
