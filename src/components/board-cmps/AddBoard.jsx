import React, { useRef } from 'react'
import { useState } from 'react'
import { RiCloseLine } from 'react-icons/ri'
import useOnClickOutside from '../../hooks/useOnClickOutSide'
import BoardPrivacy from './BoardPrivacy'
import NewBoardBg from './NewBoardBg'

const AddBoard = ({ onAddBoard, onCloseModal, }) => {
    const [boardPrefs, setBoardPrefs] = useState({ title: '', privacy: 'private', style: { background: '', type: 'color' } })
    const wrapperRef = useRef(null)

    useOnClickOutside(wrapperRef, () => {
        onCloseModal()
    });
    const handleChange = (ev) => {
        let { name, value } = ev.target;
        setBoardPrefs({ ...boardPrefs, [name]: value })
    }

    const handlePrivacy = (ev) => {
        let { name } = ev.target;
        setBoardPrefs({ ...boardPrefs, privacy: name })
    }
    const handleBackground = (style) => {
        console.log('style', style)
        setBoardPrefs({ ...boardPrefs, style: style })
    }
    const saveBoard = () => {
        onAddBoard(boardPrefs)
        onCloseModal()
    }
    return (
        <div>
            <div className='cover'></div>
            <div className="add-board" ref={wrapperRef}>
                {/* <div> */}
                <div className="board-controls"
                    style={boardPrefs.style.type === 'color' ? { backgroundColor: `${boardPrefs.style.background}` } : { backgroundImage: `url(${boardPrefs.style.background})` }}>
                    <input className="add-board-input" type="text" onChange={handleChange} name="title" placeholder="Add board title" autoFocus />
                    <button className="pop-up-close-btn clear-btn" onClick={onCloseModal}>
                        <span className='icon-md'><RiCloseLine /></span>
                    </button>
                    <BoardPrivacy onPrivacyChange={handlePrivacy} privacy={boardPrefs.isPrivate} />
                </div>
                {/* </div> */}
                <NewBoardBg onStyleChange={handleBackground} />
                <button onClick={saveBoard} disabled={!boardPrefs.title} className="success-btn add-board-btn">Save</button>
            </div>
        </div>
    )
}

export default AddBoard
