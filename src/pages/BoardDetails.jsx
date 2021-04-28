import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { getBoardById, saveBoard, setCurrBoard } from '../store/actions/boardActions'
import { Route, useRouteMatch, useParams, useHistory } from 'react-router-dom'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BsThreeDots } from "react-icons/bs";
import { utilService } from '../services/util.service'
import { socketService } from '../services/socket.service';


import CardList from '../components/card-cmps/CardList'
import CardDetails from './CardDetails'
import AddCardList from '../components/card-cmps/AddCardList'
import { RiCloseLine } from 'react-icons/ri';
import BoardMenu from '../components/board-menu-cmps/BoardMenu';
import { boardService } from '../services/board.service';
import { addActivity, loadActivities } from '../store/actions/activityActions';
import Spinner from '../components/Spinner';
import { hideError } from '../store/actions/errorActions';

const BoardDetails = () => {
    const { boardId } = useParams();
    let { path } = useRouteMatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const dispatch = useDispatch()
    const board = useSelector(state => state.board.currBoard)
    const isLoading = useSelector(state => state.general.isLoading)

    const initialRender = useRef(true)
    const menuBtnRef = useRef(null)

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useLayoutEffect(() => {
        const loadBoard = async () => {
            await dispatch(getBoardById(boardId))
        }
        if (!board || (board._id !== boardId)) {
            loadBoard()
        }
    }, [dispatch, boardId])

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
            socketService.off('update board', updateCurrBoard);
            // socketService.terminate();  // clean up
            // dispatch(hideError())
            // setLoading(false);
        };
    }, [])

    const updateList = async (cardList, activity = null) => {
        const boardCopy = JSON.parse(JSON.stringify(board));
        const idx = boardCopy.cardLists.findIndex(currList => currList.id === cardList.id)
        boardCopy.cardLists.splice(idx, 1, cardList)
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

    const removeList = (cardListId) => {
        const boardCopy = JSON.parse(JSON.stringify(board));
        const idx = boardCopy.cardLists.findIndex(currList => currList.id === cardListId)
        boardCopy.cardLists.splice(idx, 1)
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

        let cardlists = [...board.cardLists];
        const newState = JSON.parse(JSON.stringify(board));

        if ((source.droppableId === destination.droppableId) && source.droppableId === 'board') {
            const items = utilService.reorder(cardlists, source.index, destination.index);
            newState.cardLists = items;
        } else {
            const sIndex = +source.droppableId;
            const dIndex = +destination.droppableId;
            if (sIndex === dIndex) {
                const items = utilService.reorder(cardlists[sIndex].cards, source.index, destination.index);
                newState.cardLists[sIndex].cards = items;
            }
            else {
                const res = utilService.move(cardlists[sIndex].cards, cardlists[dIndex].cards, source, destination);
                newState.cardLists[sIndex].cards = res[sIndex];
                newState.cardLists[dIndex].cards = res[dIndex];

                const { fromList, toList, card } = { fromList: cardlists[sIndex].title, toList: cardlists[dIndex].title, card: cardlists[sIndex].cards[source.index] }
                const newActivity = boardService.newActivity(
                    `Moved this card from ${fromList} to ${toList}`,
                    `Moved [${card.title}](${url}/${card.id}) from ${fromList} to ${toList}`,
                    card.id
                )
                dispatch(addActivity(newActivity))
            }
        }
        updateBoard(newState)
    }

    const toggleMenu = () => {
        setIsMenuOpen(prevState => (!prevState));
    }
    if (!board || isLoading) {
        return (
            <Spinner />
        )
    } else return (
        <section className="board-details" style={board.style.type === 'color' ? { backgroundColor: `${board.style.background}` } : { backgroundImage: `url(${board.style.background})` }}>
            <div className="board-header">
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
                                {board.cardLists && board.cardLists.map((cardList, index) => (
                                    <Draggable key={cardList.id} draggableId={cardList.id} index={index} type="lists">
                                        {(provided, snapshot) => (

                                            <CardList
                                                cardListIdx={index}
                                                cardList={cardList}
                                                onRemoveList={removeList}
                                                onListUpdated={updateList}
                                                innerRef={provided.innerRef}
                                                provided={provided}
                                            />
                                        )}

                                    </Draggable>
                                ))}
                                {provided.placeholder}

                                <AddCardList board={board} onBoardUpdated={updateBoard} />
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            }
            { board && <Route exact path={`${path}/:cardId`} component={CardDetails} />}
        </section >
    )
}

export default BoardDetails




