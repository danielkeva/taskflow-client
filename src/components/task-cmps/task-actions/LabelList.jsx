import React from 'react'

const LabelList = ({ labels }) => {
    return (
        <div className="labels-list">
            {labels.map(label => (
                <span className="label" key={label.id} style={{ backgroundColor: label.color }}>
                        {label.title}
                </span>
            ))}
        </div>
    )
}

export default LabelList
