import React, { useState, useRef } from 'react'
import useOnClickOutside from '../../hooks/useOnClickOutSide'

import { boardService } from '../../services/board.service'

import { RiCloseLine } from 'react-icons/ri'
import TextEditor from '../TextEditor'


const AddTaskList = ({ board, onBoardUpdated }) => {
    const [newTaskList, setTaskList] = useState(null)
    const wrapperRef = useRef(null)

    const getEmptyTaskList = () => {
        const emptyTaskList = boardService.getEmptyList()
        setTaskList(emptyTaskList)
    }
    const handleChange = (ev) => {
        setTaskList({ ...newTaskList, [ev.target.name]: ev.target.value })
    }

    const addTaskList = () => {
        if (!newTaskList.title) return
        const boardCopy = JSON.parse(JSON.stringify(board));
        boardCopy.taskLists.push(newTaskList);
        onBoardUpdated(boardCopy)
        setTaskList(null)
    }

    useOnClickOutside(wrapperRef, () => {
        setTaskList(null)
    });

    return (
        <div className="list-wrapper ">
            {newTaskList ?
                <div className="list add-list" ref={wrapperRef}>
                    <TextEditor
                        isFocused={true}
                        onChange={handleChange}
                        onSubmit={addTaskList}
                        name="title"
                        type="p"
                    />
                    <div className="add-list-controls">
                        <button className="submit-btn" onClick={addTaskList}>Add List</button>
                        <button onClick={() => setTaskList(null)} className="clear-btn icon-lg">
                            <RiCloseLine />
                        </button>
                    </div>
                </div>
                :
                <button className="modal-btn" onClick={getEmptyTaskList}>Add another list </button>
            }
        </div>
    )
}

export default AddTaskList
