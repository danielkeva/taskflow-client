import React, { useState } from 'react'

const NewBoardBg = ({ onStyleChange }) => {
    const coverColors = [
        '#61bd4f',
        '#ff9f1a',
        '#eb5a46',
        '#055a8c',
    ]
    const imgs = [
        'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389449/Taskflow%20backgrounds/cacjncpn6qp4qivznyaj.jpg',
        'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389449/Taskflow%20backgrounds/jukyghlsvncbyovcqvce.jpg',
        'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389422/Taskflow%20backgrounds/2.jpg',
        'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389420/Taskflow%20backgrounds/itjhqv6u26jigvxmzwsi.jpg',
        'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389394/Taskflow%20backgrounds/ponbl1heu65x22wus4ui.jpg',
    ]
    const [bgType, setBgType] = useState(null)
    const handleStyle = (background, type) => {
        onStyleChange({ background, type })
    }
    return (
        <div className="bg-section-wrapper">
            {coverColors.map((color, idx) => (
                <span
                    className='bg-item'
                    style={{ backgroundColor: color }}
                    key={idx}
                    onClick={() => handleStyle(color, 'color')}
                >
                </span>
            ))}
            {imgs.map((img, index) => (
                <span
                    style={{ backgroundImage: `url(${img})` }}
                    className={'bg-item'}
                    key={index}
                    onClick={() => handleStyle(img, 'img')}
                >
                </span>
            ))}
        </div>

    )
}

export default NewBoardBg
