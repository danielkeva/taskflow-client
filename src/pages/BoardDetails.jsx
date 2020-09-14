import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getBoardById, saveBoard, setCurrBoard } from '../store/actions/boardActions'

import { Route, useRouteMatch, useParams, useHistory } from 'react-router-dom'


// import { Container, Draggable } from 'react-smooth-dnd';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { utilService } from '../services/util.service'


import TaskList from '../components/task-cmps/TaskList'
import TaskDetails from './TaskDetails'
import AddTaskList from '../components/task-cmps/AddTaskList'
import useAsyncAction from '../hooks/useAsyncAction';
import ActivityLog from '../components/ActivityLog';
import { socketService } from '../services/socket.service';
import { BsLockFill } from 'react-icons/bs';


// const { getBoardById, isLoading, updateTaskList, removeTaskList, board, saveBoard } = useContext(BoardContext)
const BoardDetails = () => {
    const dispatch = useDispatch()
    const board = useSelector(state => state.board.currBoard)
    const [loadBoard, loading, isError] = useAsyncAction(() => getBoardById(boardId));
    const initialRender = useRef(true)

    const queryAttr = "data-rbd-draggable-id";
    const [placeholderProps, setPlaceholderProps] = useState(null);

    const { boardId } = useParams();
    let { path } = useRouteMatch();
    let history = useHistory();

    useEffect(() => {
        loadBoard()
    }, [])

    useEffect(() => {
        if (initialRender.current && board) {
            console.log('board.', board._id);
            socketService.setup()
            socketService.emit('board topic', board._id)
            socketService.on('update board', updateCurrBoard);
            initialRender.current = false
        }

    }, [board])


    useEffect(() => {
        return () => {
            socketService.off('update board', updateCurrBoard);
            socketService.terminate();  // clean up
        };
    }, [])

    useEffect(() => {
        if (isError) {
            history.push('/boards')
        }
    }, [isError])


    const updateList = async (taskList) => {
        const boardCopy = JSON.parse(JSON.stringify(board));
        const idx = boardCopy.taskLists.findIndex(currList => currList.id === taskList.id)
        boardCopy.taskLists.splice(idx, 1, taskList)
        await dispatch(saveBoard(boardCopy))
        console.log('adterupdatelist');
        // dispatch(setCurrBoard(boardCopy))
    }

    const updateBoard = async (updatedBoard) => {
        await dispatch(saveBoard(updatedBoard))
    }


    const updateCurrBoard = (updatedBoard) => {
        dispatch(setCurrBoard(updatedBoard))
    }


    const removeList = (taskListId) => {
        const boardCopy = JSON.parse(JSON.stringify(board));
        const idx = boardCopy.taskLists.findIndex(currList => currList.id === taskListId)
        boardCopy.taskLists.splice(idx, 1)
        updateBoard(boardCopy)
    }

    const onDragEnd = (result) => {
        if ((result.source.index === result.destination.index) &&
            (result.source.droppableId === result.destination.droppableId)) { // Check if  update is required
            return
        }

        setPlaceholderProps(null);
        const { source, destination } = result;

        // Dropped outside the list
        if (!destination) {
            return;
        }

        let tasklists = [...board.taskLists];
        const newState = JSON.parse(JSON.stringify(board));

        if ((source.droppableId === destination.droppableId) && source.droppableId === 'board') {
            const items = utilService.reorder(tasklists, source.index, destination.index);
            newState.taskLists = items;
        } else {
            const sIndex = +source.droppableId;
            const dIndex = +destination.droppableId;
            if (sIndex === dIndex) {
                const items = utilService.reorder(tasklists[sIndex].tasks, source.index, destination.index);
                newState.taskLists[sIndex].tasks = items;
            }
            else {
                const result = utilService.move(tasklists[sIndex].tasks, tasklists[dIndex].tasks, source, destination);
                newState.taskLists[sIndex].tasks = result[sIndex];
                newState.taskLists[dIndex].tasks = result[dIndex];
            }
        }

        updateBoard(newState)
    }

    const handleDragStart = ev => {
        if (ev.type !== 'lists') {  //Only when dragging lists
            return
        }
        const draggedDOM = getDraggedDom(ev.draggableId);
        if (!draggedDOM) {
            return;
        }
        const { clientHeight, clientWidth } = draggedDOM.children[0];
        const sourceIndex = ev.source.index;
        var clientX =

            [...draggedDOM.parentNode.children]
                .slice(0, sourceIndex)
                .reduce((total, curr) => {
                    const style = curr.currentStyle || window.getComputedStyle(curr);
                    const marginLeft = parseFloat(style.marginLeft);
                    const marginRight = parseFloat(style.marginRight);
                    // console.log('right',marginRight,'left',marginLeft);
                    return total + curr.clientWidth + marginLeft + marginLeft;
                }, 0);

        setPlaceholderProps({
            clientHeight,
            clientWidth,
            clientX,
        });
    };

    const handleDragUpdate = ev => {
        if (ev.type !== 'lists') {  //Only when dragging lists
            return
        }
        if (!ev.destination) {
            return;
        }

        const draggedDOM = getDraggedDom(ev.draggableId);

        if (!draggedDOM) {
            return;
        }

        const { clientHeight, clientWidth } = draggedDOM.children[0];
        const destinationIndex = ev.destination.index;
        const sourceIndex = ev.source.index;
        const childrenArray = [...draggedDOM.parentNode.children];
        const movedItem = childrenArray[sourceIndex];
        childrenArray.splice(sourceIndex, 1);
        const updatedArray = [
            ...childrenArray.slice(0, destinationIndex),
            movedItem,
            ...childrenArray.slice(destinationIndex + 1)
        ];
        var clientX =
            updatedArray.slice(0, destinationIndex).reduce((total, curr) => {
                const style = curr.currentStyle || window.getComputedStyle(curr);
                const marginLeft = parseFloat(style.marginLeft);
                return total + curr.clientWidth + marginLeft + marginLeft;
            }, 0);

        setPlaceholderProps({
            clientHeight,
            clientWidth,
            clientX
        });
    };


    const getDraggedDom = draggableId => {
        const domQuery = `[${queryAttr}='${draggableId}']`;
        const draggedDOM = document.querySelector(domQuery);

        return draggedDOM;
    };

    if (loading) {
        return (<div>Loading...</div>)
    }
    else return (
        <section className="board-details">
            
                {/* <div className="board-header">
                    <button>button1</button>
                    <button>button2</button>
                    <button>button3</button>
                </div> */}
            {board && <DragDropContext
                onDragStart={handleDragStart}
                onDragUpdate={handleDragUpdate}
                onDragEnd={onDragEnd}>
                <Droppable droppableId="board" type="lists" direction='horizontal' >
                    {(provided, snapshot) => (
                        <div className="list-container" ref={provided.innerRef} {...provided.droppableProps}>
                            {board.taskLists && board.taskLists.map((taskList, index) => (
                                <Draggable key={taskList.id} draggableId={taskList.id} index={index} type="lists">
                                    {(provided, snapshot) => (
                                        <TaskList
                                            taskListIdx={index}
                                            taskList={taskList}
                                            onRemoveList={removeList}
                                            onListUpdated={updateList}
                                            innerRef={provided.innerRef}
                                            provided={provided}
                                        />
                                    )}

                                </Draggable>
                            ))}
                            {provided.placeholder}
                            {/* {placeholderProps && snapshot.isDraggingOver && (
                                <div
                                    className="placeholder"
                                    style={{
                                        left: placeholderProps.clientX,
                                        height: placeholderProps.clientHeight,
                                        width: placeholderProps.clientWidth,
                                    }}
                                />

                            )} */}
                            <AddTaskList board={board} onBoardUpdated={updateBoard} />
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            }




            {board && <Route exact path={`${path}/:taskId`} component={TaskDetails} />}
        </section >
    )
}

export default BoardDetails



