import { useState } from 'react'
import { RiArrowLeftSLine } from 'react-icons/ri'

const BoardBgPicker = ({ onGoBack, board, onBoardUpdated }) => {
  const coverColors = [
    '#61bd4f',
    '#f2d600',
    '#ff9f1a',
    '#c377e0',
    '#eb5a46',
    '#055a8c',
    '#705cc1',
    '#00c2e0',
    '#ff78cb'
  ]
  const imgs = [
    'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389449/Taskflow%20backgrounds/cacjncpn6qp4qivznyaj.jpg',
    'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389449/Taskflow%20backgrounds/jukyghlsvncbyovcqvce.jpg',
    'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389422/Taskflow%20backgrounds/2.jpg',
    'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389420/Taskflow%20backgrounds/itjhqv6u26jigvxmzwsi.jpg',
    'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389420/Taskflow%20backgrounds/sltgv2lrkmcbivdxxmb3.jpg',
    'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389410/Taskflow%20backgrounds/yeozivyoaywjmj4hciwp.jpg',
    'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389409/Taskflow%20backgrounds/idhd2wg760g7xa8vsze2.jpg',
    'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389400/Taskflow%20backgrounds/t9jpmstlb7oaijmbynmw.jpg',
    'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389394/Taskflow%20backgrounds/ponbl1heu65x22wus4ui.jpg',
    'https://res.cloudinary.com/dhz1jk4k6/image/upload/v1601389391/Taskflow%20backgrounds/nnobztxqgr82swa61ne4.jpg'
  ]
  const [bgType, setBgType] = useState(null)

  const handleGoBack = () => {
    if (bgType) {
      setBgType(null)
    } else {
      onGoBack()
    }
  }
  const [loading, setLoading] = useState(false)

  const handleStyle = (background, type) => {
    if (background === board.style.background) return
    const boardCopy = JSON.parse(JSON.stringify(board))
    boardCopy.style = { background: background, type: type }
    // // setLoading(true)
    onBoardUpdated(boardCopy)
  }

  return (
    <div className="board-menu-bg-picker">
      <button className="pop-up-back-btn clear-btn icon-lg" onClick={handleGoBack}>
        <RiArrowLeftSLine />
      </button>
      {!bgType && (
        <div className="bg-picker-controls">
          <div className="bg-picker-btn" onClick={() => setBgType('photos')}>
            <span className="photos image"></span>
            <span className="bg-btn-title">Photos</span>
          </div>
          <div className="bg-picker-btn" onClick={() => setBgType('colors')}>
            <span className="colors image"></span>
            <span className="bg-btn-title">Colors</span>
          </div>
          {/* <button className="clear-btn bg-picker-btn photos" onClick={() => setBgType('photos')}><span className="bg-btn-title">Photos</span></button>
                <button className="clear-btn bg-picker-btn colors" onClick={() => setBgType('colors')}><span className="bg-btn-title">Colors</span></button> */}
        </div>
      )}
      <div>sppiner.......</div>

      {bgType === 'photos' && (
        <div className="bg-section-wrapper">
          {imgs.map((img, index) => (
            <span
              style={{ backgroundImage: `url(${img})` }}
              className={'bg-item'}
              key={index}
              onClick={() => handleStyle(img, 'img')}
            ></span>
          ))}
        </div>
      )}
      {bgType === 'colors' && (
        <div className="bg-section-wrapper">
          {coverColors.map((color, idx) => (
            <span
              className={'bg-item'}
              style={{ backgroundColor: color }}
              key={idx}
              onClick={() => handleStyle(color, 'color')}
            ></span>
          ))}
        </div>
      )}
      {/* {loading && <div className="loading">         */}

      {/* </div>} */}
    </div>
  )
}

export default BoardBgPicker
