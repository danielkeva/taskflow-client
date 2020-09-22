import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLabels } from '../../../store/actions/boardActions';


const LabelList = ({ labels, onLabelClicked = null, expandMode }) => {
    const dispatch = useDispatch()
    const isExpanded = useSelector(state => state.board.isExpanded)
    const handleClick = (ev) => {
        ev.preventDefault();

        if (onLabelClicked !== null) {
            onLabelClicked()
        } else {
            dispatch(toggleLabels()) // Using the store here to toggle all the labels in the board
        }
    }
    return (

        <div className="labels-list" onClick={handleClick}>
            {labels.map(label => (
                <span
                    key={label.id}
                    className={`label  ${isExpanded || expandMode ? 'label-expand' : ''}`}
                    style={{ backgroundColor: label.color }}>
                    <span className="label-title">{label.title}</span>
                </span>
            ))}
        </div>
    )
}

export default LabelList
