import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import {RiCloseLine } from 'react-icons/ri'
import { FaListUl } from "react-icons/fa";
import useOnClickOutside from '../../hooks/useOnClickOutSide'
import ActivityLog from '../ActivityLog'
import BoardBgPicker from './BoardBgPicker'
import { useHistory, } from 'react-router-dom';

const BoardMenu = ({ isMenuOpen, closeMenu, menuBtnRef, board, onBoardUpdated }) => {
    const history = useHistory();
    const wrapperReff = useRef(null)
    const [selectedAction, setAction] = useState(null)


    useOnClickOutside(wrapperReff, () => {
        if (isMenuOpen) {
            closeMenu()
        }
    }, menuBtnRef);

    useEffect(() => {
        if (isMenuOpen) {
            setAction(null)
        }
    }, [isMenuOpen])

    useEffect(() => {
        return history.listen((location) => {
            if (wrapperReff.current.classList.contains('menu-open')) {
                closeMenu()
            }
        })
    }, [history])

    const selectAction = (action) => {
        switch (action) {
            case 'backgroundPicker':
                setAction({ ...selectedAction, type: action, title: 'Background' })
                break;
            default:
                break;
        }
    }

    const handleGoBack = () => {
        setAction(null)
    }

    return (
        <div className={`board-menu ${isMenuOpen ? 'menu-open' : '  '}`} ref={wrapperReff}>
            <div className="pop-up-header">
                <h3>{selectedAction ? selectedAction.title : 'Menu'}</h3>
                <button className="pop-up-close-btn clear-btn icon-lg" onClick={closeMenu}>
                    <RiCloseLine />
                </button>

            </div>
            { !selectedAction ?
                <div className="board-menu-content">
                    <div className="board-menu-nav">
                        <button className="clear-btn board-menu-nav-btn" onClick={() => selectAction('backgroundPicker')}>Change background</button>
                        <button className="clear-btn board-menu-nav-btn" onClick={() => selectAction('boardName')}>Change board name</button>
                        <button className="clear-btn board-menu-nav-btn">Delete board</button>
                    </div>
                    <div>
                        <div className="section-title">
                            <FaListUl className="icon-sm" />
                            <h4 className="">Activity</h4>
                        </div>

                        <ActivityLog />
                    </div>
                </div> :
                <div className="board-menu-content">
                    {selectedAction.type === 'backgroundPicker' && <BoardBgPicker onGoBack={handleGoBack} board={board} onBoardUpdated={onBoardUpdated} />}
                </div>
            }
        </div >
    )
}

export default BoardMenu
