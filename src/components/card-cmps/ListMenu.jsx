import React from 'react'
import { RiCloseLine } from "react-icons/ri";

const ListMenu = ({ onCloseMenu, onRemoveList,onAddCard }) => {
    return (
        <div className="pop-up list-menu">
            <div className="pop-up-header">
                <span className="pop-up-title">Labels</span>
                <button className="pop-up-close-btn clear-btn" onClick={() => onCloseMenu()}>
                    <RiCloseLine />
                </button>
            </div>
            <div onClick={onAddCard} >Add card</div>
            <div>Change list color</div>
            <div>Sort list by</div>
            <div onClick={onRemoveList}>Delete list</div>
        </div>
    )
}

export default ListMenu
