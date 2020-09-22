import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadBoards } from '../store/actions/boardActions'

const BoardsPage = () => {
    // const { loadBoards, boards } = useContext(BoardContext)
    const boards = useSelector(state => state.board.boards);
    const dispatch = useDispatch();

    useEffect(() => {
        const getBoards = async () => {
            await dispatch(loadBoards())
            console.log('adsasd')
        }
        getBoards()
    }, [])

    return (
        <div>
            <h1>Boards new</h1>
            {boards && boards.length && boards.map(board => (
                <div key={board._id}>
                    <NavLink to={`board/${board._id}`}>{board._id}</NavLink>
                </div>
            ))}
        </div>
    )
}



export default BoardsPage
// export default connect(mapStateToProps, mapDispatchToProps)(BoardsPage);
