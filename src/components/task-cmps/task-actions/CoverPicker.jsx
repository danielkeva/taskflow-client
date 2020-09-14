import React from 'react'
import { RiCloseLine } from 'react-icons/ri'
import { useState } from 'react'

const CoverPicker = ({ onCloseModal, onTaskUpdated, }) => {
    const [coverColors, setCoverColors] = useState([
        '#61bd4f',
        '#f2d600',
        '#ff9f1a',
        '#c377e0',
        '#eb5a46',
        '#055a8c',
        '#344563',
        '#00c2e0',
        '#ff78cb',
    ])
    return (
        <div className="pop-up">
            <div className="pop-up-header">
                <span className="pop-up-title">Cover</span>
                <button className="pop-up-close-btn clear-btn" onClick={onCloseModal}>
                    <RiCloseLine />
                </button>
            </div>
            <span className="pop-up-title">Colors</span>
            <div className="cover-colors">
                {coverColors.map((color, idx) => (
                    <span className="cover-color" key={idx} style={{ backgroundColor: color }}></span>
                ))}
            </div>
        </div>
    )
}

export default CoverPicker
