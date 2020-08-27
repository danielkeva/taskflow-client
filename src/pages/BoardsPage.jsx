import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom';
import { BoardContext } from '../store/contexts/BoardContext'
import { useEffect } from 'react'
const BoardsPage = () => {
    const { loadBoards, boards } = useContext(BoardContext)
    useEffect(() => {
        const getBoards = async () => {
            await loadBoards()
        }
        getBoards()
    }, [])
    return (
        <div>
            <h1>Boards</h1>
            {boards && boards.length && boards.map(board => (
                <div key={board._id}>
                    <NavLink  to={`board/${board._id}`}>{board._id}</NavLink>
                </div>
            ))}
        </div>
    )
}

export default BoardsPage
