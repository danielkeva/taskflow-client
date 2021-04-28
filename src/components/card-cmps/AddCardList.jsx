import React, { useState, useRef } from 'react'
import useOnClickOutside from '../../hooks/useOnClickOutSide'

import { boardService } from '../../services/board.service'

import { RiCloseLine } from 'react-icons/ri'
import TextEditor from '../TextEditor'


const AddCardList = ({ board, onBoardUpdated }) => {
    const [newCardList, setCardList] = useState(null)
    const wrapperRef = useRef(null)

    const getEmptyCardList = () => {
        const emptyCardList = boardService.getEmptyList()
        setCardList(emptyCardList)
    }
    const handleChange = (ev) => {
        setCardList({ ...newCardList, [ev.target.name]: ev.target.value })
    }

    const addCardList = () => {
        if (!newCardList.title) return
        const boardCopy = JSON.parse(JSON.stringify(board));
        boardCopy.cardLists.push(newCardList);
        onBoardUpdated(boardCopy)
        setCardList(null)
    }

    useOnClickOutside(wrapperRef, () => {
        setCardList(null)
    });

    return (
        <div className="list-wrapper ">
            {newCardList ?
                <div className="list add-list" ref={wrapperRef}>
                    <TextEditor
                        isFocused={true}
                        onChange={handleChange}
                        onSubmit={addCardList}
                        name="title"
                        type="p"
                    />
                    <div className="add-list-controls">
                        <button className="success-btn" onClick={addCardList}>Add List</button>
                        <button onClick={() => setCardList(null)} className="clear-btn icon-lg">
                            <RiCloseLine />
                        </button>
                    </div>
                </div>
                :
                <button className="modal-btn" onClick={getEmptyCardList}>Add another list </button>
            }
        </div>
    )
}

export default AddCardList
