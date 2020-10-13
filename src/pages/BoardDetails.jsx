import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { selectCurrBoard } from '../selectors/boardSelector'
import { getBoardById, saveBoard, setCurrBoard } from '../store/actions/boardActions'
import { Route, useRouteMatch, useParams, useHistory } from 'react-router-dom'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BsThreeDots } from "react-icons/bs";
import { utilService } from '../services/util.service'
import { socketService } from '../services/socket.service';


import TaskList from '../components/task-cmps/TaskList'
import TaskDetails from './TaskDetails'
import AddTaskList from '../components/task-cmps/AddTaskList'
import { RiCloseLine } from 'react-icons/ri';
import BoardMenu from '../components/board-menu-cmps/BoardMenu';
import { boardService } from '../services/board.service';
import { addActivity, loadActivities } from '../store/actions/activityActions';

const BoardDetails = () => {
    const { boardId } = useParams();
    let { path } = useRouteMatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const dispatch = useDispatch()
    const board = useSelector(state => state.board.currBoard)

    const initialRender = useRef(true)
    const menuBtnRef = useRef(null)

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const loadBoard = async () => {
            try {
                await dispatch(getBoardById(boardId))
                // setLoading(false);
            } catch (e) {
                // setLoading(false);
                history.push('/boards')
            }
        }
        loadBoard()
    }, [])

    useEffect(() => {
        if (initialRender.current && board) {
            dispatch(loadActivities(boardId))
            socketService.setup()
            socketService.emit('board topic', board._id)
            socketService.on('update board', updateCurrBoard);
            initialRender.current = false
        }

    }, [board])

    useEffect(() => {
        return () => {
            console.log('render1');
            socketService.off('update board', updateCurrBoard);
            socketService.terminate();  // clean up
        };
    }, [])

    const updateList = async (taskList, activity = null) => {
        const boardCopy = JSON.parse(JSON.stringify(board));
        const idx = boardCopy.taskLists.findIndex(currList => currList.id === taskList.id)
        boardCopy.taskLists.splice(idx, 1, taskList)
        await updateBoard(boardCopy)
        if (activity) {
            dispatch(addActivity(activity))
        }
    }

    const updateBoard = useCallback((updatedBoard) => {
        dispatch(saveBoard(updatedBoard))
    }, [dispatch]);

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
        // Dropped outside the list

        const { source, destination } = result;

        if (!destination) {
            return;
        }
        if ((source.index === destination.index) &&
            (source.droppableId === destination.droppableId)) { // Check if  update is required
            return
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
                const res = utilService.move(tasklists[sIndex].tasks, tasklists[dIndex].tasks, source, destination);
                newState.taskLists[sIndex].tasks = res[sIndex];
                newState.taskLists[dIndex].tasks = res[dIndex];

                const { fromList, toList, task } = { fromList: tasklists[sIndex].title, toList: tasklists[dIndex].title, task: tasklists[sIndex].tasks[source.index] }
                const newActivity = boardService.newActivity(
                    `Moved this card from ${fromList} to ${toList}`,
                    `Moved [${task.title}](${url}/${task.id}) from ${fromList} to ${toList}`,
                    task.id
                )
                dispatch(addActivity(newActivity))
            }
        }
        updateBoard(newState)
    }

    const toggleMenu = () => {
        setIsMenuOpen(prevState => (!prevState));
    }

    if (!board) {
        return (<div style={{ paddingTop: '50px' }}>baba
        </div>)
    }

    else return (
        <section className="board-details" style={board.style.type === 'color' ? { backgroundColor: `${board.style.background}` } : { backgroundImage: `url(${board.style.background})` }}>
            <div className="board-header">
                <button>CLICK HERE</button>
                <button className="clear-btn open-menu-btn" onClick={toggleMenu} ref={menuBtnRef}>
                    <span className="icon-sm"><BsThreeDots /></span><span>Menu</span>
                </button>
            </div>
            <BoardMenu isMenuOpen={isMenuOpen} closeMenu={toggleMenu} menuBtnRef={menuBtnRef} board={board} onBoardUpdated={updateBoard} />
            {
                board &&
                <DragDropContext
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

                                <AddTaskList board={board} onBoardUpdated={updateBoard} />
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            }
            { board && <Route exact path={`${path}/:taskId`} component={TaskDetails} />}
        </section >
    )
}

export default BoardDetails




