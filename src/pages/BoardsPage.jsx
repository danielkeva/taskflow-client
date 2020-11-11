import React, { useEffect } from 'react'
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadBoards, addBoard } from '../store/actions/boardActions'
import ErrorNotification from '../components/ErrorNotification';
import { boardService } from '../services/board.service';
import { useState } from 'react';
import BoardList from '../components/board-cmps/BoardList';
import AddBoard from '../components/board-cmps/AddBoard';


const BoardsPage = () => {
    // const { loadBoards, boards } = useContext(BoardContext)
    const { userName } = useParams()
    const history = useHistory()
    const boards = useSelector(state => state.board.boards);
    const user = useSelector(state => state.user.loggedInUser);
    const dispatch = useDispatch();

    const [isEditing, setEditing] = useState(false)

    useEffect(() => {
        const getBoards = async () => {
            try {
                await dispatch(loadBoards()) // loads all the boards from the server with the userId from the MongoStore session
                if (!user || user.username !== userName) {
                    history.push(`/${user.username}/boards`)
                }
            } catch (err) {
                console.log('hi')
            }

        }
        getBoards()
    }, [])

    const handleToggle = () => {
        setEditing(true)
    }
    const closeModal = () => {
        console.log('yes')
        setEditing(false)
    }

    const addNewBoard = ({ title, privacy, style }) => {
        let newBoard = boardService.getEmptyBoard()
        newBoard.title = title
        newBoard.privacy = privacy
        newBoard.style = style
        newBoard.users.push(user._id)
        dispatch(addBoard(newBoard))
    }

    return (
        <div className="boards-page">
            <div className="boards">
                {boards && boards.length > 0 ?
                    <BoardList boards={boards} onToggleEdit={handleToggle} /> :
                    <div onClick={handleToggle}>Add new board</div>
                }
                {isEditing && <AddBoard onAddBoard={addNewBoard} onCloseModal={closeModal} onAddBoard={addNewBoard} />}
            </div>
        </div>
    )
}



export default BoardsPage
