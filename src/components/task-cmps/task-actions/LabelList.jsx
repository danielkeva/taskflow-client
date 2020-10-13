import React, { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLabels } from '../../../store/actions/boardActions';


const LabelList = ({ labels, onLabelClicked = null, expandMode }) => {
    const dispatch = useDispatch()
    const isExpanded = useSelector(state => state.board.isExpanded)

    const handleClick = (ev) => {
        ev.preventDefault();
        if (onLabelClicked !== null) {
            onLabelClicked(ev)
        } else {
            dispatch(toggleLabels()) // Using the store here to toggle all the labels in the board
        }
    }
    return (

        <div className="labels-list">
            {labels.map(label => (
                <span
                    onClick={handleClick}
                    key={label.id}
                    className={`label  ${isExpanded || expandMode ? 'label-expand' : ''}`}
                    style={{ backgroundColor: label.color }}>
                    <span className="label-title">{label.title}</span>
                </span>
            ))}
            {expandMode &&
                <button className='modal-btn'  onClick={handleClick} >
                    <IoMdAdd className="icon-md" />
                </button>}
        </div>
    )
}

export default LabelList
